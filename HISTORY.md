# HISTORY.md — delivery-export

This file records meaningful project changes, decisions, verification results, and next steps.

Future agents must read this file before making changes and update it after every meaningful change.

---

## 2026-06-16 — Project documentation updated for future agents

### What changed

Updated `AGENTS.md` and created this `HISTORY.md` file.

### Why it changed

The app has moved beyond initial implementation. It now has schema-driven forms, dropdown extraction, validation, CSV export, logo placement, and accordion delivery cards. Future agents need a clear operating manual and chronological project memory.

### Files affected

- `AGENTS.md`
- `HISTORY.md`

### Current status

Project documentation now defines:

- current architecture
- critical CSV/ERP invariants
- current accordion UX behavior
- validation rules
- dropdown rules
- required verification commands
- history update requirements

### Verification

Documentation-only change. No app code changed.

### Next suggested step

For the next code change, read `AGENTS.md`, this file, and `docs/PROJECT_BRIEF.md` first.

---

## 2026-06-16 — Accordion delivery card UX implemented

### What changed

Delivery entries were refactored from always-expanded full form cards into accordion cards.

### Why it changed

When users added multiple deliveries, the page became too long and difficult to manage. Accordion cards keep the one-page app simple while making many deliveries easier to handle.

### Behavior

- First delivery opens on initial load.
- New deliveries are added at the top.
- New delivery opens automatically.
- Previously open deliveries collapse.
- Collapsed delivery cards show summary/status information.
- Validation failure opens the first delivery with errors.
- Remove/reset/clear behavior continues to work.

### Files affected

Likely affected files:

- `src/app/page.js`
- `components/DeliveryEntryForm.jsx`
- `src/app/globals.css`
- `hooks/useDeliveryEntries.js`

### Current status

Working according to user feedback.

### Verification

Reported as working by Leandros. Future agents should still run:

```bash
npm run lint
npm run build
npm run test:csv
```

before making further code changes.

### Next suggested step

If improving this area later, keep accordion UX and focus only on small usability improvements.

---

## 2026-06-16 — New delivery insertion behavior corrected

### What changed

Confirmed and reinforced that new delivery entries are inserted at the top of the list. Added smooth scroll to the top of the delivery list after adding a new delivery.

Also fixed an existing lint issue in the delivery entry hook by replacing ref-based render-time ID access with a safer stable ID helper using `crypto.randomUUID()` plus fallback.

### Why it changed

Leandros requested that every newly added delivery row appear at the top instead of the bottom. The hook already prepended entries, but UX was improved so the new top entry is immediately visible.

### Files affected

- `src/app/page.js`
- `hooks/useDeliveryEntries.js`

### Verification

Ran:

```bash
npm run lint
npm run build
npm run test:csv
```

Results:

- lint passed
- build passed
- CSV tests passed: 20 passed, 0 failed

### Current status

New deliveries are inserted at the top and the page scrolls to the delivery list top after adding.

---

## 2026-06-16 — Minimal logo/credit placement added

### What changed

The project public folder contains logo assets:

- `public/Logo.jpg`
- `public/logo-dark.jpg`
- `public/ld-favicon.png`

A minimal logo/credit placement was requested and implemented in the app footer area.

### Why it changed

Leandros wanted the logo visible somewhere in the app, but minimally and not as a dominant branding element.

### Intended behavior

- Keep the logo subtle.
- Prefer `Logo.jpg` on light UI areas.
- Use `logo-dark.jpg` only on dark UI areas.
- Favicon may use `ld-favicon.png`.
- Do not redesign the app around the logo unless requested.

### Files likely affected

- `src/app/page.js`
- `src/app/globals.css`
- `src/app/layout.js`

### Current status

Logo should remain minimal and not distract from the form/export workflow.

---

## 2026-06-16 — Task 9 completed: final UI polish

### What changed

Final UI polish, responsiveness, and user experience pass was completed.

### Why it changed

The app needed to move from task-preview/demo feel to a production-ready one-page utility for non-technical delivery partners.

### Expected outcomes

- No demo/task-preview wording remains in the app UI.
- Layout is clean and responsive.
- Export action is visually clear.
- Validation and success messages are readable.
- App metadata is updated.
- Core delivery/export behavior remains intact.

### Files likely affected

- `src/app/page.js`
- `src/app/globals.css`
- `src/app/layout.js`
- `components/DeliveryEntryForm.jsx`
- form/layout components as needed

### Current status

Task 9 was completed and accepted by Leandros.

---

## 2026-06-16 — Task 8 completed: CSV export

### What changed

CSV export was implemented.

### Why it changed

The app must generate ERP-compatible CSV files from one or more delivery entries.

### Important behavior

- Export validates all deliveries first.
- Invalid data prevents download and shows validation errors.
- Valid data generates and downloads a CSV file.
- CSV includes one header row and one row per delivery.
- Headers come from `CSV_HEADERS`.
- Row values follow `DELIVERY_FIELDS` order.
- Greek characters are preserved.
- UTF-8 BOM is used for Excel compatibility.
- Commas, quotes, and multiline comments are escaped correctly.

### Files affected

- `src/lib/csvExport.js`
- `src/app/page.js`
- `scripts/test-csv-export.js`
- `package.json`

### Critical invariant

Do not change CSV headers, column order, escaping, or dropdown export behavior without confirming ERP impact and updating tests.

### Current status

CSV export is implemented and covered by Node-based CSV tests.

---

## 2026-06-16 — Task 7 completed: validation

### What changed

Greek-language validation was implemented for delivery entries.

