# HR Payroll Tracking System

# UI / UX Requirements

**Document version:** 1.0
**Project type:** Internal HR and Payroll Administration System
**Frontend:** Next.js + TypeScript
**Styling:** Tailwind CSS
**Primary theme:** White + Light Blue
**Primary usage:** Desktop internal admin application
**Secondary usage:** Tablet and mobile-compatible

---

# 1. UI Design Objective

The application should look like a practical, polished internal business tool.

The design should prioritize:

```text
Clarity
Simplicity
Readable information hierarchy
Fast navigation
Low cognitive load
Consistent spacing
Predictable interaction
```

The UI should NOT attempt to look like:

```text
A flashy SaaS landing page
A crypto dashboard
An AI-generated admin template
A design portfolio
A heavily animated application
```

The system is used by HR staff to perform operational tasks.

The interface should therefore feel:

```text
Quiet
Professional
Clear
Stable
Efficient
```

---

# 2. Anti "AI Slop" Design Rules

Avoid the common visual patterns that make generated applications look generic or cluttered.

Do NOT:

* Put every available function on the dashboard.
* Put every setting inside one giant page.
* Use excessive cards.
* Wrap every single piece of information in a card.
* Create deeply nested cards inside cards.
* Use gradients everywhere.
* Use giant rounded corners.
* Use glassmorphism.
* Use glowing UI.
* Use excessive drop shadows.
* Use decorative blobs or background patterns.
* Use excessive icons.
* Use emoji as application icons.
* Use large hero sections inside the admin application.
* Use marketing copy inside operational pages.
* Use oversized headings.
* Put three or four call-to-action buttons beside every record.
* Display every available employee field inside employee tables.
* Use modals for complex multi-step editing.
* Use confirmation modals for harmless actions.
* Use animation just because animation is available.
* Show large charts unless they communicate useful business information.
* Put fake analytics charts on the dashboard.

---

# 3. General Layout Philosophy

The system should use a traditional application layout.

Recommended structure:

```text
┌───────────────────────────────────────────────────────────────┐
│ Sidebar │                    Main Content                     │
│         │                                                     │
│ Logo    │ Page Header                                         │
│         │                                                     │
│ Menu    │ Main page content                                   │
│         │                                                     │
│         │                                                     │
│         │                                                     │
│ Account │                                                     │
└───────────────────────────────────────────────────────────────┘
```

Desktop:

```text
Fixed / sticky left sidebar
Main content occupies remaining width
```

Mobile:

```text
Top navigation
Collapsible navigation drawer
```

Do not create a huge top navbar plus sidebar simultaneously.

---

# 4. Main Application Width

The content area should not stretch endlessly across large displays.

Recommended maximum content width:

```text
max-w-[1440px]
```

For normal forms and profile content:

```text
max-w-4xl
max-w-5xl
```

For tables:

```text
max-w-full
```

Tables may use the available application width.

---

# 5. Font

Use:

```text
Geist
```

Primary font:

```text
Geist Sans
```

Use Geist because it works naturally with modern Next.js applications and has clear readability for administrative interfaces.

Fallback:

```css
font-family:
  "Geist",
  "Inter",
  ui-sans-serif,
  system-ui,
  sans-serif;
```

If Geist is already available through the current Next.js project, use that implementation.

Do not introduce multiple unrelated font families.

---

# 6. Typography Philosophy

Typography should establish hierarchy primarily through:

```text
Size
Weight
Spacing
Color
```

Do not rely on decorative font styles.

Avoid:

```text
ALL CAPS large headings
Extra-bold text everywhere
Oversized page titles
Tiny gray body text
```

---

# 7. Typography Scale

Recommended Tailwind hierarchy.

## Page Title

Example:

```text
Employees
Payroll
Dashboard
Admin Management
```

Tailwind:

```text
text-2xl
font-semibold
tracking-tight
text-slate-900
```

Recommended:

```html
<h1 class="text-2xl font-semibold tracking-tight text-slate-900">
```

Do NOT use `text-4xl`, `text-5xl`, etc. for normal admin page headings.

---

# 8. Section Title

Examples:

```text
Basic Information
Work Schedule
Leave History
Payroll Summary
```

Tailwind:

```text
text-lg
font-semibold
text-slate-900
```

---

# 9. Subsection / Table Title

Tailwind:

```text
text-base
font-medium
text-slate-900
```

---

# 10. Body Text

Tailwind:

```text
text-sm
text-slate-700
```

Normal body text should generally be:

```text
14px
```

For longer explanatory paragraphs:

```text
text-base
```

may be used.

---

# 11. Secondary Text

Use:

```text
text-sm
text-slate-500
```

Examples:

```text
Optional
Last updated 2 hours ago
No salary configured
```

Avoid excessively light colors that reduce readability.

---

# 12. Labels

Form labels should use:

```text
text-sm
font-medium
text-slate-700
```

Example:

```text
Employee Name
Monthly Salary
Role
```

Labels should appear above controls.

---

# 13. Color Palette

