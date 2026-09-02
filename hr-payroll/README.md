# Flash HR

Minimal single-organization HR and payroll tracking for English and Thai-speaking administrators. The app records payroll calculations; it does not transfer money.

## Setup

1. Copy `.env.example` to `.env.local` and fill in the Neon database URL, Better Auth secret/URL, UploadThing token, and initial system administrator email.
2. Install dependencies with `pnpm install`.
3. Run `pnpm db:migrate`.
4. Run `pnpm db:seed-admin` to allowlist the first system administrator email.
5. Run `pnpm dev`, open `/auth/signup`, and create the first account with the same email.

Better Auth owns user passwords and sessions. The seed command only creates or updates the application allowlist record.

## Checks

```bash
pnpm typecheck
pnpm lint
pnpm build
```

Employee photos are uploaded to UploadThing through the replaceable, server-only adapter in `lib/storage.ts`. Upload requests run inside authenticated employee mutations and accept image files up to 5 MB.
