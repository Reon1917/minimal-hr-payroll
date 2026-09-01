import { AppShell } from "@/components/app-shell";
import { requireAdmin } from "@/lib/authorization";
import { getMessages } from "@/lib/locale";
export default async function ProtectedLayout({ children }: { children: React.ReactNode }) { const [admin, { locale, messages }] = await Promise.all([requireAdmin(), getMessages()]); return <AppShell admin={admin} locale={locale} messages={messages}>{children}</AppShell>; }
