"use client";

import Link from "next/link";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { monthRoster, shiftMonth, type CalendarEmployee, type CalendarLeave, type DayEmployee } from "@/lib/calendar";
import { formatDate, monthLabel, type Locale } from "@/lib/format";
import type calendarCopy from "@/messages/en/calendar.json";

type Copy = typeof calendarCopy;

function daySummary(roster: DayEmployee[], copy: Copy) {
  const leaveCount = roster.filter((employee) => employee.leaves.length > 0).length;
  return copy.daySummary.replace("{working}", String(roster.length - leaveCount)).replace("{leave}", String(leaveCount));
}

function DayDetails({ date, roster, locale, copy, onClose }: {
  date: string; roster: DayEmployee[]; locale: Locale; copy: Copy; onClose: () => void;
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const element = dialog.current;
    const overflow = document.body.style.overflow;
    const opener = document.activeElement;
    element?.showModal();
    document.body.style.overflow = "hidden";
    return () => {
      element?.close();
      document.body.style.overflow = overflow;
      if (opener instanceof HTMLElement && opener.isConnected) opener.focus();
    };
  }, []);

  return <dialog ref={dialog} className="dialog calendar-dialog" aria-labelledby="calendar-day-title" aria-describedby="calendar-day-summary" onCancel={(event) => { event.preventDefault(); onClose(); }} onClick={(event) => {
    if (event.target !== event.currentTarget) return;
    const bounds = event.currentTarget.getBoundingClientRect();
    if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) onClose();
  }}>
    <div className="dialog-header">
      <div><h2 id="calendar-day-title" className="section-title">{formatDate(date, locale)}</h2>
        <p id="calendar-day-summary" className="page-description">{daySummary(roster, copy)}</p></div>
      <button type="button" className="icon-button" onClick={onClose} aria-label={copy.close} autoFocus><X size={20} /></button>
    </div>
    <div className="calendar-detail-list">
      {roster.length ? roster.map((employee) => {
        const onLeave = employee.leaves.length > 0;
        const hours = employee.hours.working
          ? employee.hours.start && employee.hours.end ? `${employee.hours.start} – ${employee.hours.end}` : copy.hoursNotSet
          : copy.dayOff;
        return <div key={employee.id} className={`calendar-detail-row${onLeave ? " calendar-detail-away" : ""}`}>
          <div className="calendar-detail-heading">
            <div><Link className="employee-name" href={`/employees/${employee.id}`}>{employee.name}</Link><span className="subtle">{employee.role}</span></div>
            <span className={`status${onLeave ? "" : " status-active"}`}>{onLeave ? copy.onLeave : copy.working}</span>
          </div>
          <p className="calendar-hours">{copy.scheduledHours}: {hours}</p>
          {employee.leaves.map((leave) => <div key={leave.id} className="calendar-leave-reason">
            <strong>{leave.reason}</strong>
            <span>{formatDate(leave.startDate, locale)}{leave.endDate !== leave.startDate ? ` – ${formatDate(leave.endDate, locale)}` : ""}</span>
          </div>)}
        </div>;
      }) : <p className="calendar-detail-empty">{copy.emptyDay}</p>}
    </div>
  </dialog>;
}

export function ScheduleCalendar({ month, today, employees, leaves, locale, copy }: {
  month: string; today: string; employees: CalendarEmployee[]; leaves: CalendarLeave[]; locale: Locale; copy: Copy;
}) {
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const days = useMemo(() => monthRoster(month, employees, leaves), [month, employees, leaves]);
  const selectedDay = days.find((day) => day.date === selectedDate);
  const firstWeekday = (new Date(`${month}-01T00:00:00Z`).getUTCDay() + 6) % 7;
  const trailingDays = (7 - (firstWeekday + days.length) % 7) % 7;

  return <>
    <div className="calendar-toolbar">
      <h2 className="section-title" aria-live="polite">{monthLabel(month, locale)}</h2>
      <div className="calendar-controls">
        <Link href={`/calendar?month=${today.slice(0, 7)}`} className="button button-secondary button-small">{copy.today}</Link>
        <Link href={`/calendar?month=${shiftMonth(month, -1)}`} className="icon-button" aria-label={copy.previousMonth}><ChevronLeft size={20} /></Link>
        <Link href={`/calendar?month=${shiftMonth(month, 1)}`} className="icon-button" aria-label={copy.nextMonth}><ChevronRight size={20} /></Link>
      </div>
    </div>
    <div className="calendar-legend"><span className="status status-active">{copy.working}</span><span className="status">{copy.onLeave}</span></div>
    {!employees.length ? <div className="calendar-empty"><p>{copy.noEmployees}</p><Link href="/employees/new" className="button button-secondary button-small">{copy.addEmployee}</Link></div> : null}
    <div className="calendar-scroll" role="region" aria-label={copy.title} tabIndex={0}>
      <div className="calendar-grid">
        {copy.weekdays.map((day) => <div key={day} className="calendar-weekday">{day}</div>)}
        {Array.from({ length: firstWeekday }, (_, index) => <div key={`before-${index}`} className="calendar-blank" aria-hidden="true" />)}
        {days.map(({ date, roster }) => <button type="button" key={date} className={`calendar-day${date === today ? " calendar-day-today" : ""}`} aria-label={`${formatDate(date, locale)} · ${daySummary(roster, copy)}`} aria-haspopup="dialog" aria-current={date === today ? "date" : undefined} onClick={() => setSelectedDate(date)}>
          <span className="calendar-date">{Number(date.slice(-2))}</span>
          <span className="calendar-names">
            {roster.slice(0, 3).map((employee) => <span key={employee.id} className={`calendar-person${employee.leaves.length ? " calendar-person-away" : ""}`} title={`${employee.name} · ${employee.leaves.length ? copy.onLeave : copy.working}`}>
              <span className="calendar-person-dot" /><span className="calendar-person-name">{employee.name}</span>
              {employee.leaves.length ? <span className="sr-only">{copy.onLeave}</span> : null}
            </span>)}
            {roster.length > 3 ? <span className="calendar-more">{copy.more.replace("{count}", String(roster.length - 3))}</span> : null}
            {!roster.length ? <span className="calendar-no-shifts">{copy.emptyDay}</span> : null}
          </span>
        </button>)}
        {Array.from({ length: trailingDays }, (_, index) => <div key={`after-${index}`} className="calendar-blank" aria-hidden="true" />)}
      </div>
    </div>
    <p className="calendar-hint">{copy.hint}</p>
    {selectedDay ? <DayDetails date={selectedDay.date} roster={selectedDay.roster} locale={locale} copy={copy} onClose={() => setSelectedDate(null)} /> : null}
  </>;
}
