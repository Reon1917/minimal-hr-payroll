# Minimal HR & Payroll Tracking System

## Business Requirements & AI Implementation Specification

**Document version:** 1.0
**Status:** MVP Requirements
**Primary currency:** Thai Baht (THB)
**Supported UI languages:** English (`en`) and Thai (`th`)
**Application type:** Internal company HR/payroll management system
**Architecture:** One deployment / codebase instance represents one company or organization.

---

# 1. Project Overview

This project is a minimal internal HR and payroll tracking system.

The application is designed for small organizations that need to:

* Maintain employee profiles.
* Maintain employee salary information.
* Maintain employee work schedules.
* Record employee leave.
* Record salary deductions caused by leave.
* Calculate and store monthly payroll records.
* View payroll history.
* Allow authorized HR administrators to manage the system.

The application **does not transfer money or perform payroll transactions**.

It only calculates, records, and tracks payroll information.

---

# 2. Core Product Principles

The MVP should remain intentionally simple.

The system should:

1. Be easy for HR staff to use.
2. Avoid unnecessary enterprise HR features.
3. Require very little setup.
4. Support one organization per deployment.
5. Keep payroll calculations transparent.
6. Keep employee accounts out of scope for the initial version.
7. Leave the architecture open for employee-facing functionality in the future.

Do not introduce unnecessary complexity unless required by this specification.

---

# 3. Technical Stack

The existing repository already contains a Next.js application.

Use the following stack.

```text
Framework:       Next.js
Language:        TypeScript
Package Manager: pnpm
Database:        PostgreSQL
Database Host:   NeonDB / Neon Postgres
Authentication:  Better Auth
Currency:        THB
Locales:         English + Thai
```

Use the existing project structure and dependencies where reasonable.

Do not initialize another Next.js application inside the repository.

If an ORM/database abstraction already exists, use it.

If none exists, a lightweight PostgreSQL ORM such as Drizzle ORM is recommended.

---

# 4. Application Scope

## Included in MVP

The MVP contains these major modules:

```text
Authentication
    │
    ├── System Administrator
    └── HR Administrator

Employee Management
    │
    ├── Employee Profile
    ├── Employee Photo
    ├── Role
    ├── Salary
    └── Work Schedule

Leave Management
    │
    ├── Leave Date
    ├── Leave Reason
    ├── Salary Deduction?
    └── Deduction Amount

Payroll
    │
    ├── Monthly Payroll
    ├── Base Salary
    ├── Leave Deductions
    ├── Net Salary
    └── Payroll History

Administration
    │
    └── Approved Admin Emails

Localization
    │
    ├── English
    └── Thai
```

---

# 5. Explicitly Out of Scope

Do **not** implement the following for the MVP unless specifically requested later.

* Actual bank transfers.
* Payment gateways.
* PromptPay payments.
* Payroll transactions.
* Tax filing.
* Social security filing.
* Automated government submissions.
* Recruitment.
* Job applications.
* Performance reviews.
* Employee benefits management.
* Expense reimbursement.
* Employee self-service portal.
* Employee login.
* Employee attendance clock-in.
* Biometric attendance.
* Face recognition.
* GPS attendance.
* Shift scheduling optimization.
* Complex payroll taxation.
* Automatic Thai tax calculation.
* Accounting software integration.
* Multi-company support.
* Multi-tenant SaaS architecture.
* Public registration.
* Mobile application.

---

# 6. Organization Model

The system uses a **single organization per deployment** model.

```text
Deployment A
└── Company A
    ├── System Admin
    ├── HR Admins
    ├── Employees
    ├── Leave Records
    └── Payroll Records
```

There is no organization selector.

There is no tenant ID required throughout normal business tables.

The application should assume that all data belongs to the organization represented by the deployment.

A small organization configuration record may exist for:

* Organization name.
* Currency.
* Timezone.
* Default locale.

Recommended defaults:

```text
Currency: THB
Timezone: Asia/Bangkok
Default Locale: en
Supported Locales:
- en
- th
```

---

# 7. User Roles

There are currently only two authenticated application roles.

```text
SYSTEM_ADMIN
HR_ADMIN
```

Employees are **not users**.

Employees only have profiles stored inside the system.

---

# 8. Permission Matrix

| Action                  | System Admin | HR Admin |
| ----------------------- | -----------: | -------: |
| Login                   |          Yes |      Yes |
| View dashboard          |          Yes |      Yes |
| View employees          |          Yes |      Yes |
| Add employee            |          Yes |      Yes |
| Edit employee           |          Yes |      Yes |
| Archive employee        |          Yes |      Yes |
| View salary             |          Yes |      Yes |
| Edit salary             |          Yes |      Yes |
| Manage work schedule    |          Yes |      Yes |
| Add leave record        |          Yes |      Yes |
| Edit leave record       |          Yes |      Yes |
| Delete leave record     |          Yes |      Yes |
| View payroll            |          Yes |      Yes |
| Generate payroll        |          Yes |      Yes |
| Finalize payroll        |          Yes |      Yes |
| View payroll history    |          Yes |      Yes |
| Add HR admin            |          Yes |       No |
| Remove/revoke HR admin  |          Yes |       No |
| View administrator list |          Yes |       No |

