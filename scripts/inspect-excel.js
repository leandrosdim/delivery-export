const XLSX = require("xlsx");
const path = require("path");

const filePath = path.resolve(__dirname, "../data/IMPORT.xlsx");
const workbook = XLSX.readFile(filePath);

console.log("=== Sheet names ===");
console.log(workbook.SheetNames);

const sheetName = "\u03a6\u03cd\u03bb\u03bb\u03bf1";
const sheet = workbook.Sheets[sheetName];

if (!sheet) {
  console.error(`Sheet "${sheetName}" not found.`);
  console.error("Available sheets:", workbook.SheetNames);
  process.exit(1);
}

const data = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: "" });

console.log("\n=== Row 1 (CSV headers) ===");
if (data[0]) {
  data[0].forEach((val, i) => {
    console.log(`  Col ${i}: ${JSON.stringify(val)}`);
  });
} else {
  console.log("  (no data)");
}

console.log("\n=== Row 2 (input types) ===");
if (data[1]) {
  data[1].forEach((val, i) => {
    console.log(`  Col ${i}: ${JSON.stringify(val)}`);
  });
} else {
  console.log("  (no data)");
}

console.log("\n=== Total rows with data ===");
console.log(data.length);