The application uses a mostly white interface with subtle light-blue accents.

Primary background:

```text
White
```

Main application background:

```text
#F8FAFC
slate-50
```

Content panels:

```text
#FFFFFF
white
```

Borders:

```text
#E2E8F0
slate-200
```

Main text:

```text
#0F172A
slate-900
```

Secondary text:

```text
#475569
slate-600
```

Muted text:

```text
#64748B
slate-500
```

---

# 14. Primary Blue

Use a restrained blue.

Recommended primary:

```text
#2563EB
blue-600
```

Hover:

```text
#1D4ED8
blue-700
```

Light blue background:

```text
#EFF6FF
blue-50
```

Selected navigation background:

```text
#DBEAFE
blue-100
```

Blue border highlight:

```text
#BFDBFE
blue-200
```

---

# 15. Color Usage Rule

Blue should indicate:

```text
Primary actions
Selected navigation
Links
Focus state
Important active states
```

Blue should NOT fill large sections of the interface.

The application should primarily remain:

```text
white
slate
light blue accents
```

---

# 16. Semantic Colors

Use colors only when they communicate meaning.

Success:

```text
green-600
green-50
```

Warning:

```text
amber-600
amber-50
```

Danger:

```text
red-600
red-50
```

Neutral:

```text
slate-600
slate-100
```

Examples:

```text
ACTIVE       → subtle green
DRAFT        → neutral / amber
FINALIZED    → blue or green
REVOKED      → red
ARCHIVED     → gray
```

Avoid brightly colored badges unless necessary.

---

# 17. Border Radius

Use moderate radius.

Recommended:

```text
rounded-lg
```

for:

```text
Panels
Inputs
Buttons
Dialogs
```

Use:

```text
rounded-md
```

for smaller controls.

Avoid:

```text
rounded-3xl
rounded-full
```

unless semantically appropriate.

`rounded-full` is acceptable for:

```text
Avatar
Status pill
Small icon control
```

---

# 18. Shadows

Most application surfaces should rely on borders, not shadows.

Preferred:

```text
border border-slate-200
```

Optional subtle shadow:

```text
shadow-sm
```

Use shadows mainly for:

```text
Dropdown menus
Modals
Popover menus
Floating elements
```

Do not use large card shadows throughout the app.

---

# 19. Spacing System

Use Tailwind spacing consistently.

Recommended content padding:

```text
p-6
```

Main desktop page:

```text
px-6 py-6
```

Large desktop:

```text
lg:px-8
```

Section spacing:

```text
space-y-6
```

Related form fields:

```text
space-y-4
```

Small related elements:

```text
gap-2
gap-3
```

Normal grid spacing:

```text
gap-4
gap-6
```

---

# 20. Sidebar

Desktop sidebar width:

```text
w-60
```

or approximately:

```text
240px
```

Sidebar should remain visually quiet.

Example:

```text
┌────────────────────┐
│ Company Name       │
│                    │
│ Dashboard          │
│ Employees          │
│ Payroll            │
│                    │
│ Administration     │
│ Admin Management   │
│                    │
│                    │
│ ─────────────────  │
│ EN / ไทย           │
│ Lin                │
│ Logout             │
└────────────────────┘
```

---

# 21. Sidebar Styling

Background:

```text
white
```

Right border:

```text
border-r
border-slate-200
```

Navigation item:

```text
h-10
px-3
rounded-md
text-sm
font-medium
```

Inactive:

```text
text-slate-600
hover:bg-slate-50
hover:text-slate-900
```

Active:

```text
bg-blue-50
text-blue-700
```

Do not make active sidebar items bright blue blocks.

---

# 22. Sidebar Grouping

Do not present twenty navigation items.

Initial MVP:

```text
Dashboard
Employees
Payroll

Administration
Admin Management
```

`Admin Management` only appears for System Administrators.

Language/account controls should remain near the bottom.

---

# 23. Icons

Icons may accompany major navigation items.

Use one consistent icon library.

Examples:

```text
Lucide Icons
```

Recommended icon size:

```text
h-4 w-4
```

or:

```text
h-5 w-5
```

Do not use an icon for every label.

Icons should reinforce meaning, not decorate the page.

---

# 24. Page Header

Every main page should have a clear header.

Recommended structure:

```text
Employees                         [ + Add Employee ]

Manage employee information,
salary and schedules.
```

Layout:

```text
Page title on left
Primary action on right
Optional supporting text below title
```

Tailwind concept:

```text
flex
items-start
justify-between
gap-4
```

---

# 25. Primary Action Rule

Each page should ideally have ONE obvious primary action.

Examples:

Employees:

```text
Add Employee
```

Payroll:

```text
Generate Payroll
```

Admin Management:

```text
Add HR Admin
```

Do not create multiple equally prominent blue buttons.

Secondary actions should use:

```text
outline
ghost
text links
```

---

# 26. Buttons

## Primary Button

Use:

```text
bg-blue-600
text-white
hover:bg-blue-700
```

