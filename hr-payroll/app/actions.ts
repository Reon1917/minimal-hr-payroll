"use server";

import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { approvedAdmins, employees, leaveRecords, payrollPeriods, session, user, type WorkSchedule } from "@/lib/db/schema";
import { requireAdmin, requireSystemAdmin } from "@/lib/authorization";
import { adminEmailSchema, employeeSchema, leaveSchema } from "@/lib/validation";
import { normalizeMonth } from "@/lib/format";
import { generateOrRecalculatePayroll, recalculateDraftPayroll } from "@/lib/payroll";
import { photoStorage } from "@/lib/storage";
import { cookies } from "next/headers";

const days = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"] as const;

function scheduleFromForm(formData: FormData): WorkSchedule {
  return Object.fromEntries(days.map((day) => {
    const working = formData.get(`${day}.working`) === "on";
    return [day, working ? { working, start: String(formData.get(`${day}.start`) || "09:00"), end: String(formData.get(`${day}.end`) || "18:00") } : { working: false }];
  })) as WorkSchedule;
}

async function photoFromForm(formData: FormData, existing?: string | null) {
  const file = formData.get("photo");
  return file instanceof File && file.size > 0 ? photoStorage.save(file) : existing ?? null;
}

export async function setLocale(formData: FormData) {
  const locale = formData.get("locale") === "th" ? "th" : "en";
  (await cookies()).set("locale", locale, { sameSite: "lax", maxAge: 60 * 60 * 24 * 365, path: "/" });
}

export async function createEmployee(formData: FormData) {
  const admin = await requireAdmin();
  const parsed = employeeSchema.parse({ name: formData.get("name"), role: formData.get("role"), monthlySalary: formData.get("monthlySalary") ?? "" });
  const [employee] = await db.insert(employees).values({
    name: parsed.name,
    role: parsed.role,
    monthlySalary: parsed.monthlySalary || null,
    photoUrl: await photoFromForm(formData),
    workSchedule: scheduleFromForm(formData),
    createdBy: admin.userId,
    updatedBy: admin.userId,
  }).returning({ id: employees.id });
  redirect(`/employees/${employee.id}?saved=1`);
}

export async function updateEmployee(employeeId: string, formData: FormData) {
  const admin = await requireAdmin();
  const parsed = employeeSchema.parse({ name: formData.get("name"), role: formData.get("role"), monthlySalary: formData.get("monthlySalary") ?? "" });
  const [current] = await db.select({ photoUrl: employees.photoUrl }).from(employees).where(eq(employees.id, employeeId)).limit(1);
  if (!current) throw new Error("Employee not found");
  await db.update(employees).set({
    name: parsed.name,
    role: parsed.role,
    monthlySalary: parsed.monthlySalary || null,
    photoUrl: await photoFromForm(formData, current.photoUrl),
    workSchedule: scheduleFromForm(formData),
    updatedBy: admin.userId,
    updatedAt: new Date(),
  }).where(eq(employees.id, employeeId));
  revalidatePath(`/employees/${employeeId}`);
  redirect(`/employees/${employeeId}?saved=1`);
}

export async function archiveEmployee(employeeId: string) {
  const admin = await requireAdmin();
  await db.update(employees).set({ status: "ARCHIVED", updatedBy: admin.userId, updatedAt: new Date() }).where(eq(employees.id, employeeId));
  revalidatePath("/employees");
  redirect("/employees?archived=1");
}