### Why it changed

The app must prevent incomplete or invalid data from being exported to the ERP import CSV.

### Validation rules

- Required fields must not be empty.
- Date must be valid.
- Number fields must contain valid numbers when provided.
- `Ποσότητα` must be greater than `0`.
- `Ποσό αντικαταβολής` may be empty or non-negative.
- AFM fields must contain exactly 9 digits after stripping non-digits.
- Required dropdowns must have a selected value.

### UX behavior

- Errors do not show immediately on first page load.
- Errors show on field touch/blur or export attempt.
- Export attempt validates all entries.
- Invalid export shows a top-level alert and field errors.

### Files affected

- `src/lib/validation.js`
- `src/app/page.js`
- `components/DeliveryEntryForm.jsx`
- `components/form/*`

### Current status

Validation is implemented and integrated with export flow.

---

## 2026-06-16 — Task 6 completed: complete one-page UI

### What changed

The app preview was turned into a complete one-page delivery export UI.

### Why it changed

The app needed a real workflow-oriented interface for non-technical delivery partners.

### UI structure

- Header/hero
- Main delivery form area
- Actions area
- Summary/help area
- Footer/support note

### Field grouping

Delivery fields are grouped for readability:

- Βασικά στοιχεία
- Στοιχεία Α.Φ.Μ.
- Δρομολόγιο
- Λεπτομέρειες μεταφοράς

### Current status

The app is a single-page UI and should remain single-page unless Leandros requests otherwise.

---

## 2026-06-16 — Task 5 completed: multiple delivery entries

### What changed

Support for multiple delivery entries was implemented.

### Why it changed

Users must be able to create multiple delivery records before exporting. Each delivery becomes one CSV row.

### Behavior

- Add delivery
- Edit delivery
- Remove delivery
- Reset delivery
- Clear all deliveries
- Track total delivery count

### Files affected

- `hooks/useDeliveryEntries.js`
- `components/DeliveryEntryForm.jsx`
- `src/app/page.js`

### Current status

Multiple delivery entries are supported. Current UX uses accordion cards.

---

## 2026-06-16 — Task 4 completed: dropdown options from Excel

### What changed

Dropdown options were extracted/mapped from additional Excel sheets.

### Why it changed

ComboBox fields need controlled options based on the ERP import Excel source.

### Dropdown mappings

- `Αποστολή` → sheet `ΑΠΟΣΤΟΛΗ`
- `Συνθήκη` → sheet `ΣΥΝΘΗΚΗ ΜΕΤΑΦΟΡΑΣ`
- `Παλ/Κιβ` → sheet `ΠΑΛΕΤΑ Ή ΚΙΒΩΤΙΟ`
- `Πληρωτής` → sheet `ΠΛΗΡΩΤΗΣ`

### Files affected

- `scripts/extract-dropdown-options.js`
- `src/data/dropdownOptions.js`
- `src/lib/deliverySchema.js`
- `package.json`

### Important note

Dropdown export values should not be changed without ERP confirmation. `Πληρωτής` is especially important because known values are `1 = Αποστολέας` and `2 = Εντολέας`.

---

## 2026-06-16 — Task 3 completed: form schema from Excel definitions

### What changed

A reusable delivery schema was created from the Excel definitions.

### Why it changed

The app should render fields and export CSV based on a single schema source instead of duplicated manual definitions.

### Files affected

- `src/lib/deliverySchema.js`
- `scripts/inspect-excel.js`
- `package.json`

### Important behavior

- `DELIVERY_FIELDS` defines fields and order.
- `CSV_HEADERS` derives headers from field definitions.
- `createEmptyDelivery()` initializes entries.
- Field types map to reusable components.

### Critical invariant

Do not reorder fields or rename headers without confirming ERP impact.

---

## 2026-06-16 — Task 2 completed: reusable form components

### What changed

Reusable form components were created.

### Why it changed

The app needs consistent, accessible, reusable inputs based on the Excel field/component schema.

### Components

- `TextBox`
- `NumberInput`
- `ComboBox`
- `DateInput`
- `BigTextBox`
- `FormField`

### Files affected

- `components/form/*`
- `src/app/globals.css`
- `src/app/page.js` during preview phase

### Current status

Form components are reused by `DeliveryEntryForm` and should not be bypassed with duplicated input markup.

---

## 2026-06-16 — Task 1 completed: project initialized

### What changed

The `delivery-export` Next.js project was initialized under:

```txt
/home/leandrosdim777/projects/delivery-export
```

The uploaded Excel file was copied to:

```txt
data/IMPORT.xlsx
```

Basic folders and docs were created.

### Why it changed

Leandros requested a new delivery export web app in the WSL projects folder.

### Initial stack

- Next.js App Router
- JavaScript
- npm
- ESLint
- Vercel target

### Files affected

- project scaffold files
- `data/IMPORT.xlsx`
- `AGENTS.md`
- `docs/PROJECT_BRIEF.md`

### Verification

Initial lint/build passed after repairing interrupted install.

---

## Future production checklist

Before using this app in production with the real ERP workflow:

1. Generate a CSV from realistic delivery data.
2. Import it into the ERP test/staging environment.
3. Confirm whether dropdown fields, especially `Πληρωτής`, must export code, label, or another ERP-specific value.
4. Confirm date format expectations.
5. Confirm decimal separator expectations for amounts.
6. Confirm whether UTF-8 BOM is accepted/preferred by the ERP.
7. Document any confirmed ERP-specific behavior in both `AGENTS.md` and this file.