Recommended:

```text
h-9
px-4
rounded-md
text-sm
font-medium
```

---

# 27. Secondary Button

Use:

```text
bg-white
border
border-slate-300
text-slate-700
hover:bg-slate-50
```

---

# 28. Ghost Button

Use for table row menus and low-priority actions.

```text
hover:bg-slate-100
```

---

# 29. Danger Button

Use only inside destructive confirmation dialogs.

```text
bg-red-600
text-white
```

Do not make "Delete" red everywhere throughout tables.

A row menu may show:

```text
Delete Leave
```

as red text instead.

---

# 30. Cards

Cards should be used sparingly.

Acceptable uses:

```text
Dashboard summary
Employee profile summary
Payroll summary
Distinct configuration areas
```

Do not convert every section into a card.

---

# 31. Dashboard Cards

Dashboard cards should be simple.

Example:

```text
┌────────────────────────┐
│ Employees              │
│                        │
│ 24                     │
│ 22 active              │
└────────────────────────┘
```

Recommended:

```text
border
border-slate-200
bg-white
rounded-lg
p-5
```

No gradient.

No large icon circle.

No decorative chart.

No glow.

---

# 32. Dashboard

The dashboard should answer only:

```text
How many employees exist?
What is the current payroll state?
Are there obvious things requiring attention?
```

Suggested layout:

```text
Dashboard

┌───────────────┐ ┌───────────────┐ ┌─────────────────────┐
│ Employees     │ │ Active        │ │ Current Payroll     │
│ 24            │ │ 22            │ │ ฿542,000            │
│               │ │               │ │ Draft               │
└───────────────┘ └───────────────┘ └─────────────────────┘


Recent / Relevant Information

Payroll status
Recent leave
Employees without salary
```

Do not put:

```text
Pie charts
Fake trend charts
Revenue graphs
Random percentages
```

unless actual future product requirements justify them.

---

# 33. Tables

Tables are an important part of this application.

Use tables when comparing multiple records of the same type.

Good uses:

```text
Employee list
Leave history
Payroll records
Admin list
```

Do not replace information-dense tables with giant cards.

---

# 34. Table Styling

Tables should remain compact and readable.

Recommended:

```text
text-sm
```

Header:

```text
bg-slate-50
text-slate-600
font-medium
```

Rows:

```text
bg-white
border-b
border-slate-200
```

Hover:

```text
hover:bg-slate-50
```

Do not alternate zebra colors unless the table becomes very large.

---

# 35. Table Container

Recommended:

```text
border
border-slate-200
rounded-lg
overflow-hidden
bg-white
```

Example:

```text
┌───────────────────────────────────────────────────────────────┐
│ Employee       Role             Salary        Status      ⋯  │
├───────────────────────────────────────────────────────────────┤
│ Somchai        Manager          ฿35,000       Active      ⋯  │
│ Narin          Accountant       ฿28,000       Active      ⋯  │
│ Malee          Assistant        Not Set       Active      ⋯  │
└───────────────────────────────────────────────────────────────┘
```

---

# 36. Table Columns

Only display fields useful for scanning.

Employee list:

```text
Employee
Role
Salary
Status
Actions
```

Do NOT include:

```text
Full work schedule
Full leave history
Created at
Updated at
Created by
Every internal field
```

Those belong in the employee details page.

---

# 37. Employee Column

Use:

```text
Avatar + Name
```

Example:

```text
[Photo] Somchai Prasert
```

Avatar:

```text
h-9 w-9 rounded-full
```

If no employee image exists, show:

```text
Initials
```

using a neutral light background.

---

# 38. Table Action Pattern

Do not place:

```text
View Edit Leave Archive Delete
```

as five buttons on every row.

Preferred:

```text
Employee Name                               ⋯
```

The `⋯` opens a dropdown.

Example:

```text
View Employee
Edit Employee
Add Leave
────────────
Archive Employee
```

If one action is very commonly used, it may be directly clickable through the employee name.

---

# 39. Table Search

Place search above tables.

Example:

```text
[ Search employees...                     ]

                                   [Add Employee]
```

Do not create an oversized filter panel for only one search field.

If filters are eventually needed, expose a compact:

```text
Filters
```

button.

---

# 40. Table Empty State

If there are no records:

```text
No employees yet

Add your first employee to begin tracking HR information.

[Add Employee]
```

Do not render an empty table with fifteen blank rows.

---

# 41. Forms

Forms should be organized around logical groups.

Do not put the entire employee model into one giant card with dozens of fields.

Employee form should be grouped like:

```text
Basic Information

Photo
Name
Role


Compensation

Monthly Salary


Work Schedule

Monday
Tuesday
...
```

---

# 42. Form Width

Normal form fields should not span the entire monitor width.

Recommended:

```text
max-w-3xl
```

or:

```text
max-w-4xl
```

Text fields often:

```text
max-w-xl
```

---

# 43. Form Layout

Use vertical layout by default.

Example:

```text
Employee Name
[_____________________________]

Role
[_____________________________]

Monthly Salary
[_____________________________]
```

Avoid dense enterprise-style horizontal label/input layouts.

---

# 44. Two-Column Forms

Two-column layouts may be used for naturally related values.

Example:

```text
Start Date                     End Date
[____________]                 [____________]
```

On smaller screens:

```text
stack vertically
```

Use:

```text
grid
grid-cols-1
md:grid-cols-2
gap-4
```

---

# 45. Inputs

Recommended input height:

```text
h-10
```

Style:

```text
rounded-md
border
border-slate-300
bg-white
px-3
text-sm
```

Focus:

```text
focus:border-blue-500
focus:ring-2
focus:ring-blue-100
```

Avoid thick focus glow.

---

# 46. Salary Input

Salary should be displayed with a visual THB prefix.

Example:

```text
Monthly Salary

┌────┬───────────────────┐
│ ฿  │ 25000             │
└────┴───────────────────┘
```

Do not store the currency symbol as part of the value.

---

# 47. Work Schedule UI

Do not build seven giant cards.

Use a compact structured table-like layout.

Example:

```text
Work Schedule

Day          Working       Start       End

Monday       [✓]           09:00       18:00
Tuesday      [✓]           09:00       18:00
Wednesday    [✓]           09:00       18:00
Thursday     [✓]           09:00       18:00
Friday       [✓]           09:00       18:00
Saturday     [ ]           —           —
Sunday       [ ]           —           —
```

This is more readable than seven independent sections.

---

# 48. Employee Photo UI

Employee photo should not dominate the form.

Recommended:

```text
Photo

    [ Current / Preview ]

[Take Photo] [Upload Photo]
```

Preview size approximately:

```text
96px - 128px
```

Use:

```text
rounded-lg
object-cover
```

---

# 49. Camera UI

Camera capture may use a dialog because it is a short isolated task.

Example:

```text
┌──────────────────────────────────────┐
│ Take Employee Photo                 │
│                                      │
│ ┌──────────────────────────────────┐ │
│ │                                  │ │
│ │          Camera Preview          │ │
│ │                                  │ │
│ └──────────────────────────────────┘ │
│                                      │
│                  Cancel   Capture    │
└──────────────────────────────────────┘
```

After capture:

```text
Retake
Use Photo
```

---

# 50. Modal Philosophy

Use modals only for short tasks that can be understood without leaving the current context.

Good modal uses:

```text
Add Leave
Take Photo
Add HR Admin email
Delete confirmation
Archive confirmation
Finalize payroll confirmation
```

Bad modal uses:

```text
Full employee editing
Full payroll review
Employee profile
Full work schedule management
Complex settings
```

Those should use dedicated pages.

---

# 51. Modal Size

Standard modal:

```text
max-w-lg
```

Larger modal:

```text
max-w-xl
```

Only camera capture may require:

```text
max-w-2xl
```

Do not make every dialog almost full-screen.

---

# 52. Leave Modal

Recommended structure:

```text
Add Leave

Somchai Prasert


Start Date            End Date
[___________]          [___________]


Reason
[________________________________]
[________________________________]


Salary deduction

( ) No deduction
( ) Deduct from salary


if selected:

Deduction amount
฿ [________________]


Deduction payroll month
[ September 2026 ]


                 Cancel   Save Leave
```

The modal should progressively reveal deduction fields only when required.

---

# 53. Employee Details Page

Employee details should not resemble a dashboard full of cards.

Recommended:

```text
← Employees

[Photo] Somchai Prasert
        Branch Manager

        Active

                         [Edit Employee] [⋯]


Basic Information

Role
Branch Manager

Monthly Salary
฿35,000


Work Schedule

Monday      09:00 - 18:00
Tuesday     09:00 - 18:00
...


Leave History                             [Add Leave]

┌──────────────────────────────────────────────────────┐
│ Date          Reason           Deduction          ⋯  │
│ 12 Sep        Personal         ฿1,500             ⋯  │
└──────────────────────────────────────────────────────┘
```

Use whitespace and section dividers rather than card-per-field layouts.

---

# 54. Page Section Separation

Preferred section separation:

```text
Heading

Content

────────────────────────────────

Next Heading
```

Use:

```text
border-t
border-slate-200
pt-6
```

when necessary.

Not everything needs its own bordered panel.

---

# 55. Payroll Page

The payroll root page should focus on payroll periods.

Example:

```text
Payroll                               [Generate Payroll]

Manage monthly payroll records.


September 2026
Draft

August 2026
Finalized

July 2026
Finalized
```

A compact table may also be used:

```text
Month              Status        Total Payroll
September 2026     Draft         ฿542,000
August 2026        Finalized     ฿536,000
```

---

# 56. Payroll Details Page

The payroll month detail should be information-dense but not cluttered.

Example:

```text
← Payroll

September 2026

Draft                                      [Finalize Payroll]


Payroll Summary

Total Payroll
฿542,000

Employees
22

Unable to Calculate
2


Employee Payroll

[ Search employee... ]

┌────────────────────────────────────────────────────────────┐
│ Employee       Base Salary      Deduction      Net Salary │
│ Somchai        ฿30,000          ฿1,500         ฿28,500    │
│ Narin          ฿28,000          —              ฿28,000    │
│ Malee          Not Set          —              —          │
└────────────────────────────────────────────────────────────┘
```

---

# 57. Summary Statistics

Do not create six cards for minor payroll numbers.

At most show the most important 2-4 statistics.

Preferred:

```text
Total Payroll
฿542,000

Employees
22

Unable to Calculate
2
```

These may use simple bordered summary blocks.

---

# 58. Status Badges

Badges should be subtle.

Example Tailwind concepts:

Active:

```text
bg-green-50
text-green-700
```

Draft:

```text
bg-amber-50
text-amber-700
```

Finalized:

```text
bg-blue-50
text-blue-700
```

Archived:

```text
bg-slate-100
text-slate-600
```

Use:

```text
rounded-full
px-2
py-0.5
text-xs
font-medium
```

---

# 59. Admin Management Page

System Administrator only.

Recommended:

```text
Admin Management                        [Add HR Admin]

Manage users authorized to access the HR system.


┌───────────────────────────────────────────────────────┐
│ Email                  Role          Status       ⋯   │
│ admin@company.com      System Admin  Active       ⋯   │
│ hr@company.com         HR Admin      Active       ⋯   │
└───────────────────────────────────────────────────────┘
```

Do not show authentication implementation details.

Do not expose:

```text
Better Auth user IDs
session IDs
database IDs
```

to normal admins.

---

# 60. Add HR Admin Modal

Keep it minimal.

```text
Add HR Administrator

Email address
[____________________________]

The user will be allowed to register using this email.

                     Cancel    Add Admin
```

No extra role selector is needed because this workflow specifically creates an HR Admin.

---

# 61. Login Page

Keep login extremely simple.

Recommended desktop:

```text
┌──────────────────────────────────────────────┐
│                                              │
│           Company / System Name              │
│                                              │
│              Welcome back                    │
│                                              │
│      Sign in to manage HR and payroll        │
│                                              │
│      [ Continue with Google ]                │
│                                              │
│      Access is limited to approved users.    │
│                                              │
└──────────────────────────────────────────────┘
```

Do not include:

```text
illustration
gradient background
testimonial
three-column marketing layout
feature carousel
```

---

# 62. Language Switcher

The language selector should remain simple.

Examples:

```text
EN | ไทย
```

or dropdown:

```text
English
ไทย
```

Do not use flags because:

```text
language != country
```

---

# 63. Responsive Design

Primary target:

```text
Desktop >= 1024px
```

Secondary:

```text
Tablet
Mobile
```

Desktop sidebar collapses into a drawer on mobile.

Tables should use one of:

```text
horizontal scrolling
responsive column hiding
compact stacked row rendering
```

Do not attempt to squeeze all desktop columns onto a 375px screen.

---

# 64. Mobile Table Priority

Example employee mobile row:

```text
[Photo] Somchai Prasert
        Branch Manager

฿35,000
Active

                           ⋯
```

Instead of forcing:

```text
5 tiny columns
```

onto mobile.

---

# 65. Toast Notifications

Use toasts for simple success feedback.

Examples:

```text
Employee created.
Employee updated.
Leave recorded.
Payroll finalized.
HR administrator added.
```

Keep them short.

Do not put long error explanations inside toast notifications.

---

# 66. Inline Errors

Validation errors should appear underneath the related input.

Example:

```text
Deduction Amount

฿ [___________]

Deduction amount is required.
```

Use:

```text
text-sm
text-red-600
```

---

# 67. Error Pages

Provide clean states for:

```text
403 Unauthorized
404 Not Found
500 Unexpected Error
```

Example:

```text
You do not have permission to view this page.

Return to Dashboard
```

Avoid technical stack traces in production UI.

---

# 68. Loading UI

For small mutations:

```text
button spinner + label
```

Example:

```text
Saving...
```

For page data:

Use restrained skeleton loading.

Do not skeleton every small label independently.

---

# 69. Destructive Actions

Destructive actions should not be visually prominent until needed.

Example dropdown:

```text
Edit
Add Leave
──────────
Archive Employee
```

Only after selecting Archive:

```text
Archive employee?

Somchai will no longer appear in the active employee list.
Historical payroll and leave records will remain available.

Cancel                     Archive
```

---

# 70. Confirmation Dialog Copy

Dialogs should explain consequences.

Bad:

```text
Are you sure?
```

Better:

```text
Finalize September payroll?

The current salary and deduction values will be stored as payroll history.
```

---

# 71. Breadcrumbs / Back Navigation

Do not add large breadcrumb chains everywhere.

For shallow navigation, simply use:

```text
← Employees
```

above an employee details page.

Use breadcrumbs only if navigation depth becomes larger in the future.

---

# 72. Tooltips