export async function saveLeave(employeeId: string, leaveId: string | null, formData: FormData) {
  const admin = await requireAdmin();
  const hasDeduction = formData.get("hasSalaryDeduction") === "on";
  const parsed = leaveSchema.parse({
    startDate: formData.get("startDate"), endDate: formData.get("endDate"), reason: formData.get("reason"),
    hasSalaryDeduction: hasDeduction, deductionAmount: hasDeduction ? formData.get("deductionAmount") : "0", deductionPayrollMonth: formData.get("deductionPayrollMonth"),
  });
  const values = {
    employeeId,
    startDate: parsed.startDate,
    endDate: parsed.endDate,
    reason: parsed.reason,
    hasSalaryDeduction: parsed.hasSalaryDeduction,
    deductionAmount: parsed.hasSalaryDeduction ? parsed.deductionAmount : "0.00",
    deductionPayrollMonth: normalizeMonth(parsed.deductionPayrollMonth),
    updatedBy: admin.userId,
    updatedAt: new Date(),
  };
  let oldMonth: string | undefined;
  if (leaveId) {
    const [old] = await db.select({ month: leaveRecords.deductionPayrollMonth }).from(leaveRecords).where(and(eq(leaveRecords.id, leaveId), eq(leaveRecords.employeeId, employeeId))).limit(1);
    oldMonth = old?.month;
    await db.update(leaveRecords).set(values).where(and(eq(leaveRecords.id, leaveId), eq(leaveRecords.employeeId, employeeId)));
  } else {
    await db.insert(leaveRecords).values({ ...values, createdBy: admin.userId });
  }
  await Promise.all([recalculateDraftPayroll(values.deductionPayrollMonth), oldMonth && oldMonth !== values.deductionPayrollMonth ? recalculateDraftPayroll(oldMonth) : Promise.resolve()]);
  revalidatePath(`/employees/${employeeId}`);
  redirect(`/employees/${employeeId}?leaveSaved=1`);
}

export async function deleteLeave(employeeId: string, leaveId: string) {
  await requireAdmin();
  const [record] = await db.delete(leaveRecords).where(and(eq(leaveRecords.id, leaveId), eq(leaveRecords.employeeId, employeeId))).returning({ month: leaveRecords.deductionPayrollMonth });
  if (record) await recalculateDraftPayroll(record.month);
  revalidatePath(`/employees/${employeeId}`);
}

export async function generatePayroll(formData: FormData) {
  await requireAdmin();
  const month = String(formData.get("month") ?? "");
  await generateOrRecalculatePayroll(month);
  redirect(`/payroll/${month.slice(0, 7)}?generated=1`);
}

export async function recalculatePayroll(month: string) {
  await requireAdmin();
  await generateOrRecalculatePayroll(month);
  revalidatePath(`/payroll/${month.slice(0, 7)}`);
}

export async function finalizePayroll(periodId: string, month: string) {
  const admin = await requireAdmin();
  await db.update(payrollPeriods).set({ status: "FINALIZED", finalizedAt: new Date(), finalizedBy: admin.userId, updatedAt: new Date() }).where(and(eq(payrollPeriods.id, periodId), eq(payrollPeriods.status, "DRAFT")));
  revalidatePath(`/payroll/${month}`);
}

export async function reopenPayroll(periodId: string, month: string) {
  await requireAdmin();
  await db.update(payrollPeriods).set({ status: "DRAFT", finalizedAt: null, finalizedBy: null, updatedAt: new Date() }).where(eq(payrollPeriods.id, periodId));
  await generateOrRecalculatePayroll(month);
  revalidatePath(`/payroll/${month}`);
}

export async function addApprovedAdmin(formData: FormData) {
  const admin = await requireSystemAdmin();
  const email = adminEmailSchema.parse(formData.get("email"));
  await db.insert(approvedAdmins).values({ email, role: "HR_ADMIN", status: "ACTIVE", createdBy: admin.userId }).onConflictDoUpdate({ target: approvedAdmins.email, set: { status: "ACTIVE", role: "HR_ADMIN", updatedAt: new Date() } });
  revalidatePath("/admins");
}

export async function setAdminStatus(adminId: string, status: "ACTIVE" | "REVOKED") {
  const current = await requireSystemAdmin();
  const [target] = await db.select().from(approvedAdmins).where(eq(approvedAdmins.id, adminId)).limit(1);
  if (!target || target.role === "SYSTEM_ADMIN" || target.email === current.email) throw new Error("System administrator access cannot be revoked here");
  await db.update(approvedAdmins).set({ status, updatedAt: new Date() }).where(eq(approvedAdmins.id, adminId));
  if (status === "REVOKED") {
    const linkedUsers = await db.select({ id: user.id }).from(user).where(eq(user.email, target.email));
    for (const linkedUser of linkedUsers) await db.delete(session).where(eq(session.userId, linkedUser.id));
  }
  revalidatePath("/admins");
}
