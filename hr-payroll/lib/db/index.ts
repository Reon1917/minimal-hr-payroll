import "server-only";
import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";
import * as schema from "./schema";

const connectionString = process.env.DATABASE_URL ?? "postgresql://user:password@localhost:5432/hr_payroll";

const globalForDb = globalThis as unknown as {
  hrPayrollDb?: {
    connectionString: string;
    client: ReturnType<typeof postgres>;
  };
};
const sql = globalForDb.hrPayrollDb?.connectionString === connectionString
  ? globalForDb.hrPayrollDb.client
  : postgres(connectionString, { prepare: false, max: 5 });
if (process.env.NODE_ENV !== "production") {
  globalForDb.hrPayrollDb = { connectionString, client: sql };
}

export const db = drizzle(sql, { schema });
