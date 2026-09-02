/* eslint-disable @next/next/no-img-element -- photo URLs are storage-provider supplied at runtime */
import Link from "next/link";
import { CalendarDays, FileText, UserPlus, Users } from "lucide-react";
import { and, desc, eq, gte, lt, lte, sql } from "drizzle-orm";
import { db } from "@/lib/db";
import { employees, leaveRecords, payrollPeriods, payrollRecords } from "@/lib/db/schema";
import { requireAdmin } from "@/lib/authorization";
import { formatDate, formatMoney, monthLabel } from "@/lib/format";
import { getMessages } from "@/lib/locale";

export const metadata = { title: "Dashboard" };
export default async function DashboardPage() {
  const [admin, { locale, messages }] = await Promise.all([requireAdmin(), getMessages("dashboard", "common", "employees")]);
  const today = new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Bangkok", year:"numeric",month:"2-digit",day:"2-digit" }).format(new Date());
  const month = today.slice(0,7); const monthStart=`${month}-01`;
  const [year, monthNumber] = month.split("-").map(Number);
  const nextMonthStart = `${year + (monthNumber === 12 ? 1 : 0)}-${String(monthNumber % 12 + 1).padStart(2,"0")}-01`;
  const [[counts], [leaveCount], [period], recentEmployees, recentLeaves] = await Promise.all([
    db.select({ active:sql<number>`count(*) filter (where ${employees.status}='ACTIVE')::int` }).from(employees),
    db.select({ count:sql<number>`count(*)::int` }).from(leaveRecords).where(and(lte(leaveRecords.startDate,today),gte(leaveRecords.endDate,today))),
    db.select().from(payrollPeriods).where(eq(payrollPeriods.payrollMonth,monthStart)).limit(1),
    db.select().from(employees).orderBy(desc(employees.createdAt)).limit(4),
    db.select({ leave:leaveRecords, employeeName:employees.name }).from(leaveRecords).innerJoin(employees,eq(leaveRecords.employeeId,employees.id)).where(and(gte(leaveRecords.startDate,monthStart),lt(leaveRecords.startDate,nextMonthStart))).orderBy(desc(leaveRecords.createdAt)).limit(4),
  ]);
  const [payrollTotal] = period ? await db.select({ total:sql<string>`coalesce(sum(${payrollRecords.netSalary}),0)` }).from(payrollRecords).where(eq(payrollRecords.payrollPeriodId,period.id)) : [{total:"0"}];
  const stats=[{icon:Users,value:counts?.active??0,label:messages.dashboard.activeEmployees},{icon:CalendarDays,value:leaveCount?.count??0,label:messages.dashboard.onLeave},{icon:FileText,value:period?formatMoney(payrollTotal.total,locale):"—",label:period?monthLabel(month,locale):messages.dashboard.currentPayroll},{icon:FileText,value:period?.status ? messages.common[period.status.toLowerCase() as "draft"|"finalized"] : "—",label:messages.dashboard.payrollStatus}];
  return <div className="page"><div className="page-header"><div><p className="dashboard-greeting">{messages.dashboard.greeting}, {admin.name.split(" ")[0]}</p><h1 className="page-title">{messages.dashboard.title}</h1></div><Link href="/employees/new" className="button button-primary"><UserPlus size={17}/>{messages.employees.add}</Link></div><div className="summary-row">{stats.map(({icon:Icon,value,label})=><div className="summary-item" key={label}><Icon size={25}/><div><strong>{value}</strong><span>{label}</span></div></div>)}</div><section className="dashboard-section"><h2 className="section-title">{messages.dashboard.thisMonth}</h2>{recentLeaves.length ? <div className="activity-list">{recentLeaves.map(({leave,employeeName})=><Link href={`/employees/${leave.employeeId}`} key={leave.id} className="activity-row"><span className="activity-icon"><CalendarDays size={17}/></span><span><strong>{employeeName}</strong> · {leave.reason}</span><time>{formatDate(leave.startDate,locale)}</time></Link>)}</div>:<p className="empty-line">{messages.dashboard.noActivity}</p>}</section><section className="dashboard-section"><h2 className="section-title">{messages.dashboard.recentEmployees}</h2>{recentEmployees.length?<div className="table-wrap"><table className="data-table"><thead><tr><th>{messages.employees.name}</th><th>{messages.employees.role}</th><th className="money">{messages.employees.salary}</th><th>{messages.employees.status}</th></tr></thead><tbody>{recentEmployees.map(e=><tr key={e.id}><td><div className="employee-cell"><span className="avatar">{e.photoUrl?<img src={e.photoUrl} alt=""/>:e.name.slice(0,2).toUpperCase()}</span><Link href={`/employees/${e.id}`} className="employee-name">{e.name}</Link></div></td><td>{e.role}</td><td className="money">{formatMoney(e.monthlySalary,locale)??messages.common.notSet}</td><td><span className={`status ${e.status==="ACTIVE"?"status-active":""}`}>{e.status==="ACTIVE"?messages.common.active:messages.common.archived}</span></td></tr>)}</tbody></table></div>:<p className="empty-line">{messages.employees.noEmployees}</p>}</section></div>;
}