Use tooltips only for controls whose meaning cannot reasonably be expressed directly.

Example:

```text
icon-only actions
```

Do not hide essential instructions inside tooltips.

---

# 73. Icon-Only Buttons

Only use icon-only buttons for universally familiar controls.

Examples:

```text
⋯ More
X Close
Calendar icon
```

All icon buttons must include accessible labels.

---

# 74. Form Save Actions

Long forms should place primary action at the bottom.

Example:

```text
Cancel                        Save Employee
```

Do not create floating save bars unless forms become substantially longer in the future.

---

# 75. Employee Add/Edit Page Layout

Recommended:

```text
← Employees

Add Employee

Create an employee profile for HR and payroll tracking.


Basic Information

Photo
[photo]

[Take Photo] [Upload]

Name
[________________________]

Role
[________________________]


────────────────────────────────────


Compensation

Monthly Salary
฿ [_____________________]

Salary can be configured later.


────────────────────────────────────


Work Schedule

Monday         ✓     09:00    18:00
Tuesday        ✓     09:00    18:00
Wednesday      ✓     09:00    18:00
Thursday       ✓     09:00    18:00
Friday         ✓     09:00    18:00
Saturday       □
Sunday         □


                           Cancel   Save Employee
```

---

# 76. Visual Hierarchy Example

Correct:

```text
Employees                         ← largest visual importance

Manage employees...              ← secondary

Search                           ← tool

Employee table                   ← main information

Add Employee                     ← primary action
```

Incorrect:

```text
GIANT EMPLOYEES TITLE

four summary cards

three graphs

search filters

employee stats

announcements

recent activity

employee table

quick actions

floating add employee button
```

The actual purpose of the page must always dominate the screen.

---

# 77. Data Density

The system should use moderate information density.

HR users often need to scan many records.

Therefore:

```text
Do not make row heights unnecessarily large.
Do not use huge cards for each employee.
Do not use giant avatars.
Do not add decorative whitespace inside tables.
```

Recommended table row height:

```text
48px - 56px
```

---

# 78. Desktop Content Hierarchy

Typical page spacing:

```text
Page header

24-32px gap

Tools / filters

16px gap

Main content

24-32px gap

Secondary section
```

Avoid random spacing values.

---

# 79. Tailwind Design Tokens

Prefer defining reusable design tokens rather than repeating arbitrary colors.

Conceptually:

```css
--background: white;
--page-background: slate-50;
--foreground: slate-900;

--muted: slate-500;

--border: slate-200;

--primary: blue-600;
--primary-hover: blue-700;
--primary-soft: blue-50;

--danger: red-600;
--warning: amber-600;
--success: green-600;
```

Use the project's existing Tailwind configuration conventions.

---

# 80. Avoid Arbitrary Tailwind Values

Prefer:

```text
p-4
p-6
gap-4
gap-6
text-sm
text-lg
rounded-lg
```

rather than excessive:

```text
p-[19px]
gap-[13px]
text-[15.4px]
```

Arbitrary values are acceptable only where there is a concrete layout reason.

---

# 81. Component Consistency

Create reusable primitives for:

```text
Button
Input
Textarea
Dialog
Dropdown
Table
Badge
Avatar
PageHeader
EmptyState
FormField
```

Do not independently style each instance.

If a component library already exists in the repository, reuse it when appropriate.

---

# 82. Shadcn-Style Components

If Shadcn UI is available, it may be used for functional primitives such as:

```text
Dialog
Dropdown Menu
Button
Input
Select
Table
Avatar
Tooltip
Sheet
```

However:

Do not accept default component layouts blindly.

The product requirements in this document should determine spacing, hierarchy and page structure.

---

# 83. Select Controls

Use selects only for actual finite options.

Good:

```text
Payroll Month
Language
Status filter
```

Bad:

```text
Employee Role
Leave Reason
Employee Name
```

Employee role must remain free text.

---

# 84. Avoid Excessive Tabs

Do not turn every employee section into tabs.

For the current employee details page:

```text
Basic Information
Work Schedule
Leave History
```

can exist naturally on one page.

Tabs are justified only when sections grow significantly.

---

# 85. Avoid Excessive Accordions

Important information should be visible.

Do not put:

```text
Salary
Schedule
Leave
```

inside collapsed accordions simply to make the page look clean.

Whitespace and headings should handle hierarchy instead.

---

# 86. Avoid Drawer Overuse

Side drawers may be used for mobile navigation.

Do not use drawers as replacements for normal application pages.

Examples NOT to put in a drawer:

```text
Employee editor
Payroll detail
Admin management
```

---

# 87. Avoid Floating Action Buttons

Do not use a large floating `+` button in the bottom corner on desktop.

Use normal page header actions:

```text
[Add Employee]
```

---

# 88. Search Experience

Search fields should have an obvious search icon and placeholder.

Example:

```text
Search employees...
```

Search should not require pressing an additional `Search` button unless technically necessary.

---

# 89. Filters

Only introduce filters when useful.

