"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { authClient } from "@/lib/auth-client";

export function AuthForm({ mode, copy, unauthorized }: {
  mode: "login" | "signup";
  copy: Record<string, string>;
  unauthorized?: boolean;
}) {
  const router = useRouter();
  const [error, setError] = useState(unauthorized ? copy.unauthorized : "");
  const [loading, setLoading] = useState(false);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    const data = new FormData(event.currentTarget);
    const email = String(data.get("email")).trim().toLowerCase();
    const password = String(data.get("password"));
    if (mode === "signup" && password !== String(data.get("confirmPassword"))) {
      setError(copy.passwordMismatch);
      return;
    }

    setLoading(true);
    try {
      const result = mode === "signup"
        ? await authClient.signUp.email({
            name: String(data.get("name")).trim(),
            email,
            password,
          })
        : await authClient.signIn.email({ email, password });
      if (result.error) {
        setError(result.error.message ?? "Unable to continue");
        return;
      }
      router.push("/dashboard");
      router.refresh();
    } catch {
      setError("Unable to connect to the server. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={submit} className="auth-form">
      {error ? <div className="auth-error" role="alert">{error}</div> : null}
      {mode === "signup" ? (
        <div>
          <label className="label" htmlFor="name">{copy.name}</label>
          <input className="input" id="name" name="name" autoComplete="name" required />
        </div>
      ) : null}
      <div>
        <label className="label" htmlFor="email">{copy.email}</label>
        <input className="input" id="email" name="email" type="email" autoComplete="email" required />
      </div>
      <div>
        <label className="label" htmlFor="password">{copy.password}</label>
        <input className="input" id="password" name="password" type="password" minLength={8} autoComplete={mode === "signup" ? "new-password" : "current-password"} required />
      </div>
      {mode === "signup" ? (
        <div>
          <label className="label" htmlFor="confirmPassword">{copy.confirmPassword}</label>
          <input className="input" id="confirmPassword" name="confirmPassword" type="password" minLength={8} autoComplete="new-password" required />
        </div>
      ) : null}
      <button className="button button-primary auth-submit" disabled={loading}>
        {loading ? "…" : mode === "signup" ? copy.signup : copy.login}
      </button>
      <p className="auth-switch">
        {mode === "signup" ? copy.hasAccount : copy.noAccount}{" "}
        <Link href={mode === "signup" ? "/auth/login" : "/auth/signup"}>
          {mode === "signup" ? copy.login : copy.signup}
        </Link>
      </p>
    </form>
  );
}