All permission checks MUST also occur on the server.

Hiding a button in the UI is not sufficient authorization.

---

# 9. Authentication Model

Authentication must use **Better Auth**.

The system does not allow unrestricted signup.

A person may only create an account if their email address has already been approved.

---

# 10. Approved Email Signup System

The system uses an email allowlist.

Conceptually:

```text
Administrator adds email
        │
        ▼
Email stored in approved_admins
        │
        ▼
User visits signup/login
        │
        ▼
Better Auth identifies email
        │
        ▼
Is email approved?
     ┌──┴───┐
    NO      YES
    │        │
 Block      Allow account
signup      creation/login
```

---

# 11. Initial System Administrator

There is no UI for creating the first system administrator.

The first System Administrator must be seeded directly through the database.

Recommended workflow:

```text
Database
    │
    ▼
Insert approved email
role = SYSTEM_ADMIN
    │
    ▼
System Administrator signs up
    │
    ▼
Better Auth creates auth account
    │
    ▼
Application recognizes
SYSTEM_ADMIN permission
```

Example conceptual record:

```text
email: admin@example.com
role: SYSTEM_ADMIN
status: ACTIVE
```

Do not manually insert password hashes or manually construct Better Auth authentication records.

The system administrator should instead be inserted into the application's approved-user table.

Better Auth remains responsible for account creation and authentication.

---

# 12. HR Administrator Creation Flow

Only a System Administrator may authorize HR administrators.

Flow:

```text
SYSTEM ADMIN
     │
     ▼
Admin Management
     │
     ▼
Add HR Admin
     │
     ▼
Enter email
     │
     ▼
Save
     │
     ▼
Email is now approved
     │
     ▼
HR Admin can sign up
     │
     ▼
Better Auth account created
     │
     ▼
Role = HR_ADMIN
```

The email comparison should be case-insensitive.

Normalize email addresses before comparisons.

Example:

```text
John.Doe@gmail.com

should match

john.doe@gmail.com
```

---

# 13. Unauthorized Signup

If someone attempts to register with an email not present in the approved administrators table:

The account MUST NOT receive application access.

Show a message similar to:

```text
Your email has not been authorized to access this system.
Please contact your system administrator.
```

Thai translation must also exist.

---

# 14. Administrator Revocation

System administrators should be able to disable HR administrators.

Recommended admin statuses:

```text
ACTIVE
REVOKED
```

If an approved administrator becomes `REVOKED`:

* Existing application sessions should no longer provide system access.
* The Better Auth user record does not need to be deleted.
* Historical references to that administrator should remain intact.

---

# 15. Employee Model

Employees are business records and are NOT authentication users.

Minimum employee information:

```text
Employee
├── Name
├── Picture
├── Role
├── Salary
└── Work Schedule
```

---

# 16. Employee Fields

Minimum fields:

| Field         | Type                  |    Required |
| ------------- | --------------------- | ----------: |
| ID            | UUID / database ID    |         Yes |
| Name          | String                |         Yes |
| Picture       | URL / image reference |          No |
| Role          | String                |         Yes |
| Salary        | Decimal               |          No |
| Work Schedule | Structured data       |         Yes |
| Status        | Enum                  |         Yes |
| Created At    | Timestamp             |         Yes |
| Updated At    | Timestamp             |         Yes |
| Created By    | Admin reference       | Recommended |
| Updated By    | Admin reference       | Recommended |

Recommended employee statuses:

```text
ACTIVE
ARCHIVED
```

Avoid hard deleting employees whenever possible.

Historical payroll records should remain available after an employee leaves the organization.

---

# 17. Employee Name

Employee name is free text.

Example:

```text
Lin Myat Phyo
```

No complex first-name / middle-name / last-name model is necessary for MVP.

Use:

```text
name
```

instead of splitting names into multiple fields.

This is also more compatible with Thai and international names.

---

# 18. Employee Role

Employee role must be a free-text field.

Do NOT implement a role dropdown or fixed role selector.

Examples:

```text
Software Engineer
Senior Accountant
Coding Instructor
HR Officer
Branch Manager
```

HR administrators should simply type the employee's role.

---

# 19. Employee Salary

Salary represents the employee's monthly base salary.

Currency:

```text
THB
```

Salary should use a decimal/numeric database type.

Do NOT store salary using floating-point values.

Recommended database type:

```sql
NUMERIC(12,2)
```

Example:

```text
25000.00
```

Salary is optional.

An employee may be created without salary information.

Example UI:

```text
Monthly Salary

[ ฿ __________________ ]

Optional
```

If salary is not set:

```text
Salary: Not Set
```

The employee may still:

* Exist in the system.
* Have leave records.
* Have their profile edited.

They should not receive a calculated payroll amount until salary is available.

---

# 20. Employee Photo

Employee profiles may contain a photo.

Users should have two ways to provide the photo.

```text
Employee Photo
    │
    ├── Take Photo
    │      └── Webcam
    │
    └── Upload Photo
           └── Local File
```

---

# 21. Webcam Capture

The browser should support taking an employee picture directly using:

```javascript
navigator.mediaDevices.getUserMedia()
```

