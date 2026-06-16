import { DELIVERY_FIELDS } from "./deliverySchema";

const AFM_FIELDS = new Set([
  "afm_pelati",
  "afm_apostolea",
  "afm_entolea",
  "afm_paralipti",
]);

const REQUIRED_MSG = "Το πεδίο είναι υποχρεωτικό.";
const INVALID_DATE_MSG = "Επιλέξτε έγκυρη ημερομηνία.";
const INVALID_NUMBER_MSG = "Συμπληρώστε έγκυρο αριθμό.";
const QUANTITY_GT_ZERO_MSG = "Η ποσότητα πρέπει να είναι μεγαλύτερη από 0.";
const NEGATIVE_AMOUNT_MSG = "Το ποσό δεν μπορεί να είναι αρνητικό.";
const AFM_LENGTH_MSG = "Το Α.Φ.Μ. πρέπει να έχει 9 ψηφία.";

function isAFMField(key) {
  return AFM_FIELDS.has(key);
}

function normalizeAFM(value) {
  if (typeof value !== "string") return "";
  return value.replace(/[\s.\-–—]/g, "");
}

function validateField(field, value) {
  const strValue = value == null ? "" : String(value).trim();
  const isEmpty = strValue === "";

  if (field.required && isEmpty) {
    if (field.type === "date") return INVALID_DATE_MSG;
    if (field.type === "number") return REQUIRED_MSG;
    if (field.type === "combo box") return REQUIRED_MSG;
    if (isAFMField(field.key)) return REQUIRED_MSG;
    return REQUIRED_MSG;
  }

  if (isEmpty) return null;

  if (field.type === "date" && strValue !== "") {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(strValue)) {
      return INVALID_DATE_MSG;
    }
    const dateObj = new Date(strValue + "T00:00:00");
    if (isNaN(dateObj.getTime())) {
      return INVALID_DATE_MSG;
    }
  }

  if (field.type === "number" && strValue !== "") {
    const num = Number(strValue);
    if (isNaN(num)) {
      return INVALID_NUMBER_MSG;
    }
    if (field.key === "posotita") {
      if (num <= 0) return QUANTITY_GT_ZERO_MSG;
    }
    if (field.key === "poso_antikatavolis") {
      if (num < 0) return NEGATIVE_AMOUNT_MSG;
    }
  }

  if (isAFMField(field.key) && strValue !== "") {
    const digits = normalizeAFM(strValue);
    if (!/^\d{9}$/.test(digits)) {
      return AFM_LENGTH_MSG;
    }
  }

  if (field.type === "combo box" && strValue !== "") {
    // valid selection
  }

  return null;
}

export function validateDelivery(deliveryValues, fields = DELIVERY_FIELDS) {
  const errors = {};
  for (const field of fields) {
    const error = validateField(field, deliveryValues[field.key]);
    if (error) {
      errors[field.key] = error;
    }
  }
  return errors;
}

export function validateDeliveries(deliveries, fields = DELIVERY_FIELDS) {
  const allErrors = {};
  for (let i = 0; i < deliveries.length; i++) {
    const entryErrors = validateDelivery(deliveries[i], fields);
    if (Object.keys(entryErrors).length > 0) {
      allErrors[i] = entryErrors;
    }
  }
  return allErrors;
}

export function hasValidationErrors(errors) {
  if (!errors) return false;
  return Object.keys(errors).length > 0;
}

export function getFieldError(errors, deliveryIndex, fieldKey) {
  if (!errors) return null;
  const entryErrors = errors[deliveryIndex];
  if (!entryErrors) return null;
  return entryErrors[fieldKey] || null;
}

export function shouldShowFieldError(touched, deliveryIndex, fieldKey, submitAttempted) {
  if (submitAttempted) return true;
  if (!touched) return false;
  const entryTouched = touched[deliveryIndex];
  if (!entryTouched) return false;
  return !!entryTouched[fieldKey];
}