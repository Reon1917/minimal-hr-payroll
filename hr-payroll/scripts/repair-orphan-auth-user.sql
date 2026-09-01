-- Use this only when a signup was interrupted after Better Auth created the
-- user row but before it created the password account.
--
-- Change the email in `input` once, then run the whole transaction in Neon.
-- The guards prevent deletion if the user has an account or an active session.

BEGIN;

WITH input(email) AS (
  VALUES (LOWER(TRIM('your-approved-email@example.com')))
),
deleted AS (
  DELETE FROM "user" AS u
  USING input AS i
  WHERE LOWER(u.email) = i.email
    AND EXISTS (
      SELECT 1
      FROM approved_admins AS aa
      WHERE aa.email = i.email
        AND aa.status = 'ACTIVE'
    )
    AND NOT EXISTS (
      SELECT 1
      FROM account AS a
      WHERE a.user_id = u.id
    )
    AND NOT EXISTS (
      SELECT 1
      FROM session AS s
      WHERE s.user_id = u.id
    )
  RETURNING u.id, u.email, u.name
)
SELECT i.email AS target_email, d.id AS deleted_user_id,
       d.name AS deleted_user_name
FROM input AS i
LEFT JOIN deleted AS d ON TRUE;

COMMIT;

-- The approved_admins row is intentionally preserved. The user can now visit
-- /auth/signup and let Better Auth create both the user and password account.