This should work with:

* Integrated laptop webcams.
* USB webcams.
* Other browser-accessible cameras.

Expected flow:

```text
Add / Edit Employee
        │
        ▼
Take Photo
        │
        ▼
Browser asks camera permission
        │
        ▼
Camera Preview
        │
        ▼
Capture
        │
        ▼
Preview Captured Photo
        │
        ├── Retake
        └── Use Photo
```

If camera permission is denied:

* Do not block employee creation.
* Show an understandable error.
* Allow file upload instead.

---

# 22. Image Storage

Do not store large base64 image strings directly inside normal employee records.

Preferred architecture:

```text
Browser
   │
   ▼
Image Upload
   │
   ▼
Object / File Storage
   │
   ▼
Photo URL
   │
   ▼
PostgreSQL employee.photo_url
```

The database should store a photo reference or URL.

If the repository already has an image-storage solution, reuse it.

If production image storage has not yet been selected, implement the storage layer so that the provider can be replaced without changing employee business logic.

---

# 23. Work Schedule

Each employee must have a basic weekly work schedule.

Recommended representation:

```text
Monday      09:00 - 18:00
Tuesday     09:00 - 18:00
Wednesday   09:00 - 18:00
Thursday    09:00 - 18:00
Friday      09:00 - 18:00
Saturday    Off
Sunday      Off
```

Recommended schedule structure:

```json
{
  "monday": {
    "working": true,
    "start": "09:00",
    "end": "18:00"
  },
  "tuesday": {
    "working": true,
    "start": "09:00",
    "end": "18:00"
  },
  "wednesday": {
    "working": true,
    "start": "09:00",
    "end": "18:00"
  },
  "thursday": {
    "working": true,
    "start": "09:00",
    "end": "18:00"
  },
  "friday": {
    "working": true,
    "start": "09:00",
    "end": "18:00"
  },
  "saturday": {
    "working": false
  },
  "sunday": {
    "working": false
  }
}
```

A PostgreSQL `JSONB` field is acceptable for the MVP.

Do not build a complex shift management engine.

---

# 24. Employee List

The employee page should show a simple table or card list.

Minimum information:

```text
Photo
Name
Role
Salary
Status
Actions
```

Example:

```text
┌───────┬──────────────────┬───────────────────┬───────────┬────────┐
│ Photo │ Name             │ Role              │ Salary    │ Status │
├───────┼──────────────────┼───────────────────┼───────────┼────────┤
│ 👤    │ Somchai Prasert  │ Branch Manager    │ ฿35,000   │ Active │
│ 👤    │ Narin Chai       │ Accountant        │ ฿28,000   │ Active │
│ 👤    │ Malee Wong       │ Assistant         │ Not Set   │ Active │
└───────┴──────────────────┴───────────────────┴───────────┴────────┘
```

Useful actions:

```text
View
Edit
Add Leave
Archive
```

---

# 25. Employee Search

Employee management should provide basic search.

Search by:

* Employee name.
* Role.

Advanced filtering is not required.

---

# 26. Leave Management

Employees do not submit leave requests themselves in MVP.

An employee communicates their leave request outside the system.

An HR Admin or System Admin records the leave in the system.

Example:

```text
Employee tells HR they need leave
        │
        ▼
HR opens employee
        │
        ▼
Add Leave
        │
        ▼
Leave Modal
        │
        ▼
HR enters details
        │
        ▼
Save
```

---

# 27. Leave Modal

The application should provide an "Add Leave" modal.

Required fields:

```text
Leave Start Date
Leave End Date
Leave Reason
Salary Deduction?
Deduction Amount
```

Example:

```text
┌─────────────────────────────────────┐
│ Add Leave                           │
│                                     │
│ Employee                            │
│ Somchai Prasert                     │
│                                     │
│ Start Date                          │
│ [ 12/09/2026 ]                      │
│                                     │
│ End Date                            │
│ [ 13/09/2026 ]                      │
│                                     │
│ Reason                              │
│ [ Personal leave_______________ ]   │
│                                     │
│ Salary Deduction?                   │
│ [✓] Yes                             │
│                                     │
│ Deduction Amount                    │
│ ฿ [ 1500.00 ]                       │
│                                     │
│             Cancel      Save Leave  │
└─────────────────────────────────────┘
```

---

# 28. Leave Fields

Recommended leave record:

| Field                   | Type           |
| ----------------------- | -------------- |
| ID                      | UUID           |
| Employee ID             | FK             |
| Start Date              | Date           |
| End Date                | Date           |
| Reason                  | Text           |
| Has Salary Deduction    | Boolean        |
| Deduction Amount        | Numeric        |
| Deduction Payroll Month | Date / YYYY-MM |
| Created By              | Admin FK       |
| Created At              | Timestamp      |
| Updated At              | Timestamp      |

---

# 29. Leave Deduction Rules

If:

```text
Salary Deduction = No
```

then:

```text
deduction_amount = 0
```

The deduction amount field should be hidden or disabled.

If:

```text
Salary Deduction = Yes
```

then:

```text
deduction_amount > 0
```

must be required.

Example:

```text
Base salary:        ฿25,000
Leave deduction:    ฿1,500
--------------------------------
Calculated payroll: ฿23,500
```

