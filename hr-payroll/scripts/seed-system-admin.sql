-- Run this after applying the Drizzle migration.
-- Change the email in `input` once, then run the whole statement in Neon.

WITH input(email) AS (
  VALUES (LOWER(TRIM('your-admin@example.com')))
),
upserted AS (
  INSERT INTO approved_admins (email, role, status)
  SELECT email, 'SYSTEM_ADMIN', 'ACTIVE'
  FROM input
  ON CONFLICT (email) DO UPDATE
  SET
    role = 'SYSTEM_ADMIN',
    status = 'ACTIVE',
    updated_at = NOW()
  RETURNING id, email, role, status, created_at, updated_at
)
SELECT *
FROM upserted;
