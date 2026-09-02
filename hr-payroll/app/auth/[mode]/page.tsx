import { redirect } from "next/navigation";
import { AuthForm } from "@/components/auth-form";
import { Brand } from "@/components/brand";
import { getAuthorizedAdmin } from "@/lib/authorization";
import { getMessages } from "@/lib/locale";
export default async function AuthPage({ params, searchParams }: { params: Promise<{ mode: string }>; searchParams: Promise<{ reason?: string }> }) { const [{ mode }, query, admin, { messages }] = await Promise.all([params, searchParams, getAuthorizedAdmin(), getMessages("auth")]); if (admin) redirect("/dashboard"); if (mode !== "login" && mode !== "signup") redirect("/auth/login"); return <main className="auth-page"><div className="auth-panel"><Brand className="auth-brand"/><h1>{mode === "signup" ? messages.auth.signup : messages.auth.login}</h1><p>{messages.auth.subtitle}</p><AuthForm mode={mode} copy={messages.auth} unauthorized={query.reason === "unauthorized"} /></div></main>; }
