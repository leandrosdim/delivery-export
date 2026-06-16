# AGENTS.md — delivery-export

## Project Overview

`delivery-export` is a one-page web app for a delivery services company.

The customer collaborates with multiple third-party delivery partners. These partners currently fill an Excel file manually, which is then imported into the customer's ERP system. The goal is to replace the error-prone Excel workflow with a simple, modern form that exports ERP-compatible CSV files.

The app must prioritize:

- simplicity
- speed
- non-technical user experience
- mobile-friendly usage
- reliable CSV export for ERP import

## Mandatory Development Process

Work incrementally. Complete one task at a time.

After each task:

1. Explain exactly what was implemented.
2. Explain assumptions and decisions made.
3. Stop and wait for Leandros approval.
4. Do not continue to the next task unless Leandros explicitly confirms.

## Current Implementation Plan

- Task 1: Initialize Next.js project and create the basic application structure.
- Task 2: Create reusable form components.
- Task 3: Create the form schema from the Excel definitions.
- Task 4: Load and map dropdown values from the Excel sheets.
- Task 5: Implement support for multiple delivery entries.
- Task 6: Build the complete one-page UI.
- Task 7: Implement validation.
- Task 8: Implement CSV export.
- Task 9: Polish UI, responsiveness, and user experience.

## Technical Requirements

- Framework: latest stable Next.js
- Language: JavaScript
- App Router: yes
- Deployment target: Vercel
- Package manager: npm, selected by create-next-app
- Export format: CSV only
- Do not implement XLSX export

## UX Requirements

The app must be a single page.

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
- no multi-page flow
- helpful placeholders
- clear validation messages
- required field indicators
- minimal clicks

Primary action:

- Export CSV

Secondary actions:

- Add delivery
- Remove delivery
- Clear form

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

Create form fields from these columns:

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

## Required Reusable Components

Create these components:

- `TextBox`
- `NumberInput`
- `ComboBox`
- `DateInput`
- `BigTextBox`

All components must support:

- labels
- placeholders
- validation messages
- required indicators
- consistent design system

## Dropdown Data

Dropdown options must be loaded from additional sheets in `data/IMPORT.xlsx`.

Mappings:

- `Αποστολή` → sheet `ΑΠΟΣΤΟΛΗ`
- `Συνθήκη` → sheet `ΣΥΝΘΗΚΗ ΜΕΤΑΦΟΡΑΣ`
- `Παλ/Κιβ` → sheet `ΠΑΛΕΤΑ Ή ΚΙΒΩΤΙΟ`
- `Πληρωτής` → sheet `ΠΛΗΡΩΤΗΣ`

Known payer values:

- `1 = Αποστολέας`
- `2 = Εντολέας`

Important: before implementing CSV export, if it is unclear whether ERP expects dropdown labels, codes, or both, stop and ask Leandros for clarification.

## Multiple Delivery Entries

The app must support multiple delivery records.

Users must be able to:

- add a new delivery
- edit an existing delivery
- remove a delivery

Display deliveries as simple cards or collapsible sections.

CSV export must contain:

- one header row
- one data row per delivery

## CSV Export Requirements

- CSV only
- UTF-8 encoding
- preserve Greek characters
- preserve original Greek headers exactly
- escape commas correctly
- escape quotation marks correctly
- support multiline comments
- generate a file ready for ERP import

## Suggested Structure

```txt
app/
components/
components/form/
data/
docs/
hooks/
lib/
utils/
```
