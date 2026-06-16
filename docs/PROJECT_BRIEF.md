# Delivery Export Web App — Project Brief

## Corrected / Clarified Prompt

Build a new project named `delivery-export`.

The application is a one-page Next.js web app for a delivery services company. The company's third-party delivery partners currently complete an Excel file manually, and the customer imports that file into an ERP system. The partners find Excel difficult and error-prone, so this app should replace direct Excel editing with a simple form and CSV export.

The app must be simple enough for non-technical users and must export a CSV compatible with the ERP import process.

## Core Goal

Allow users to create one or more delivery entries through a clean form and export them as a CSV file.

Each delivery entry becomes one CSV row.

## Source of Truth

The file `data/IMPORT.xlsx` is the source of truth.

Use sheet `Φύλλο1`:

- Row 1: CSV headers
- Row 2: input/component types

Never rename, translate, or alter the CSV headers.

## Form Fields

Use these fields from the Excel sheet:

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

## Input Mapping

Normalize row 2 values before mapping:

- `date` → date input
- `text` → text input
- `number` → number input
- `combo box` → dropdown
- `big text` → textarea

## Dropdown Sheets

- `Αποστολή` uses `ΑΠΟΣΤΟΛΗ`
- `Συνθήκη` uses `ΣΥΝΘΗΚΗ ΜΕΤΑΦΟΡΑΣ`
- `Παλ/Κιβ` uses `ΠΑΛΕΤΑ Ή ΚΙΒΩΤΙΟ`
- `Πληρωτής` uses `ΠΛΗΡΩΤΗΣ`

If export value expectations are unclear — especially for `Πληρωτής` where known values are `1 = Αποστολέας` and `2 = Εντολέας` — stop before Task 8 and ask whether the CSV should export code, label, or both.

## Incremental Development Rule

The project must be implemented task by task. After each task, stop and wait for approval before continuing.

## Implementation Tasks

1. Initialize Next.js project and basic structure.
2. Create reusable form components.
3. Create form schema from Excel definitions.
4. Load and map dropdown values from Excel sheets.
5. Support multiple delivery entries.
6. Build the complete one-page UI.
7. Implement validation.
8. Implement CSV export.
9. Polish UI, responsiveness, and UX.
