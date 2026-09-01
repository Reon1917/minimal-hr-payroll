import "server-only";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { approvedAdmins } from "@/lib/db/schema";

export type AuthorizedAdmin = {
  userId: string;
  name: string;
  email: string;
  role: "SYSTEM_ADMIN" | "HR_ADMIN";
};

export async function getAuthorizedAdmin(): Promise<AuthorizedAdmin | null> {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user?.email) return null;
  const email = session.user.email.trim().toLowerCase();
  const [approval] = await db
    .select({ role: approvedAdmins.role, status: approvedAdmins.status })
    .from(approvedAdmins)
    .where(eq(approvedAdmins.email, email))
    .limit(1);
  if (!approval || approval.status !== "ACTIVE") return null;
  return {
    userId: session.user.id,
    name: session.user.name,
    email,
    role: approval.role,
  };
}

export async function requireAdmin(): Promise<AuthorizedAdmin> {
  const admin = await getAuthorizedAdmin();
  if (!admin) redirect("/auth/login?reason=unauthorized");
  return admin;
}

export async function requireSystemAdmin(): Promise<AuthorizedAdmin> {
  const admin = await requireAdmin();
  if (admin.role !== "SYSTEM_ADMIN") redirect("/dashboard?reason=forbidden");
  return admin;
}

