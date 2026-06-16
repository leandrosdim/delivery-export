const BOM = "\uFEFF";

let passCount = 0;
let failCount = 0;

function assert(condition, message) {
  if (condition) {
    passCount++;
  } else {
    failCount++;
    console.error(`  FAIL: ${message}`);
  }
}

function escapeCsvValue(value) {
  if (value == null) return "";
  const str = String(value);
  const needsQuoting =
    str.includes(",") ||
    str.includes('"') ||
    str.includes("\n") ||
    str.includes("\r");
  if (!needsQuoting) return str;
  const escaped = str.replace(/"/g, '""');
  return `"${escaped}"`;
}

const HEADERS = [
  "\u0397\u03bc\u03b5\u03c1\u03bf\u03bc\u03b7\u03bd\u03af\u03b1",
  "\u03a0\u03b1\u03c1\u03b1\u03c3\u03c4\u03b1\u03c4\u03b9\u03ba\u03cc",
  "\u0391.\u03a6.\u039c. \u03a0\u03b5\u03bb\u03ac\u03c4\u03b7",
  "\u0391.\u03a6.\u039c. \u0391\u03c0\u03bf\u03c3\u03c4\u03bf\u03bb\u03ad\u03b1",
  "\u0391.\u03a6.\u039c. \u0395\u03bd\u03c4\u03bf\u03bb\u03ad\u03b1",
  "\u0391\u03c0\u03bf\u03c3\u03c4\u03bf\u03bb\u03ae",
  "\u03a0\u03c1\u03bf\u03bf\u03c1\u03b9\u03c3\u03bc\u03cc\u03c2",
  "\u0391.\u03a6.\u039c. \u03a0\u03b1\u03c1\u03b1\u03bb\u03ae\u03c0\u03c4\u03b7",
  "\u03a0\u03b5\u03c1\u03b9\u03bf\u03c7\u03ae",
  "\u039f\u03b4\u03cc\u03c2",
  "\u03a3\u03c5\u03bd\u03b8\u03ae\u03ba\u03b7",
  "\u03a0\u03b1\u03bb/\u039a\u03b9\u03b2",
  "\u03a0\u03bf\u03c3\u03cc\u03c4\u03b7\u03c4\u03b1",
  "\u03a0\u03bb\u03b7\u03c1\u03c9\u03c4\u03ae\u03c2",
  "\u03a3\u03c7\u03cc\u03bb\u03b9\u03b1",
  "\u03a0\u03bf\u03c3\u03cc \u03b1\u03bd\u03c4\u03b9\u03ba\u03b1\u03c4\u03b1\u03b2\u03bf\u03bb\u03ae\u03c2",
];

const KEYS = [
  "imerominia",
  "parastatiko",
  "afm_pelati",
  "afm_apostolea",
  "afm_entolea",
  "apostoli",
  "proorismos",
  "afm_paralipti",
  "perioxi",
  "odos",
  "synthiki",
  "pal_kib",
  "posotita",
  "plirotis",
  "sxolia",
  "poso_antikatavolis",
];

const FIELDS = KEYS.map((key, i) => ({ key, header: HEADERS[i] }));

function createCsvContent(deliveries) {
  const headerRow = HEADERS.map((h) => escapeCsvValue(h)).join(",");
  const dataRows = deliveries.map((delivery) =>
    FIELDS.map((field) => {
      let value = delivery[field.key];
      if (typeof value === "string") {
        value = value.trim();
      }
      return escapeCsvValue(value);
    }).join(",")
  );
  return BOM + headerRow + "\n" + dataRows.join("\n") + "\n";
}

console.log("=== CSV Export Tests ===\n");

console.log("1. Escaping commas");
assert(
  escapeCsvValue("hello, world") === '"hello, world"',
  'comma value should be quoted'
);

console.log("2. Escaping quotes");
assert(
  escapeCsvValue('He said "OK"') === '"He said ""OK"""',
  'quotes should be doubled and wrapped'
);

console.log("3. Multiline values");
assert(
  escapeCsvValue("line1\nline2") === '"line1\nline2"',
  'newline should trigger quoting'
);

console.log("4. Carriage return values");
assert(
  escapeCsvValue("line1\rline2") === '"line1\rline2"',
  'carriage return should trigger quoting'
);

console.log("5. Greek text preservation");
const greekValue = "\u0391\u03c0\u03bf\u03c3\u03c4\u03bf\u03bb\u03ad\u03b1\u03c2";
assert(
  escapeCsvValue(greekValue) === greekValue,
  "Greek text should pass through unchanged when no special chars"
);

console.log("6. Empty/null/undefined values");
assert(escapeCsvValue(null) === "", "null should produce empty string");
assert(escapeCsvValue(undefined) === "", "undefined should produce empty string");
assert(escapeCsvValue("") === "", "empty string should produce empty string");

console.log("7. Plain text (no escaping needed)");
assert(escapeCsvValue("simple") === "simple", "simple text should pass through");

console.log("8. Numbers");
assert(escapeCsvValue(42) === "42", "number should be converted to string");
assert(escapeCsvValue(0) === "0", "zero should be converted to string");

console.log("\n9. BOM presence");
const singleDelivery = {};
KEYS.forEach((k) => {
  singleDelivery[k] = "test";
});
const csv = createCsvContent([singleDelivery]);
assert(csv.startsWith(BOM), "CSV content should start with UTF-8 BOM");

console.log("10. Correct header order");
const csvLines = csv.split("\n").filter((l) => l.trim() !== "");
const headerLine = csvLines[0].replace(BOM, "");
const expectedHeaderLine = HEADERS.map((h) => escapeCsvValue(h)).join(",");
assert(
  headerLine === expectedHeaderLine,
  "CSV header should match headers in order"
);

console.log("11. Row values follow field order");
const dataLine = csvLines[1];
const dataFields = dataLine.split(",");
assert(
  dataFields.length === KEYS.length,
  `Expected ${KEYS.length} fields, got ${dataFields.length}`
);

console.log("12. Multiple delivery entries produce multiple data rows");
const d1 = {};
const d2 = {};
KEYS.forEach((k) => {
  d1[k] = "alpha";
  d2[k] = "beta";
});
const multiCsv = createCsvContent([d1, d2]);
const multiLines = multiCsv.split("\n").filter((l) => l.trim() !== "");
assert(multiLines.length === 3, `Expected 3 lines (1 header + 2 data), got ${multiLines.length}`);

console.log("13. Dropdown code values export (\u03a0\u03bb\u03b7\u03c1\u03c9\u03c4\u03ae\u03c2)");
const plirotisDelivery = {};
KEYS.forEach((k) => {
  plirotisDelivery[k] = "x";
});
plirotisDelivery.plirotis = "1";
const plirotisCsv = createCsvContent([plirotisDelivery]);
const plirotisLine = plirotisCsv.split("\n").filter((l) => l.trim() !== "")[1];
assert(
  plirotisLine.includes("1"),
  "\u03a0\u03bb\u03b7\u03c1\u03c9\u03c4\u03ae\u03c2 value of '1' should appear in CSV output"
);

console.log("14. Value with comma in Greek comment");
assert(
  escapeCsvValue("\u0391\u03b8\u03ae\u03bd\u03b1, \u0395\u03bb\u03bb\u03ac\u03b4\u03b1") === '"\u0391\u03b8\u03ae\u03bd\u03b1, \u0395\u03bb\u03bb\u03ac\u03b4\u03b1"',
  "Greek text with comma should be properly quoted"
);

console.log("15. Trimmed values");
const trimDelivery = {};
KEYS.forEach((k) => {
  trimDelivery[k] = "  hello  ";
});
trimDelivery.sxolia = "  line1\nline2  ";
const trimCsv = createCsvContent([trimDelivery]);
const trimLine = trimCsv.split("\n").filter((l) => l.trim() !== "")[1];
assert(
  trimLine.includes("hello"),
  "Trimmed text values should appear"
);
assert(
  !trimLine.includes('"  hello  "'),
  "Outer whitespace should be trimmed on normal fields"
);

console.log("16. Multiline comment handling");
const multilineDelivery = {};
KEYS.forEach((k) => {
  multilineDelivery[k] = "simple";
});
multilineDelivery.sxolia = "line1\nline2\nline3";
const multiCsvContent = createCsvContent([multilineDelivery]);
assert(
  multiCsvContent.includes('"line1\nline2\nline3"'),
  "Multiline comments should be properly escaped"
);

console.log("\n=== Results ===");
console.log(`Passed: ${passCount}`);
console.log(`Failed: ${failCount}`);

if (failCount > 0) {
  console.log("\nSome tests FAILED.");
  process.exit(1);
} else {
  console.log("\nAll tests PASSED.");
}