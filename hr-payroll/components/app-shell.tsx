"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useOptimistic, useState, useTransition } from "react";
import { Banknote, CalendarDays, ChevronDown, Gauge, Menu, ShieldCheck, Users, X } from "lucide-react";
import { setLocale } from "@/app/actions";
import { authClient } from "@/lib/auth-client";
import type { Locale } from "@/lib/format";
import { Brand } from "@/components/brand";

type ShellMessages = {
  nav: {
    dashboard: string;
    employees: string;
    calendar: string;
    payroll: string;
    administration: string;
    admins: string;
    logout: string;
    language: string;
    primaryNavigation: string;
    openMenu: string;
    closeMenu: string;
    systemAdministrator: string;
    hrAdministrator: string;
  };
};

export function AppShell({
  children,
  admin,
  locale,
  messages,
}: {
  children: React.ReactNode;
  admin: { name: string; role: string };
  locale: Locale;
  messages: ShellMessages;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [isLocalePending, startLocaleTransition] = useTransition();
  const [optimisticLocale, setOptimisticLocale] = useOptimistic(locale);
  const links = [
    { href: "/dashboard", label: messages.nav.dashboard, icon: Gauge },
    { href: "/employees", label: messages.nav.employees, icon: Users },
    { href: "/calendar", label: messages.nav.calendar, icon: CalendarDays },
    { href: "/payroll", label: messages.nav.payroll, icon: Banknote },
  ];

  useEffect(() => {
    document.documentElement.lang = optimisticLocale;
  }, [optimisticLocale]);

  function switchLocale(nextLocale: Locale) {
    if (nextLocale === optimisticLocale) return;
    startLocaleTransition(async () => {
      setOptimisticLocale(nextLocale);
      await setLocale(nextLocale);
    });
  }

  async function logout() {
    await authClient.signOut();
    router.push("/auth/login");
    router.refresh();
  }

  const sidebar = (
    <aside className="app-sidebar">
      <Brand className="brand" />
      <nav className="nav" aria-label={messages.nav.primaryNavigation}>
        {links.map(({ href, label, icon: Icon }) => (
          <Link key={href} href={href} onClick={() => setOpen(false)} className={`nav-link ${pathname.startsWith(href) ? "nav-link-active" : ""}`}>
            <Icon size={19} />
            {label}
          </Link>
        ))}
        {admin.role === "SYSTEM_ADMIN" ? (
          <div className="nav-group">
            <div className="nav-heading">{messages.nav.administration}</div>
            <Link href="/admins" onClick={() => setOpen(false)} className={`nav-link ${pathname.startsWith("/admins") ? "nav-link-active" : ""}`}>
              <ShieldCheck size={19} />
              {messages.nav.admins}
            </Link>
          </div>
        ) : null}
      </nav>
      <div className="sidebar-account">
        <span className="avatar">{admin.name.split(/\s+/).map((part) => part[0]).slice(0, 2).join("").toUpperCase()}</span>
        <span className="account-copy">
          <strong>{admin.name}</strong>
          <small>{admin.role === "SYSTEM_ADMIN" ? messages.nav.systemAdministrator : messages.nav.hrAdministrator}</small>
        </span>
        <button className="icon-button" onClick={logout} aria-label={messages.nav.logout} title={messages.nav.logout}><ChevronDown size={17} /></button>
      </div>
    </aside>
  );

  return (
    <div className="app-layout">
      <div className="desktop-sidebar">{sidebar}</div>
      {open ? (
        <div className="mobile-sidebar">
          <button className="sidebar-scrim" onClick={() => setOpen(false)} aria-label={messages.nav.closeMenu} />
          {sidebar}
        </div>
      ) : null}
      <div className="app-main">
        <header className="topbar">
          <button className="mobile-menu" onClick={() => setOpen(!open)} aria-label={open ? messages.nav.closeMenu : messages.nav.openMenu}>
            {open ? <X size={21} /> : <Menu size={21} />}
          </button>
          <Brand className="topbar-brand" />
          <div className="language-control" aria-label={messages.nav.language} aria-busy={isLocalePending}>
            <button type="button" lang="en" disabled={isLocalePending} aria-pressed={optimisticLocale === "en"} onClick={() => switchLocale("en")} className={optimisticLocale === "en" ? "selected" : ""}>EN</button>
            <span>/</span>
            <button type="button" lang="th" disabled={isLocalePending} aria-pressed={optimisticLocale === "th"} onClick={() => switchLocale("th")} className={optimisticLocale === "th" ? "selected" : ""}>ไทย</button>
          </div>
        </header>
        <main>{children}</main>
      </div>
    </div>
  );
}
