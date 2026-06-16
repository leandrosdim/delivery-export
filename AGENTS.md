# AGENTS.md — delivery-export

## Project Overview

`delivery-export` is a one-page Next.js web app for a delivery services company.

The customer collaborates with multiple third-party delivery partners. These partners previously completed an Excel file manually, which the customer imported into an ERP system. The goal of this app is to replace direct Excel editing with a simple, modern form that exports ERP-compatible CSV files.

The app must prioritize:

- simplicity
- speed
- non-technical user experience
- mobile-friendly usage
- reliable CSV export for ERP import
- minimal clicks
- clear Greek-language validation

## Mandatory Development Process

Work incrementally. Complete one task/change at a time.

After each task/change:

1. Explain exactly what was implemented.
2. Explain assumptions and decisions made.
3. Run the required verification commands.
4. Update `HISTORY.md` for meaningful project changes.
5. Stop and wait for Leandros approval before continuing to unrelated work.

Do not continue into the next feature unless Leandros explicitly confirms.

## Required Files To Read First

Before making any meaningful change, always read:

1. `AGENTS.md`
2. `HISTORY.md`
3. `docs/PROJECT_BRIEF.md`
4. The specific files related to the requested change

`AGENTS.md` defines rules and constraints.
`HISTORY.md` records current project state and decisions.
`docs/PROJECT_BRIEF.md` preserves the original product requirements.

## Required File To Update After Changes

After every meaningful change, update `HISTORY.md`.

Each `HISTORY.md` entry should include:

- date
- what changed
- why it changed
- files affected
- verification run
- current status
- next suggested step, if any

Update `HISTORY.md` for:

- UI/UX changes
- validation changes
- CSV export changes
- Excel/schema/dropdown changes
- architecture changes
- dependency/script changes
- deployment-related changes
- bug fixes

Do not update `HISTORY.md` for trivial typo-only edits unless they affect user-facing behavior or documentation accuracy.

## Current Implementation Status

The app has already implemented:

- latest stable Next.js App Router project setup
- JavaScript, not TypeScript
- npm package manager
- one-page app UI
- reusable form components
- Excel-derived delivery schema
- dropdown option extraction from Excel sheets
- multiple delivery entries
- accordion delivery card UX
- Greek-language validation
- CSV export
- CSV escaping tests
- minimal logo/credit placement
- favicon metadata

The project is no longer in initial scaffolding mode. Future changes should preserve the current working architecture unless Leandros explicitly asks for a refactor.

## Current Architecture

Important files and responsibilities:

```txt
src/app/page.js
```

Main one-page client app. Manages:

- delivery entries UI
- accordion open state
- touched/submit validation state
- export button behavior
- validation alerts
- CSV download trigger

```txt
hooks/useDeliveryEntries.js
```

State hook for delivery entries. Manages:

- initial entry
- add entry
- remove entry
- update entry field
- reset one entry
- clear all entries
- stable `_id` generation

Important behavior:

- new delivery entries are inserted at the top
- entries have stable IDs and should not use array index as React key

```txt
components/DeliveryEntryForm.jsx
```

Renders one delivery entry as an accordion card.

Responsible for:

- accordion header
- status badge
- short collapsed summary
- grouped field rendering
- reset/remove buttons
- passing errors/touched state to form components

```txt
components/form/
```

Reusable form input components:

- `TextBox.jsx`
- `NumberInput.jsx`
- `ComboBox.jsx`
- `DateInput.jsx`
- `BigTextBox.jsx`
- `FormField.jsx`
- `index.js`

All form components must preserve:

- label support
- placeholder support
- required indicator
- error message display
- `onBlur`
- disabled state
- accessibility attributes where applicable

```txt
components/layout/
```

Layout/support components:

- `PageHeader.jsx`
- `SummaryPanel.jsx`
- `ActionBar.jsx`

```txt
src/lib/deliverySchema.js
```