HR determines the deduction amount manually.

The system does NOT need to automatically calculate leave deduction based on daily salary.

This is intentional for the MVP.

---

# 30. Leave and Payroll Month

Every salary deduction must belong to a payroll month.

Example:

```text
Leave:
September 12-13

Deduction Payroll Month:
September 2026

Deduction:
฿1,500
```

By default, the deduction payroll month should be the month containing the leave start date.

HR may adjust the deduction payroll month if necessary.

This avoids ambiguous calculations when leave crosses a month boundary.

---

# 31. Leave Reason

Leave reason is free text.

Examples:

```text
Personal leave
Family emergency
Sick leave
Graduation ceremony
Medical appointment
```

Do not create complex leave categories in the MVP.

Leave categories can be added later.

---

# 32. Leave History

Employee details should show their leave history.

Example:

```text
Employee: Somchai

Leave History

12 Sep - 13 Sep
Personal Leave
Deduction: ฿1,500

24 Aug
Medical Appointment
Deduction: None
```

HR should be able to:

```text
Add
Edit
Delete
```

leave records.

Deleting a leave record that affects an existing payroll must trigger payroll recalculation if that payroll is still in `DRAFT`.

---

# 33. Payroll Concept

Payroll is tracked monthly.

Example periods:

```text
January 2026
February 2026
March 2026
...
September 2026
```

No custom payroll period engine is required.

---

# 34. Payroll Calculation

The MVP payroll calculation is intentionally simple.

Formula:

```text
Net Salary
=
Monthly Base Salary
-
Leave Salary Deductions
```

Example:

```text
Employee: Somchai

Base Salary                  ฿30,000
Leave Deduction              -฿1,500
------------------------------------
Calculated Salary            ฿28,500
```

No taxes or social security are automatically calculated.

---

# 35. Payroll Generation Flow

```text
HR Admin
    │
    ▼
Payroll
    │
    ▼
Select Month
    │
    ▼
Generate Payroll
    │
    ▼
Load Active Employees
    │
    ▼
Read Salary
    │
    ▼
Load Leave Deductions
    │
    ▼
Calculate Net Salary
    │
    ▼
Create Draft Payroll Records
    │
    ▼
HR Reviews
    │
    ▼
Finalize
```

---

# 36. Employees Without Salary

Employees whose salary is blank should appear in payroll with:

```text
Salary Not Set
```

They should not receive a numeric net salary.

Example:

```text
Malee Wong
Base Salary: Not Set
Payroll: Cannot Calculate
```

The payroll UI should clearly identify these employees.

---

# 37. Payroll Record

Recommended payroll record fields:

```text
id
employee_id
payroll_month

base_salary_snapshot
leave_deduction_total
net_salary

status

created_at
updated_at
finalized_at
finalized_by
```

Recommended statuses:

```text
DRAFT
FINALIZED
```

---

# 38. Salary Snapshot Rule

Payroll records MUST store a snapshot of salary at the time payroll is generated.

Example:

Employee salary in September:

```text
฿25,000
```

September payroll stores:

```text
base_salary_snapshot = 25000
```

If the employee salary changes in October to:

```text
฿30,000
```

the September payroll record MUST remain:

```text
฿25,000
```

Historical payroll must never silently change because the employee's current salary changed.

---

# 39. Deduction Snapshot

A finalized payroll record should also preserve the calculated leave deduction total.

Example:

```text
September Payroll

Base Salary Snapshot       ฿25,000
Leave Deduction Snapshot    ฿1,500
Net Salary                 ฿23,500
```

Historical payroll must remain understandable later.

---

# 40. Draft Payroll Behavior

While payroll is `DRAFT`:

Changes to:

* Employee salary.
* Leave records.
* Leave deduction amount.

may trigger recalculation.

The UI should provide:

```text
Recalculate Payroll
```

if automatic recalculation is not used.

---

# 41. Finalized Payroll Behavior

When payroll is finalized:

* Preserve payroll values.
* Do not automatically modify values from later employee/leave changes.
* Clearly indicate that payroll is finalized.

Example:

```text
September 2026

Status: FINALIZED
```

For the MVP, finalized payroll may be reverted back to draft by an authorized admin if corrections are necessary.

---

# 42. Payroll History

The application must provide payroll history.

Example:

```text
Payroll History

September 2026     FINALIZED
August 2026        FINALIZED
July 2026          FINALIZED
June 2026          FINALIZED
```

Clicking a month shows employee payroll records.

---

# 43. Payroll Monthly View

Recommended layout:

```text
September 2026

┌──────────────────┬─────────────┬────────────┬────────────┐
│ Employee         │ Base Salary │ Deduction  │ Net Salary │
├──────────────────┼─────────────┼────────────┼────────────┤
│ Somchai          │ ฿30,000     │ ฿1,500     │ ฿28,500    │
│ Narin            │ ฿28,000     │ ฿0         │ ฿28,000    │
│ Malee            │ Not Set     │ -          │ -          │
└──────────────────┴─────────────┴────────────┴────────────┘

Total Calculated Payroll: ฿56,500
```

Employees without salary should not be included in the payroll total.

