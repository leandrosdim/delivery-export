import { DELIVERY_FIELDS, CSV_HEADERS } from "./deliverySchema";

const UTF8_BOM = "\uFEFF";

export function escapeCsvValue(value) {
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

export function createCsvContent(
  deliveries,
  fields = DELIVERY_FIELDS,
  headers = CSV_HEADERS
) {
  const headerRow = headers.map((h) => escapeCsvValue(h)).join(",");
  const dataRows = deliveries.map((delivery) =>
    fields.map((field) => {
      let value = delivery[field.key];
      if (typeof value === "string") {
        value = value.trim();
      }
      return escapeCsvValue(value);
    }).join(",")
  );
  return UTF8_BOM + headerRow + "\n" + dataRows.join("\n") + "\n";
}

export function createCsvFilename(prefix = "delivery-export") {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");
  return `${prefix}-${year}-${month}-${day}-${hours}-${minutes}.csv`;
}

export function downloadCsv(csvContent, filename) {
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.style.display = "none";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}