Schema source for delivery form fields.

Responsible for:

- `DELIVERY_FIELDS`
- `CSV_HEADERS`
- field type/component mapping
- field groups
- helper functions such as empty delivery creation and fields-with-options derivation

```txt
src/data/dropdownOptions.js
```

Static dropdown options extracted from `data/IMPORT.xlsx`.

Generated/maintained from Excel source sheets.

```txt
src/lib/validation.js
```

Validation utilities.

Rules include:

- required fields
- valid date
- valid number
- non-negative amount
- quantity greater than zero
- Greek AFM shape validation: exactly 9 digits after stripping non-digits
- required dropdown selection

```txt
src/lib/csvExport.js
```

CSV export utilities.

Responsible for:

- CSV escaping
- UTF-8 BOM handling
- header order
- row order
- filename generation
- browser download

```txt
scripts/inspect-excel.js
```

Inspects workbook sheets and key rows.

```txt
scripts/extract-dropdown-options.js
```

Extracts dropdown options from Excel sheets and updates static dropdown data.

```txt
scripts/test-csv-export.js
```

Node-based CSV export checks.

## Technical Requirements

- Framework: Next.js App Router
- Language: JavaScript
- Package manager: npm
- Deployment target: Vercel
- Export format: CSV only
- Do not implement XLSX export unless Leandros explicitly requests it
- Do not add backend/database/auth unless Leandros explicitly requests it

## UX Requirements

The app must remain a single-page app.

Design must be:

- modern
- clean
- minimal
- responsive
- mobile-friendly
- optimized for non-technical users

UX principles:

- large inputs
- clear hierarchy
- enough spacing
- helpful placeholders
- clear validation messages
- required field indicators
- minimal clicks
- no unnecessary navigation

Primary action:

- Export CSV

Secondary actions:

- Add delivery
- Remove delivery
- Reset delivery
- Clear form

## Current Delivery Entry UX

Delivery entries use accordion cards.

Required behavior:

- first delivery is open on initial load
- new delivery is added at the top of the list
- new delivery opens automatically
- previously open deliveries collapse
- only one delivery should generally be open at a time
- collapsed delivery cards show a short summary
- status badge should show one of:
  - `Σε επεξεργασία`
  - `Έτοιμη`
  - `Χρειάζεται διόρθωση`
- validation failure should open the first delivery with errors
- remove/reset/clear behavior must preserve accordion state sensibly

Do not replace accordion UX with tabs or full always-expanded cards unless Leandros explicitly asks.

## Excel Source of Truth

The uploaded Excel file is stored at:

```txt
data/IMPORT.xlsx
```

Use sheet:

```txt
Φύλλο1
```

Rules:

- Row 1 contains the CSV column names.
- Row 2 contains required component/input types.
- Do not rename, translate, or modify column names.
- Exported CSV headers must exactly match row 1.
- Normalize extra spaces in row 2 type values.

## Form Fields

Create and preserve form fields from these columns:

- Ημερομηνία
- Παραστατικό
- Α.Φ.Μ. Πελάτη
- Α.Φ.Μ. Αποστολέα
- Α.Φ.Μ. Εντολέα
- Αποστολή
- Προορισμός
- Α.Φ.Μ. Παραλήπτη
- Περιοχή
- Οδός
- Συνθήκη
- Παλ/Κιβ
- Ποσότητα
- Πληρωτής
- Σχόλια
- Ποσό αντικαταβολής

## Input Type Mapping

Use row 2 of `Φύλλο1` as source of truth:

- `date` → `DateInput`
- `text` → `TextBox`
- `number` → `NumberInput`
- `combo box` → `ComboBox`
- `big text` → `BigTextBox`

Normalize values like `text ` and `combo box ` before mapping.

## Dropdown Data

Dropdown options are loaded from additional sheets in `data/IMPORT.xlsx`.

Mappings:

- `Αποστολή` → sheet `ΑΠΟΣΤΟΛΗ`
- `Συνθήκη` → sheet `ΣΥΝΘΗΚΗ ΜΕΤΑΦΟΡΑΣ`
- `Παλ/Κιβ` → sheet `ΠΑΛΕΤΑ Ή ΚΙΒΩΤΙΟ`
- `Πληρωτής` → sheet `ΠΛΗΡΩΤΗΣ`

Known payer values:

- `1 = Αποστολέας`
- `2 = Εντολέας`

Important:

- Dropdown options should preserve both `value` and `label` where available.
- Do not change dropdown export behavior without ERP confirmation.
- If there is uncertainty about whether ERP expects code, label, or both, stop and ask Leandros before changing export behavior.

## CSV Export Requirements

CSV export is business-critical. Preserve these invariants:

- CSV only
- UTF-8 encoding
- include UTF-8 BOM unless there is a confirmed reason not to
- preserve Greek characters
- preserve original Greek headers exactly
- preserve header order from `CSV_HEADERS`
- preserve row order from `DELIVERY_FIELDS`
- one header row
- one data row per delivery
- escape commas correctly
- escape quotation marks correctly
- support multiline comments
- empty `null`/`undefined` values export as empty cells
- generate a file ready for ERP import

Do not alter CSV headers, column order, dropdown values, or escaping logic without running tests and documenting the reason in `HISTORY.md`.

## Validation Rules

Preserve current Greek-language validation behavior:

- required fields must not be empty
- date fields must contain a valid date
- number fields must contain valid non-negative numbers when provided
- `Ποσότητα` must be greater than `0`
- `Ποσό αντικαταβολής` may be empty or `>= 0`
- AFM fields must have exactly 9 digits after normalization
- required dropdown fields must have a selected value

Validation UX:

- do not show all errors immediately on first load
- show errors after field touch/blur or export attempt
- export attempt validates all entries first
- invalid export does not download CSV
- first invalid delivery should open automatically

## Logo / Branding

Public logo assets currently include:

```txt
public/Logo.jpg
public/logo-dark.jpg
public/ld-favicon.png
```

Current intended usage:

- subtle footer/credit logo
- favicon metadata may use `ld-favicon.png`
- logo should not dominate the app UI
- do not redesign the app around the logo unless Leandros asks

## Verification Commands

After any meaningful code change, run:

```bash
npm run lint
npm run build
npm run test:csv
```

When changing Excel/schema/dropdown logic, also run:

```bash
npm run inspect:excel
npm run extract:dropdowns
```

Before reporting success, include the exact verification commands run and their result.

## Critical Invariants / Do Not Break

- Do not rename Greek CSV headers.
- Do not reorder CSV columns.
- Do not change `DELIVERY_FIELDS` order without confirming ERP impact.
- Do not change dropdown export values without confirmation.
- Do not implement XLSX export unless explicitly requested.
- Do not replace schema-driven rendering with manually duplicated fields.
- Do not remove reusable form components.
- Do not remove CSV tests.
- Do not remove accordion behavior unless requested.
- Do not introduce a backend/database/auth unless requested.
- Do not add heavy UI libraries for small UI changes.

## Suggested Structure

Current structure is expected to remain close to:

```txt
AGENTS.md
HISTORY.md
docs/PROJECT_BRIEF.md
data/IMPORT.xlsx
scripts/
src/app/
src/data/
src/lib/
components/
components/form/
components/layout/
hooks/
public/
```

## Future Work Checklist

For future features, use this checklist:

1. Read `AGENTS.md`, `HISTORY.md`, and `docs/PROJECT_BRIEF.md`.
2. Identify affected files.
3. Preserve CSV/ERP invariants.
4. Make the smallest safe change.
5. Keep UX simple for non-technical users.
6. Run required verification commands.
7. Update `HISTORY.md`.
8. Report files changed, behavior changed, verification results, and any open questions.