Initial employee filters may eventually include:

```text
Active
Archived
```

Initial payroll filter:

```text
Year
```

Do not create a generic filter-builder system.

---

# 90. Date Controls

Use a clear calendar/date input.

Display:

```text
12 Sep 2026
```

or localized Thai equivalent.

Internally store proper date values.

Do not make users manually type complex date formats.

---

# 91. Payroll Month Picker

Payroll uses monthly periods.

Use month selection rather than a full date selector.

Example:

```text
September 2026
```

Do not require users to select:

```text
September 1, 2026
```

to represent September payroll.

---

# 92. Money Alignment

In payroll tables, monetary values should usually be right-aligned.

Example:

```text
Employee            Base Salary      Deduction     Net Salary

Somchai                ฿30,000          ฿1,500        ฿28,500
Narin                   ฿28,000              —        ฿28,000
```

Use tabular numbers if supported.

CSS concept:

```text
tabular-nums
```

This makes columns easier to scan.

---

# 93. Table Text Alignment

Recommended:

```text
Names / text          left
Dates                 left
Status                left
Money                 right
Counts                right
Actions               right
```

---

# 94. Long Text

Long leave reasons should not destroy table width.

In table:

```text
truncate
max-w-...
```

Full reason can appear:

```text
on employee details
or
inside row action/view
```

---

# 95. Employee Status

Employee status does not need a giant switch.

Display status as a badge.

Editing status should happen through:

```text
Archive Employee
Restore Employee
```

rather than a generic active/inactive switch that can be clicked accidentally.

---

# 96. Salary Privacy UX

Salary is sensitive but still part of normal HR workflow.

Do not hide every salary behind reveal buttons.

Authorized HR users should be able to see salary clearly within:

```text
Employee page
Employee table
Payroll
```

Security should be enforced through permissions, not visual obscurity.

---

# 97. Information Priority

For employees:

```text
Name
Role
Salary
Status
```

are primary.

Fields such as:

```text
Database ID
Created At
Updated At
Created By
```

should not occupy prominent UI.

---

# 98. English / Thai Layout

Allow layouts to accommodate longer translations.

Avoid fixed widths that assume English labels.

Example:

Bad:

```text
w-[90px]
```

for every label.

Preferred:

```text
flexible layouts
grid
min-width based controls
```

---

# 99. Thai Typography

Use the same primary font if Thai glyph support is sufficient.

If Thai rendering requires fallback, use a clean Thai-compatible sans-serif fallback such as:

```text
Noto Sans Thai
```

Recommended font stack concept:

```css
"Geist",
"Noto Sans Thai",
ui-sans-serif,
system-ui,
sans-serif
```

Do not use a decorative Thai font.

---

# 100. UI Copy Tone

Use concise operational language.

Good:

```text
Add Employee
Save Employee
Add Leave
Generate Payroll
Finalize Payroll
Archive Employee
```

Avoid:

```text
Let's get started!
Unlock your payroll potential!
Supercharge your workforce!
Manage your awesome team!
```

This is an internal business system, not a marketing website.

---

# 101. Dashboard Greeting

Avoid giant personalized greetings.

Do not use:

```text
Good morning, Lin! 👋
Here's what's happening with your organization today!
```

Preferred:

```text
Dashboard
```

Optional subtle secondary text:

```text
Overview of employees and current payroll.
```

---

# 102. Animation

Use minimal animation.

Allowed:

```text
dropdown transition
dialog transition
small hover changes
loading spinner
```

Avoid:

```text
page entrance animations
cards sliding into view
animated counters
animated charts
parallax
hover scaling
```

---

# 103. Hover Behavior

Buttons:

```text
subtle background change
```

Rows:

```text
slight background tint
```

Do not:

```text
scale elements
lift cards several pixels
increase shadows dramatically
```

---

# 104. Focus States

Keyboard focus should remain visible.

Recommended:

```text
ring-2
ring-blue-200
border-blue-500
```

Do not disable focus outlines without providing replacement styles.

---

# 105. Scroll Behavior

Avoid multiple nested scrolling areas.

The main page should normally scroll naturally.

Do not create:

```text
page scroll
inside card scroll
inside table scroll
inside modal scroll
```

unless technically required.

---

# 106. Sticky Elements

Useful sticky elements:

```text
Desktop sidebar
Table header for very long payroll tables
```

Avoid sticky page headers unless needed.

---

# 107. Pagination

If employee count remains small:

```text
simple table
```

is sufficient.

Once datasets become larger, introduce:

```text
Previous
Page 1 of 4
Next
```

Avoid complicated pagination controls.

---

# 108. Accessibility Requirements

All UI should support:

```text
keyboard navigation
visible focus states
proper labels
semantic buttons
semantic tables
accessible dialogs
alt text where applicable
sufficient contrast
```

Do not rely solely on color to communicate status.

Example:

```text
Draft
```

should be written in addition to amber coloring.

---

# 109. Screen-Specific Design Summary

## Dashboard

Purpose:

