import { z } from "zod";

const money = z.string().trim().regex(/^\d+(\.\d{1,2})?$/, "Enter a valid amount with up to 2 decimal places");

export const employeeSchema = z.object({
  name: z.string().trim().min(1).max(160),
  role: z.string().trim().min(1).max(160),
  monthlySalary: z.union([z.literal(""), money]),
});

export const leaveSchema = z.object({
  startDate: z.iso.date(),
  endDate: z.iso.date(),
  reason: z.string().trim().min(1).max(1000),
  hasSalaryDeduction: z.boolean(),
  deductionAmount: z.string(),
  deductionPayrollMonth: z.string().regex(/^\d{4}-\d{2}$/),
}).superRefine((value, ctx) => {
  if (value.endDate < value.startDate) ctx.addIssue({ code: "custom", path: ["endDate"], message: "End date must be on or after the start date" });
  if (value.hasSalaryDeduction) {
    const parsed = money.safeParse(value.deductionAmount);
    if (!parsed.success || Number(value.deductionAmount) <= 0) ctx.addIssue({ code: "custom", path: ["deductionAmount"], message: "A positive deduction amount is required" });
  }
});

export const adminEmailSchema = z.email().transform((value) => value.trim().toLowerCase());

