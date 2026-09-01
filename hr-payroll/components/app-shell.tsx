"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { Banknote, ChevronDown, Gauge, Menu, ShieldCheck, Users, X } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { setLocale } from "@/app/actions";
import type { Locale } from "@/lib/format";

type ShellMessages = { nav: { dashboard: string; employees: string; payroll: string; administration: string; admins: string; logout: string } };
export function AppShell({ children, admin, locale, messages }: { children: React.ReactNode; admin: { name: string; role: string }; locale: Locale; messages: ShellMessages }) {
  const pathname = usePathname(); const router = useRouter(); const [open, setOpen] = useState(false); const [, startTransition] = useTransition();
  const links = [{ href: "/dashboard", label: messages.nav.dashboard, icon: Gauge }, { href: "/employees", label: messages.nav.employees, icon: Users }, { href: "/payroll", label: messages.nav.payroll, icon: Banknote }];
  function switchLocale(nextLocale: Locale) { const data = new FormData(); data.set("locale", nextLocale); startTransition(async () => { await setLocale(data); router.refresh(); }); }
  async function logout() { await authClient.signOut(); router.push("/auth/login"); router.refresh(); }
  const sidebar = <aside className="app-sidebar"><div className="brand"><span className="brand-mark">P</span><span>PeoplePay</span></div><nav className="nav" aria-label="Primary navigation">
    {links.map(({ href, label, icon: Icon }) => <Link key={href} href={href} onClick={() => setOpen(false)} className={`nav-link ${pathname.startsWith(href) ? "nav-link-active" : ""}`}><Icon size={19} />{label}</Link>)}
    {admin.role === "SYSTEM_ADMIN" ? <div className="nav-group"><div className="nav-heading">{messages.nav.administration}</div><Link href="/admins" onClick={() => setOpen(false)} className={`nav-link ${pathname.startsWith("/admins") ? "nav-link-active" : ""}`}><ShieldCheck size={19} />{messages.nav.admins}</Link></div> : null}
  </nav><div className="sidebar-account"><span className="avatar">{admin.name.split(/\s+/).map((part) => part[0]).slice(0, 2).join("").toUpperCase()}</span><span className="account-copy"><strong>{admin.name}</strong><small>{admin.role === "SYSTEM_ADMIN" ? "System administrator" : "HR administrator"}</small></span><button className="icon-button" onClick={logout} aria-label={messages.nav.logout} title={messages.nav.logout}><ChevronDown size={17} /></button></div></aside>;
  return <div className="app-layout"><div className="desktop-sidebar">{sidebar}</div>{open ? <div className="mobile-sidebar"><button className="sidebar-scrim" onClick={() => setOpen(false)} aria-label="Close menu" />{sidebar}</div> : null}<div className="app-main"><header className="topbar"><button className="mobile-menu" onClick={() => setOpen(!open)} aria-label="Open menu">{open ? <X size={21} /> : <Menu size={21} />}</button><span className="topbar-greeting">PeoplePay</span><div className="language-control" aria-label="Language"><button onClick={() => switchLocale("en")} className={locale === "en" ? "selected" : ""}>EN</button><span>/</span><button onClick={() => switchLocale("th")} className={locale === "th" ? "selected" : ""}>ไทย</button></div></header><main>{children}</main></div></div>;
}