---

# 44. Dashboard

The dashboard should remain simple.

Suggested cards:

```text
Employees
Active Employees
Current Month Payroll
Employees on Leave / Leave Records
```

Example:

```text
┌────────────────┐
│ Employees      │
│      24        │
└────────────────┘

┌────────────────┐
│ Active         │
│      22        │
└────────────────┘

┌────────────────────────┐
│ September Payroll      │
│ ฿542,000               │
│ Draft                  │
└────────────────────────┘
```

Do not create complicated analytics for MVP.

---

# 45. Suggested Routes

Recommended application routes:

```text
/auth/login
/auth/signup

/dashboard

/employees
/employees/new
/employees/[employeeId]

/payroll
/payroll/[month]

/admins
```

`/admins` must be System Admin only.

Exact routing may follow the conventions already used by the repository.

---

# 46. Suggested Navigation

```text
Dashboard

Employees

Payroll

Admin Management
    └── System Admin only

Language
    ├── English
    └── ไทย

Account
    └── Logout
```

---

# 47. Internationalization

The UI must support:

```text
English
Thai
```

All system UI labels must use translation keys.

Do not hardcode English UI strings inside components when avoidable.

Recommended structure:

```text
messages/
├── en.json
└── th.json
```

Example:

```json
{
  "employees": {
    "title": "Employees",
    "addEmployee": "Add Employee",
    "salary": "Salary"
  }
}
```

Thai equivalent:

```json
{
  "employees": {
    "title": "พนักงาน",
    "addEmployee": "เพิ่มพนักงาน",
    "salary": "เงินเดือน"
  }
}
```

An i18n library such as `next-intl` may be used.

If the repository already uses another localization library, reuse it instead.

---

# 48. Translation Scope

Translate:

* Navigation.
* Forms.
* Buttons.
* Validation errors.
* Confirmation dialogs.
* Authentication messages.
* Payroll labels.
* Employee labels.
* Admin management.
* Status labels.

Do NOT automatically translate user-entered data.

For example:

```text
Role: Coding Instructor
Reason: ไปงานรับปริญญา
```

should remain exactly as entered.

---

# 49. Currency Formatting

All monetary values are currently Thai Baht.

Use:

```text
THB
```

Display format examples:

```text
฿25,000
฿25,000.00
```

The application should consistently format monetary values.

Use locale-aware formatting where practical.

Example:

```javascript
new Intl.NumberFormat(locale, {
  style: "currency",
  currency: "THB"
})
```

The database stores numbers, not formatted currency strings.

Correct:

```text
25000.00
```

Incorrect:

```text
"฿25,000"
```

---

# 50. Date and Time

Default application timezone:

```text
Asia/Bangkok
```

Store timestamps safely in PostgreSQL.

Display dates according to selected locale.

English example:

```text
12 Sep 2026
```

Thai UI may use localized formatting.

Do not implement Buddhist Era business logic unless specifically required later.

---

# 51. Recommended Database Entities

Minimum conceptual schema:

```text
approved_admins
auth_users         ← managed by Better Auth
employees
leave_records
payroll_periods
payroll_records
organization_settings
```

---

# 52. Approved Admin Table

Conceptual fields:

```text
approved_admins

id
email
role
status
created_by
created_at
updated_at
```

Enums:

```text
role:
SYSTEM_ADMIN
HR_ADMIN

status:
ACTIVE
REVOKED
```

Use a unique constraint on normalized email.

---

# 53. Employee Table

Conceptual schema:

```text
employees

id
name
photo_url
role
monthly_salary
work_schedule
status

created_by
updated_by

created_at
updated_at
```

Recommended types:

```text
id               UUID
name             TEXT
photo_url        TEXT nullable
role             TEXT
monthly_salary   NUMERIC(12,2) nullable
work_schedule    JSONB
status           ENUM/TEXT
```

---

# 54. Leave Table

Conceptual schema:

```text
leave_records

id
employee_id

start_date
end_date
reason

has_salary_deduction
deduction_amount
deduction_payroll_month

created_by
created_at
updated_at
```

Recommended amount type:

```text
NUMERIC(12,2)
```

---

# 55. Payroll Period Table

Conceptual schema:

```text
payroll_periods

id
payroll_month
status

created_at
updated_at

finalized_at
finalized_by
```

Unique constraint:

```text
payroll_month
```

There should only be one payroll period per month.

---

# 56. Payroll Record Table

Conceptual schema:

```text
payroll_records

id
payroll_period_id
employee_id

base_salary_snapshot
leave_deduction_total
net_salary

created_at
updated_at
```

Recommended unique constraint:

```text
(payroll_period_id, employee_id)
```

---

# 57. Core Database Relationships

```text
APPROVED_ADMIN
     │
     └── maps to Better Auth identity by email


EMPLOYEE
     │
     ├── 1:N ───── LEAVE_RECORD
     │
     └── 1:N ───── PAYROLL_RECORD


PAYROLL_PERIOD
     │
     └── 1:N ───── PAYROLL_RECORD
```

---

# 58. Business Requirements

## BR-001 — Single Organization

The system shall represent one organization per deployment.

---

## BR-002 — Controlled Access

