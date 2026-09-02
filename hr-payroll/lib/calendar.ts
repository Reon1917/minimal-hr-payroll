import type { WorkSchedule } from "@/lib/db/schema";

export type CalendarEmployee = { id: string; name: string; role: string; workSchedule: WorkSchedule };
export type CalendarLeave = { id: string; employeeId: string; startDate: string; endDate: string; reason: string };
export type DayEmployee = CalendarEmployee & { hours: WorkSchedule[keyof WorkSchedule]; leaves: CalendarLeave[] };

const weekdays = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"] as const;

export function calendarMonth(value: string | string[] | undefined, fallback: string) {
  return typeof value === "string" && /^(19|20|21)\d{2}-(0[1-9]|1[0-2])$/.test(value) ? value : fallback;
}

export function shiftMonth(month: string, offset: number) {
  const date = new Date(`${month}-01T00:00:00Z`);
  date.setUTCMonth(date.getUTCMonth() + offset);
  return date.toISOString().slice(0, 7);
}

export function monthDates(month: string) {
  const end = new Date(`${month}-01T00:00:00Z`);
  end.setUTCMonth(end.getUTCMonth() + 1, 0);
  return Array.from({ length: end.getUTCDate() }, (_, index) => `${month}-${String(index + 1).padStart(2, "0")}`);
}

export function monthRoster(month: string, employees: CalendarEmployee[], leaves: CalendarLeave[]) {
  const leavesByEmployee = new Map<string, CalendarLeave[]>();
  for (const leave of leaves) {
    const records = leavesByEmployee.get(leave.employeeId) ?? [];
    records.push(leave);
    leavesByEmployee.set(leave.employeeId, records);
  }
  return monthDates(month).map((date) => {
    const weekday = weekdays[new Date(`${date}T00:00:00Z`).getUTCDay()];
    const roster: DayEmployee[] = [];
    for (const employee of employees) {
      const hours = employee.workSchedule[weekday] ?? { working: false };
      const dayLeaves = (leavesByEmployee.get(employee.id) ?? []).filter((leave) => leave.startDate <= date && leave.endDate >= date);
      if (hours.working || dayLeaves.length) roster.push({ ...employee, hours, leaves: dayLeaves });
    }
    return { date, roster };
  });
}
