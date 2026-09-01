import "server-only";
import { betterAuth } from "better-auth";
import { APIError } from "better-auth/api";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { nextCookies } from "better-auth/next-js";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { approvedAdmins, authSchema } from "@/lib/db/schema";

export const auth = betterAuth({
  baseURL: process.env.BETTER_AUTH_URL,
  secret: process.env.BETTER_AUTH_SECRET ?? "development-only-secret-change-before-production-32chars",
  database: drizzleAdapter(db, { provider: "pg", schema: authSchema }),
  emailAndPassword: { enabled: true, minPasswordLength: 8 },
  user: { changeEmail: { enabled: false }, deleteUser: { enabled: false } },
  databaseHooks: {
    user: {
      create: {
        before: async (newUser) => {
          const email = newUser.email.trim().toLowerCase();
          const [approval] = await db
            .select({ status: approvedAdmins.status })
            .from(approvedAdmins)
            .where(eq(approvedAdmins.email, email))
            .limit(1);
          if (!approval || approval.status !== "ACTIVE") {
            throw new APIError("FORBIDDEN", {
              message: "Your email has not been authorized to access this system.",
            });
          }
          return { data: { ...newUser, email } };
        },
      },
    },
  },
  plugins: [nextCookies()],
});