Only approved administrators shall have access to the application.

---

## BR-003 — System Administrator Bootstrap

The initial System Administrator shall be approved directly through the database.

---

## BR-004 — HR Administrator Management

Only System Administrators shall be allowed to approve or revoke HR Administrator access.

---

## BR-005 — Employee Records

Authorized administrators shall be able to create, read, update, and archive employee records.

---

## BR-006 — Employee Authentication

Employees shall not require user accounts in the MVP.

---

## BR-007 — Employee Photo

Administrators shall be able to upload or capture an employee profile picture.

---

## BR-008 — Salary

Employee monthly salary shall be stored in THB and may be left unset.

---

## BR-009 — Work Schedule

Every employee shall have a manageable weekly work schedule.

---

## BR-010 — Leave Recording

Administrators shall be able to record leave on behalf of employees.

---

## BR-011 — Leave Salary Deduction

Leave records shall optionally contain a salary deduction.

---

## BR-012 — Payroll Impact

Salary deductions recorded against a payroll month shall reduce the employee's calculated salary for that month.

---

## BR-013 — Monthly Payroll

The application shall calculate payroll on a monthly basis.

---

## BR-014 — Payroll History

The application shall retain historical payroll records.

---

## BR-015 — Historical Integrity

Changes to current employee salary shall not retroactively alter finalized payroll records.

---

## BR-016 — No Payment Processing

The system shall not initiate or process financial transactions.

---

## BR-017 — Localization

The user interface shall support both English and Thai.

---

# 59. Functional Requirements

## FR-001

The application must require authentication before accessing internal routes.

## FR-002

The application must verify that authenticated emails exist in the approved administrator list.

## FR-003

Unauthorized users must not gain access even if Better Auth successfully authenticates them.

## FR-004

System Administrators must be able to add approved HR Administrator emails.

## FR-005

System Administrators must be able to revoke HR Administrator access.

## FR-006

Admins must be able to add employees.

## FR-007

Admins must be able to edit employees.

## FR-008

Admins must be able to archive employees.

## FR-009

Admins must be able to capture an employee photo using a browser camera.

## FR-010

Admins must be able to upload an employee photo.

## FR-011

Employee role must accept free text.

## FR-012

Employee salary must be optional.

## FR-013

Admins must be able to configure weekly employee schedules.

## FR-014

Admins must be able to create leave records from an employee profile or employee list.

## FR-015

Leave must support a start date and end date.

## FR-016

Leave must support a free-text reason.

## FR-017

Leave must support an optional salary deduction.

## FR-018

Salary deduction must support a manually entered THB amount.

## FR-019

Payroll must be generated for a selected month.

## FR-020

Payroll must include all active employees.

## FR-021

Payroll calculations must use employee salary snapshots.

## FR-022

Payroll must subtract applicable leave deductions.

## FR-023

Employees with no salary must be clearly marked as unable to calculate.

## FR-024

Payroll must support `DRAFT` and `FINALIZED` status.

## FR-025

Finalized payroll values must remain historically stable.

## FR-026

Users must be able to switch between Thai and English UI.

---

# 60. Validation Rules

## Employee

```text
name:
required
trim whitespace
minimum 1 visible character

role:
required
free text

salary:
optional
must be >= 0
maximum precision 2 decimals

photo:
optional

work schedule:
required
```

---

## Leave

```text
employee:
required

start_date:
required

end_date:
required
must be >= start_date

reason:
required
trim whitespace

has_salary_deduction:
required boolean

deduction_amount:
required if salary deduction = true
must be > 0

deduction_amount:
must equal 0 if salary deduction = false
```

---

## Admin Approval

```text
email:
required
valid email format
normalized lowercase
unique among approved admins
```

---

# 61. Payroll Calculation Example

Employee:

```text
Name: Somchai
Salary: ฿30,000
```

Leave records assigned to September:

```text
Leave A
Deduction: ฿1,000

Leave B
Deduction: ฿500
```

Calculation:

```text
Base Salary               ฿30,000
Leave A                   -฿1,000
Leave B                     -฿500
---------------------------------
Total Deduction            ฿1,500

Net Salary                ฿28,500
```

Formula:

```text
leaveDeductionTotal =
SUM(applicable leave deduction amounts)

netSalary =
baseSalarySnapshot - leaveDeductionTotal
```

Net salary should never become less than zero without explicitly warning the administrator.

For MVP:

```text
netSalary = max(0, calculatedNetSalary)
```

and show a warning if deductions exceeded salary.

---

# 62. Security Requirements

All sensitive operations MUST perform server-side authorization.

Examples:

```text
create employee
update salary
add leave
edit deduction
generate payroll
finalize payroll
add administrator
revoke administrator
```

Never rely exclusively on client-side permission checks.

---

# 63. Sensitive Data Handling

Salary information should only be accessible to authenticated admins.

Do not expose salary through:

* Public routes.
* Unauthenticated APIs.
* Static page source.
* Client-side data fetching without authorization.

Use secure server-side access patterns.

---

# 64. Input Validation

Validate input on both:

```text
Client
AND
Server
```

Server-side validation is authoritative.

A schema validation library such as Zod is recommended.

---

