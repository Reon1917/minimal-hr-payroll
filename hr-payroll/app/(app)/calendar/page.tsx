import { and, asc, eq, gte, lte } from "drizzle-orm";
import { ScheduleCalendar } from "@/components/schedule-calendar";
import { requireAdmin } from "@/lib/authorization";
import { calendarMonth, monthDates } from "@/lib/calendar";
import { db } from "@/lib/db";
import { employees, leaveRecords } from "@/lib/db/schema";
import { getMessages } from "@/lib/locale";

export const metadata = { title: "Calendar" };

export default async function CalendarPage({ searchParams }: { searchParams: Promise<{ month?: string | string[] }> }) {
  const [, { locale, messages }, params] = await Promise.all([requireAdmin(), getMessages("calendar"), searchParams]);
  const today = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Bangkok", year: "numeric", month: "2-digit", day: "2-digit",
  }).format(new Date());
  const month = calendarMonth(params.month, today.slice(0, 7));
  const dates = monthDates(month);
  const [staff, leaves] = await Promise.all([
    db.select({ id: employees.id, name: employees.name, role: employees.role, workSchedule: employees.workSchedule })
      .from(employees).where(eq(employees.status, "ACTIVE")).orderBy(asc(employees.name), asc(employees.id)),
    db.select({ id: leaveRecords.id, employeeId: leaveRecords.employeeId, startDate: leaveRecords.startDate, endDate: leaveRecords.endDate, reason: leaveRecords.reason })
      .from(leaveRecords).innerJoin(employees, eq(employees.id, leaveRecords.employeeId))
      .where(and(eq(employees.status, "ACTIVE"), lte(leaveRecords.startDate, dates[dates.length - 1]), gte(leaveRecords.endDate, dates[0])))
      .orderBy(asc(leaveRecords.startDate), asc(leaveRecords.id)),
  ]);

  return <div className="page calendar-page">
    <div className="page-header"><div>
      <h1 className="page-title">{messages.calendar.title}</h1>
      <p className="page-description">{messages.calendar.description}</p>
    </div></div>
    <ScheduleCalendar key={`${month}-${locale}`} month={month} today={today} employees={staff} leaves={leaves} locale={locale} copy={messages.calendar} />
  </div>;
}
