import {
  boolean,
  date,
  index,
  jsonb,
  numeric,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from "drizzle-orm/pg-core";

export const adminRole = pgEnum("admin_role", ["SYSTEM_ADMIN", "HR_ADMIN"]);
export const adminStatus = pgEnum("admin_status", ["ACTIVE", "REVOKED"]);
export const employeeStatus = pgEnum("employee_status", ["ACTIVE", "ARCHIVED"]);
export const payrollStatus = pgEnum("payroll_status", ["DRAFT", "FINALIZED"]);

export type WorkDay = { working: boolean; start?: string; end?: string };
export type WorkSchedule = Record<
  "monday" | "tuesday" | "wednesday" | "thursday" | "friday" | "saturday" | "sunday",
  WorkDay
>;

// Better Auth managed tables.
export const user = pgTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("email_verified").notNull().default(false),
  image: text("image"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const session = pgTable("session", {
  id: text("id").primaryKey(),
  expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
  token: text("token").notNull().unique(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  userId: text("user_id").notNull().references(() => user.id, { onDelete: "cascade" }),
});

export const account = pgTable("account", {
  id: text("id").primaryKey(),
  issuer: text("issuer").notNull(),
  accountId: text("account_id").notNull(),
  providerId: text("provider_id").notNull(),
  userId: text("user_id").notNull().references(() => user.id, { onDelete: "cascade" }),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  idToken: text("id_token"),
  accessTokenExpiresAt: timestamp("access_token_expires_at", { withTimezone: true }),
  refreshTokenExpiresAt: timestamp("refresh_token_expires_at", { withTimezone: true }),
  scope: text("scope"),
  password: text("password"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
}, (table) => [
  uniqueIndex("account_issuer_account_id_unique").on(table.issuer, table.accountId),
  index("account_user_id_idx").on(table.userId),
]);

export const verification = pgTable("verification", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const approvedAdmins = pgTable("approved_admins", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: text("email").notNull(),
  role: adminRole("role").notNull(),
  status: adminStatus("status").notNull().default("ACTIVE"),
  createdBy: text("created_by").references(() => user.id),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
}, (table) => [uniqueIndex("approved_admins_email_unique").on(table.email)]);

export const employees = pgTable("employees", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  photoUrl: text("photo_url"),
  role: text("role").notNull(),
  monthlySalary: numeric("monthly_salary", { precision: 12, scale: 2 }),
  workSchedule: jsonb("work_schedule").$type<WorkSchedule>().notNull(),
  status: employeeStatus("status").notNull().default("ACTIVE"),
  createdBy: text("created_by").references(() => user.id),
  updatedBy: text("updated_by").references(() => user.id),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const leaveRecords = pgTable("leave_records", {
  id: uuid("id").primaryKey().defaultRandom(),
  employeeId: uuid("employee_id").notNull().references(() => employees.id, { onDelete: "restrict" }),
  startDate: date("start_date").notNull(),
  endDate: date("end_date").notNull(),
  reason: text("reason").notNull(),
  hasSalaryDeduction: boolean("has_salary_deduction").notNull().default(false),
  deductionAmount: numeric("deduction_amount", { precision: 12, scale: 2 }).notNull().default("0"),
  deductionPayrollMonth: date("deduction_payroll_month").notNull(),
  createdBy: text("created_by").references(() => user.id),
  updatedBy: text("updated_by").references(() => user.id),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const payrollPeriods = pgTable("payroll_periods", {
  id: uuid("id").primaryKey().defaultRandom(),
  payrollMonth: date("payroll_month").notNull().unique(),
  status: payrollStatus("status").notNull().default("DRAFT"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  finalizedAt: timestamp("finalized_at", { withTimezone: true }),
  finalizedBy: text("finalized_by").references(() => user.id),
});

export const payrollRecords = pgTable("payroll_records", {
  id: uuid("id").primaryKey().defaultRandom(),
  payrollPeriodId: uuid("payroll_period_id").notNull().references(() => payrollPeriods.id, { onDelete: "cascade" }),
  employeeId: uuid("employee_id").notNull().references(() => employees.id, { onDelete: "restrict" }),
  baseSalarySnapshot: numeric("base_salary_snapshot", { precision: 12, scale: 2 }),
  leaveDeductionTotal: numeric("leave_deduction_total", { precision: 12, scale: 2 }).notNull().default("0"),
  netSalary: numeric("net_salary", { precision: 12, scale: 2 }),
  deductionExceedsSalary: boolean("deduction_exceeds_salary").notNull().default(false),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
}, (table) => [uniqueIndex("payroll_record_period_employee_unique").on(table.payrollPeriodId, table.employeeId)]);

export const organizationSettings = pgTable("organization_settings", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull().default("My organization"),
  currency: text("currency").notNull().default("THB"),
  timezone: text("timezone").notNull().default("Asia/Bangkok"),
  defaultLocale: text("default_locale").notNull().default("en"),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const authSchema = { user, session, account, verification };