# 65. Database Safety

Use:

* Foreign keys where appropriate.
* Transactions for payroll generation.
* Unique constraints where business rules require uniqueness.
* Decimal types for monetary values.

Never use JavaScript floating-point arithmetic as the sole authoritative source for money calculations.

Where possible, perform monetary calculations using decimal-safe values.

---

# 66. Auditability

For important records, store:

```text
created_at
updated_at
created_by
updated_by
```

At minimum this should apply to:

* Employees.
* Leave records.
* Admin approvals.

For payroll:

```text
finalized_at
finalized_by
```

should also be stored.

A full enterprise audit-log system is optional for the MVP.

---

# 67. UI Design Direction

The application should look like a simple modern internal admin tool.

Priority:

```text
Clarity
> Speed
> Simplicity
> Visual decoration
```

Avoid excessive animations.

Avoid dashboard clutter.

Desktop usage is the primary target, but pages should remain usable on tablets and phones.

---

# 68. Employee Creation UX

Recommended flow:

```text
Employees
    │
    ▼
Add Employee
    │
    ├── Name
    │
    ├── Photo
    │      ├── Camera
    │      └── Upload
    │
    ├── Role
    │
    ├── Salary
    │
    └── Work Schedule
    │
    ▼
Save
    │
    ▼
Employee Profile
```

---

# 69. Leave UX

Recommended quick action:

```text
Employees

Somchai Prasert

[ View ] [ Edit ] [ Add Leave ]
```

Click:

```text
Add Leave
```

opens the leave modal without navigating away from the employee list if practical.

---

# 70. Confirmation Dialogs

Require confirmation before destructive or important actions such as:

```text
Archive Employee

Delete Leave Record

Revoke HR Administrator

Finalize Payroll
```

Example:

```text
Finalize September 2026 payroll?

Finalized payroll records will preserve their current values.

[Cancel] [Finalize]
```

---

# 71. Empty States

The system should handle empty states clearly.

Examples:

```text
No employees have been added yet.

[Add Employee]
```

```text
No leave records found.
```

```text
Payroll for September 2026 has not been generated.

[Generate Payroll]
```

---

# 72. Error Handling

Do not expose raw database errors to users.

Show understandable messages.

Example:

```text
Unable to save employee.
Please try again.
```

Log technical details server-side.

---

# 73. Loading States

Any server mutation should provide feedback.

Examples:

```text
Saving...
Generating payroll...
Uploading photo...
Finalizing...
```

Prevent accidental duplicate submissions.

---

# 74. Accessibility

Forms should include:

* Proper labels.
* Keyboard navigation.
* Focus management.
* Accessible modal behavior.
* Sufficient contrast.

Camera functionality must have a normal file-upload fallback.

---

# 75. Suggested MVP Screens

The complete MVP should require approximately these major screens:

```text
1. Login / Signup

2. Dashboard

3. Employee List

4. Add/Edit Employee

5. Employee Details
   └── Leave History

6. Payroll

7. Payroll Month Details

8. Admin Management
   └── SYSTEM_ADMIN only
```

---

# 76. Primary User Flow

```text
System Admin seeded in database
            │
            ▼
System Admin signs up
            │
            ▼
Dashboard
            │
            ├────────────────────────┐
            ▼                        ▼
      Add HR Admin              Employees
            │                        │
            ▼                        ▼
   Approve email              Add Employee
            │                        │
            ▼                        ▼
     HR Admin signup          Employee Profile
                                     │
                                     ▼
                                Add Leave
                                     │
                                     ▼
                            Salary Deduction
                                     │
                                     ▼
                                  Payroll
                                     │
                                     ▼
                            Generate Monthly
                                 Payroll
                                     │
                                     ▼
                                  Review
                                     │
                                     ▼
                                 Finalize
                                     │
                                     ▼
                            Payroll History
```

---

# 77. Future Architecture Considerations

The MVP should not implement these features yet, but avoid architecture decisions that make them unnecessarily difficult later.

Potential future functionality:

```text
Employee user accounts
Employee login
Employee self-service

Employee submits leave request
        │
        ▼
HR approval
        │
        ▼
Leave record
        │
        ▼
Payroll deduction
```

Future modules could include:

* Employee-facing profile.
* Leave request submission.
* Leave approval workflow.
* Attendance.
* Overtime.
* Allowances.
* Bonuses.
* Additional deductions.
* Payslip generation.
* PDF export.
* Tax calculations.
* Social security.
* Payroll exports.
* Notifications.
* Email alerts.

These features are NOT part of the current MVP.

---

# 78. Future Employee Account Link

Employee records should use an independent employee ID.

Do NOT make the employee record depend on a Better Auth user ID.

Future architecture may introduce:

```text
employees.user_id
```

as an optional relationship.

For now:

```text
user_id = null / does not exist
```

This keeps employee profiles independent from authentication.

---

# 79. Acceptance Criteria

The MVP can be considered functionally complete when all of the following work.

### Authentication

* [ ] Better Auth is integrated.
* [ ] Unapproved emails cannot access the application.
* [ ] System Admin can be seeded through the database.
* [ ] System Admin can approve HR Admin emails.
* [ ] Approved HR Admin can create/authenticate an account.
* [ ] Revoked admins lose application access.

