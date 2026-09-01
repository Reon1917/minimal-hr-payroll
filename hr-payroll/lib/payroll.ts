import "server-only";
import { and, eq, inArray, sql } from "drizzle-orm";
import { db } from "@/lib/db";
import { employees, leaveRecords, payrollPeriods, payrollRecords } from "@/lib/db/schema";
import { normalizeMonth } from "@/lib/format";

function toCents(value: string) {
  const [whole, decimal = ""] = value.split(".");
  return BigInt(whole) * BigInt(100) + BigInt(decimal.padEnd(2, "0").slice(0, 2));
}

function fromCents(value: bigint) {
  const zero = BigInt(0);
  const hundred = BigInt(100);
  const sign = value < zero ? "-" : "";
  const absolute = value < zero ? -value : value;
  return `${sign}${absolute / hundred}.${(absolute % hundred).toString().padStart(2, "0")}`;
}

export async function generateOrRecalculatePayroll(rawMonth: string) {
  const month = normalizeMonth(rawMonth);
  return db.transaction(async (tx) => {
    const [existing] = await tx.select().from(payrollPeriods).where(eq(payrollPeriods.payrollMonth, month)).limit(1);
    if (existing?.status === "FINALIZED") throw new Error("Finalized payroll cannot be recalculated");
    const [period] = existing
      ? [existing]
      : await tx.insert(payrollPeriods).values({ payrollMonth: month }).returning();

    const activeEmployees = await tx.select().from(employees).where(eq(employees.status, "ACTIVE"));
    const ids = activeEmployees.map((employee) => employee.id);
    const deductions = ids.length
      ? await tx
          .select({ employeeId: leaveRecords.employeeId, total: sql<string>`coalesce(sum(${leaveRecords.deductionAmount}), 0)` })
          .from(leaveRecords)
          .where(and(eq(leaveRecords.deductionPayrollMonth, month), eq(leaveRecords.hasSalaryDeduction, true), inArray(leaveRecords.employeeId, ids)))
          .groupBy(leaveRecords.employeeId)
      : [];
    const deductionMap = new Map(deductions.map((item) => [item.employeeId, item.total]));

    await tx.delete(payrollRecords).where(eq(payrollRecords.payrollPeriodId, period.id));
    if (activeEmployees.length) {
      await tx.insert(payrollRecords).values(activeEmployees.map((employee) => {
        const deduction = deductionMap.get(employee.id) ?? "0.00";
        if (employee.monthlySalary === null) {
          return { payrollPeriodId: period.id, employeeId: employee.id, baseSalarySnapshot: null, leaveDeductionTotal: deduction, netSalary: null };
        }
        const salaryCents = toCents(employee.monthlySalary);
        const deductionCents = toCents(deduction);
        return {
          payrollPeriodId: period.id,
          employeeId: employee.id,
          baseSalarySnapshot: employee.monthlySalary,
          leaveDeductionTotal: deduction,
          netSalary: fromCents(salaryCents > deductionCents ? salaryCents - deductionCents : BigInt(0)),
          deductionExceedsSalary: deductionCents > salaryCents,
        };
      }));
    }
    await tx.update(payrollPeriods).set({ updatedAt: new Date() }).where(eq(payrollPeriods.id, period.id));
    return period;
  });
}

export async function recalculateDraftPayroll(rawMonth: string) {
  const month = normalizeMonth(rawMonth);
  const [period] = await db.select({ status: payrollPeriods.status }).from(payrollPeriods).where(eq(payrollPeriods.payrollMonth, month)).limit(1);
  if (period?.status === "DRAFT") await generateOrRecalculatePayroll(month);
}
