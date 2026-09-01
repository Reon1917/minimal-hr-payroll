import postgres from "postgres";
import { loadEnvConfig } from "@next/env";

loadEnvConfig(process.cwd());

async function main() {
  const connectionString = process.env.DATABASE_URL;
  const rawEmail = process.env.INITIAL_SYSTEM_ADMIN_EMAIL;
  if (!connectionString) throw new Error("DATABASE_URL is required");
  if (!rawEmail) throw new Error("INITIAL_SYSTEM_ADMIN_EMAIL is required");
  const email = rawEmail.trim().toLowerCase();
  if (!/^\S+@\S+\.\S+$/.test(email)) throw new Error("INITIAL_SYSTEM_ADMIN_EMAIL must be a valid email address");

  const sql = postgres(connectionString, { prepare: false, max: 1 });
  await sql`
    insert into approved_admins (email, role, status)
    values (${email}, 'SYSTEM_ADMIN', 'ACTIVE')
    on conflict (email) do update
    set role = 'SYSTEM_ADMIN', status = 'ACTIVE', updated_at = now()
  `;
  await sql.end();
  console.log(`System administrator allowlisted: ${email}`);
}

void main();