### Employees

* [ ] Admin can view employees.
* [ ] Admin can create employee.
* [ ] Admin can edit employee.
* [ ] Admin can archive employee.
* [ ] Name is supported.
* [ ] Free-text role is supported.
* [ ] Salary can be blank.
* [ ] Salary is stored as THB numeric value.
* [ ] Weekly work schedule can be configured.
* [ ] Employee photo can be uploaded.
* [ ] Employee photo can be captured from webcam.

### Leave

* [ ] Admin can add leave.
* [ ] Leave supports date range.
* [ ] Leave supports free-text reason.
* [ ] HR can choose whether leave deducts salary.
* [ ] HR can enter manual deduction amount.
* [ ] Deduction can be assigned to payroll month.
* [ ] Leave history appears on employee profile.
* [ ] Leave can be edited.
* [ ] Leave can be removed.

### Payroll

* [ ] Admin can select a payroll month.
* [ ] Admin can generate monthly payroll.
* [ ] Base salary is included.
* [ ] Leave deductions are included.
* [ ] Net salary is calculated.
* [ ] Employees without salary are handled.
* [ ] Payroll totals are calculated.
* [ ] Payroll starts in draft state.
* [ ] Payroll can be finalized.
* [ ] Finalized payroll preserves historical values.
* [ ] Previous payroll months can be viewed.

### Localization

* [ ] English UI exists.
* [ ] Thai UI exists.
* [ ] User can switch language.
* [ ] Currency remains THB regardless of language.

---

# 80. AI Coding Agent Instructions

The coding agent implementing this project should follow these rules.

## Rule 1 — Inspect Existing Repository First

Before adding architecture:

```text
Inspect:
package.json
existing app structure
existing auth
existing database code
existing UI libraries
existing environment variables
existing lint configuration
existing TypeScript configuration
```

Do not replace working infrastructure unnecessarily.

---

## Rule 2 — Use pnpm

All package operations must use:

```bash
pnpm
```

Do not use:

```text
npm
yarn
bun
```

unless the repository has explicitly migrated away from pnpm.

---

## Rule 3 — Do Not Reinitialize Next.js

The repository already contains Next.js.

Do not run:

```bash
create-next-app
```

inside the project.

---

## Rule 4 — TypeScript Only

New application code should use TypeScript.

Prefer:

```text
.ts
.tsx
```

Avoid introducing JavaScript files without reason.

---

## Rule 5 — Keep MVP Small

Do not independently add:

* Attendance systems.
* Tax systems.
* Employee login.
* Email automation.
* Accounting integrations.
* Complex HR workflows.
* Multi-tenancy.
* Payment processing.

Implement only what this document requires.

---

## Rule 6 — Server Authorization

Every mutation must verify:

```text
1. User authenticated?
2. User approved?
3. User role authorized?
```

on the server.

---

## Rule 7 — Database Migrations

All schema changes must be expressed as database migrations using the database tooling selected in the project.

Do not rely on manual production schema edits except for the initial System Admin allowlist record.

---

## Rule 8 — Money Safety

All salary and deduction data must use decimal-safe storage.

Do not use floating-point database columns.

---

## Rule 9 — Historical Payroll

Never calculate payroll history dynamically from only the employee's current salary.

Payroll records must contain snapshots.

---

## Rule 10 — Localization

All reusable interface strings must be compatible with English and Thai localization.

---

## Rule 11 — Responsive Admin UI

Optimize primarily for desktop HR usage while maintaining acceptable tablet/mobile behavior.

---

## Rule 12 — Maintainable Components

Separate:

```text
UI
business logic
database queries
authorization
validation
payroll calculation
```

Avoid putting all application logic inside React components.

---

# 81. Suggested Implementation Order

The coding agent should preferably implement the system in this order:

```text
Phase 1
Database schema
        │
        ▼
Better Auth
        │
        ▼
Approved admin authorization

Phase 2
Employee CRUD
        │
        ▼
Work schedule
        │
        ▼
Employee photo

Phase 3
Leave CRUD
        │
        ▼
Salary deductions

Phase 4
Payroll generation
        │
        ▼
Payroll finalization
        │
        ▼
Payroll history

Phase 5
English / Thai i18n
        │
        ▼
Dashboard polish
        │
        ▼
Validation / errors
        │
        ▼
Responsive UI
```

Authentication and authorization should be implemented before sensitive HR features are considered complete.

---

# 82. Definition of MVP

At its core, the finished application should accomplish this:

```text
Approved Admin
      │
      ▼
Login
      │
      ▼
Manage Employees
      │
      ├── Name
      ├── Photo
      ├── Role
      ├── Salary
      └── Schedule
      │
      ▼
Record Leave
      │
      ├── Date
      ├── Reason
      └── Salary Deduction
      │
      ▼
Generate Monthly Payroll
      │
      ▼
Base Salary
-
Leave Deductions
      │
      ▼
Net Salary
      │
      ▼
Finalize
      │
      ▼
Payroll History
```

That is the intended MVP boundary.

Anything substantially beyond this flow should be treated as a future feature rather than automatically added to the initial implementation.