```text
Quick operational overview
```

Contains:

```text
3-4 summary values
Current payroll status
Useful alerts / recent relevant information
```

Does not contain:

```text
employee management forms
large charts
admin controls
```

---

## Employees Page

Purpose:

```text
Find and manage employees
```

Contains:

```text
Search
Employee table
Add Employee button
```

Does not contain:

```text
full employee forms
full work schedules
full leave history
```

---

## Employee Details

Purpose:

```text
Understand one employee
```

Contains:

```text
Profile
Salary
Schedule
Leave history
```

---

## Add/Edit Employee

Purpose:

```text
Manage employee data
```

Contains:

```text
Form only
```

No unnecessary dashboard information.

---

## Payroll Page

Purpose:

```text
Navigate monthly payroll
```

Contains:

```text
Payroll period list
Generate payroll
```

---

## Payroll Detail

Purpose:

```text
Review one month's payroll
```

Contains:

```text
Summary
Employee payroll table
Finalize action
```

---

## Admin Management

Purpose:

```text
Control authorized admins
```

Contains:

```text
Admin list
Add HR Admin
Revoke access
```

---

# 110. Example Application Shell

```text
┌───────────────────┬──────────────────────────────────────────────┐
│                   │                                              │
│ Company Name      │ Employees                    [Add Employee] │
│                   │                                              │
│ Dashboard         │ Manage employee information and payroll     │
│ Employees         │ settings.                                   │
│ Payroll           │                                              │
│                   │ [ Search employees...                    ]   │
│ Administration    │                                              │
│ Admin Management  │ ┌─────────────────────────────────────────┐ │
│                   │ │ Employee     Role       Salary      ⋯   │ │
│                   │ ├─────────────────────────────────────────┤ │
│                   │ │ Somchai      Manager    ฿35,000     ⋯   │ │
│                   │ │ Narin        Account.   ฿28,000     ⋯   │ │
│                   │ └─────────────────────────────────────────┘ │
│                   │                                              │
│ ────────────────  │                                              │
│ English / ไทย     │                                              │
│ Account           │                                              │
└───────────────────┴──────────────────────────────────────────────┘
```

---

# 111. Core Visual Rule

When deciding between two designs, prefer the one that contains:

```text
fewer containers
fewer colors
fewer buttons
fewer icons
more whitespace
clearer typography
stronger information hierarchy
```

The application should feel designed rather than decorated.

---

# 112. AI Coding Agent UI Instructions

When implementing the UI, the coding agent MUST follow these principles.

## Rule 1

Do not generate additional dashboard widgets unless required by business requirements.

## Rule 2

Do not wrap every section in a card.

## Rule 3

Do not use gradients.

## Rule 4

Do not use glassmorphism.

## Rule 5

Do not use oversized headings.

## Rule 6

Do not use excessive rounded corners.

## Rule 7

Do not put all actions directly inside table rows.

Use a row action menu.

## Rule 8

Use dedicated pages for complex editing.

Use modals only for short contextual tasks.

## Rule 9

Use tables where information comparison is important.

## Rule 10

Keep one clear primary action per page.

## Rule 11

Use Geist as the main UI font.

## Rule 12

Use white + slate + restrained blue accents.

## Rule 13

Use Tailwind design tokens consistently.

## Rule 14

Prioritize desktop HR workflows.

## Rule 15

Do not invent features while designing screens.

Follow `REQUIREMENTS.md`.

---

# 113. Recommended Base Tailwind Patterns

Application:

```text
min-h-screen
bg-slate-50
text-slate-900
```

Content surface:

```text
bg-white
border
border-slate-200
rounded-lg
```

Page:

```text
px-6
py-6
lg:px-8
```

Page title:

```text
text-2xl
font-semibold
tracking-tight
text-slate-900
```

Description:

```text
mt-1
text-sm
text-slate-500
```

Section title:

```text
text-lg
font-semibold
text-slate-900
```

Primary button:

```text
h-9
px-4
rounded-md
bg-blue-600
text-sm
font-medium
text-white
hover:bg-blue-700
```

Secondary button:

```text
h-9
px-4
rounded-md
border
border-slate-300
bg-white
text-sm
font-medium
text-slate-700
hover:bg-slate-50
```

Input:

```text
h-10
w-full
rounded-md
border
border-slate-300
bg-white
px-3
text-sm
text-slate-900
placeholder:text-slate-400
focus:border-blue-500
focus:outline-none
focus:ring-2
focus:ring-blue-100
```

Table header:

```text
bg-slate-50
text-xs
font-medium
text-slate-600
```

Table body:

```text
text-sm
text-slate-700
```

---

# 114. Final UI Standard

The final product should visually communicate:

```text
"This is a reliable HR tool."
```

rather than:

```text
"This is a generated SaaS template."
```

The strongest visual characteristics should be:

```text
White space
Clear typography
Compact tables
Simple forms
Subtle borders
Small blue accents
Consistent spacing
Predictable navigation
```

The interface should remain intentionally restrained.
