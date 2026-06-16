export const FIELD_TYPE_TO_COMPONENT = {
  date: "DateInput",
  text: "TextBox",
  number: "NumberInput",
  "combo box": "ComboBox",
  "big text": "BigTextBox",
};

export function normalizeFieldType(rawType) {
  if (typeof rawType !== "string") return "";
  return rawType.trim().toLowerCase();
}

export function getFieldComponentType(rawType) {
  const normalized = normalizeFieldType(rawType);
  return FIELD_TYPE_TO_COMPONENT[normalized] || "TextBox";
}

const OPTIONS_SOURCE_MAP = {
  "\u0391\u03c0\u03bf\u03c3\u03c4\u03bf\u03bb\u03ae": "\u0391\u03a0\u039f\u03a3\u03a4\u039f\u039b\u0397",
  "\u03a3\u03c5\u03bd\u03b8\u03ae\u03ba\u03b7": "\u03a3\u03a5\u039d\u0398\u0397\u039a\u0397 \u039c\u0395\u03a4\u0391\u03a6\u039f\u03a1\u0391\u03a3",
  "\u03a0\u03b1\u03bb/\u039a\u03b9\u03b2": "\u03a0\u0391\u039b\u0395\u03a4\u0391 \u0389 \u039a\u0399\u0392\u03a9\u03a4\u0399\u039f",
  "\u03a0\u03bb\u03b7\u03c1\u03c9\u03c4\u03ae\u03c2": "\u03a0\u039b\u0397\u03a1\u03a9\u03a4\u0397\u03a3",
};

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

const RAW_TYPES = [
  "date",
  "text",
  "text",
  "text",
  "text",
  "combo box",
  "text",
  "text",
  "text",
  "text",
  "combo box",
  "combo box",
  "number",
  "combo box",
  "big text",
  "number",
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

const REQUIRED = [
  true,
  true,
  true,
  true,
  true,
  true,
  true,
  true,
  true,
  true,
  true,
  true,
  true,
  true,
  false,
  false,
];

const PLACEHOLDERS = [
  "\u0395\u03c0\u03b9\u03bb\u03ad\u03be\u03c4\u03b5 \u03b7\u03bc\u03b5\u03c1\u03bf\u03bc\u03b7\u03bd\u03af\u03b1",
  "\u03c0.\u03c7. \u0394\u0391-12345",
  "\u03a3\u03c5\u03bc\u03c0\u03bb\u03b7\u03c1\u03ce\u03c3\u03c4\u03b5 \u0391.\u03a6.\u039c. \u03c0\u03b5\u03bb\u03ac\u03c4\u03b7",
  "\u03a3\u03c5\u03bc\u03c0\u03bb\u03b7\u03c1\u03ce\u03c3\u03c4\u03b5 \u0391.\u03a6.\u039c. \u03b1\u03c0\u03bf\u03c3\u03c4\u03bf\u03bb\u03ad\u03b1",
  "\u03a3\u03c5\u03bc\u03c0\u03bb\u03b7\u03c1\u03ce\u03c3\u03c4\u03b5 \u0391.\u03a6.\u039c. \u03b5\u03bd\u03c4\u03bf\u03bb\u03ad\u03b1",
  "\u0395\u03c0\u03b9\u03bb\u03ad\u03be\u03c4\u03b5 \u03b1\u03c0\u03bf\u03c3\u03c4\u03bf\u03bb\u03ae",
  "\u03c0.\u03c7. \u0391\u03b8\u03ae\u03bd\u03b1",
  "\u03a3\u03c5\u03bc\u03c0\u03bb\u03b7\u03c1\u03ce\u03c3\u03c4\u03b5 \u0391.\u03a6.\u039c. \u03c0\u03b1\u03c1\u03b1\u03bb\u03ae\u03c0\u03c4\u03b7",
  "\u03c0.\u03c7. \u0391\u03b8\u03ae\u03bd\u03b1",
  "\u03c0.\u03c7. \u0395\u03c1\u03bc\u03bf\u03cd 10",
  "\u0395\u03c0\u03b9\u03bb\u03ad\u03be\u03c4\u03b5 \u03c3\u03c5\u03bd\u03b8\u03ae\u03ba\u03b7 \u03bc\u03b5\u03c4\u03b1\u03c6\u03bf\u03c1\u03ac\u03c2",
  "\u0395\u03c0\u03b9\u03bb\u03ad\u03be\u03c4\u03b5 \u03c0\u03b1\u03bb\u03ad\u03c4\u03b1 \u03ae \u03ba\u03b9\u03b2\u03ce\u03c4\u03b9\u03bf",
  "\u03c0.\u03c7. 1",
  "\u0395\u03c0\u03b9\u03bb\u03ad\u03be\u03c4\u03b5 \u03c0\u03bb\u03b7\u03c1\u03c9\u03c4\u03ae",
  "\u03a0\u03c1\u03bf\u03c3\u03b8\u03ad\u03c3\u03c4\u03b5 \u03c3\u03c7\u03cc\u03bb\u03b9\u03b1 \u03b1\u03bd \u03c7\u03c1\u03b5\u03b9\u03ac\u03b6\u03b5\u03c4\u03b1\u03b9",
  "\u03c0.\u03c7. 50.00",
];

export const DELIVERY_FIELDS = KEYS.map((key, i) => ({
  key,
  header: HEADERS[i],
  label: HEADERS[i],
  type: normalizeFieldType(RAW_TYPES[i]),
  component: FIELD_TYPE_TO_COMPONENT[normalizeFieldType(RAW_TYPES[i])] || "TextBox",
  required: REQUIRED[i],
  placeholder: PLACEHOLDERS[i],
  optionsSource: OPTIONS_SOURCE_MAP[HEADERS[i]] || null,
}));

export const CSV_HEADERS = DELIVERY_FIELDS.map((field) => field.header);

export function getFieldByKey(key) {
  return DELIVERY_FIELDS.find((field) => field.key === key) || null;
}

export function createEmptyDelivery() {
  const delivery = {};
  DELIVERY_FIELDS.forEach((field) => {
    delivery[field.key] = "";
  });
  return delivery;
}

import { getDropdownOptions, hasDropdownOptions } from "../data/dropdownOptions";

export { getDropdownOptions, hasDropdownOptions };

export function getOptionsForField(field) {
  return getDropdownOptions(field.key);
}

export function getDeliveryFieldsWithOptions() {
  return DELIVERY_FIELDS.map((field) => ({
    ...field,
    options: hasDropdownOptions(field.key) ? getDropdownOptions(field.key) : [],
  }));
}

export const FIELD_GROUPS = [
  {
    key: "basika",
    title: "Βασικά στοιχεία",
    fields: ["imerominia", "parastatiko", "posotita", "poso_antikatavolis"],
  },
  {
    key: "afm",
    title: "Στοιχεία Α.Φ.Μ.",
    fields: ["afm_pelati", "afm_apostolea", "afm_entolea", "afm_paralipti"],
  },
  {
    key: "dromologio",
    title: "Δρομολόγιο",
    fields: ["apostoli", "proorismos", "perioxi", "odos"],
  },
  {
    key: "leytomeria",
    title: "Λεπτομέρειες μεταφοράς",
    fields: ["synthiki", "pal_kib", "plirotis", "sxolia"],
  },
];