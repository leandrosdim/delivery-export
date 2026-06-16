import { useMemo } from "react";
import { TextBox, NumberInput, ComboBox, DateInput, BigTextBox } from "./form";
import { FIELD_GROUPS } from "../src/lib/deliverySchema";
import { validateDelivery } from "../src/lib/validation";

const COMPONENT_MAP = {
  TextBox,
  NumberInput,
  ComboBox,
  DateInput,
  BigTextBox,
};

const SUMMARY_FIELDS = ["imerominia", "parastatiko", "proorismos", "perioxi"];

function getStatusInfo(entry, fields, submitAttempted, touched) {
  const errors = validateDelivery(entry, fields);
  const errorCount = Object.keys(errors).length;
  const totalRequired = fields.filter((f) => f.required).length;
  const filledRequired = fields.filter(
    (f) => f.required && entry[f.key] && String(entry[f.key]).trim() !== ""
  ).length;

  if (errorCount > 0 && (submitAttempted || hasTouchedErrors(touched, errors))) {
    return { label: "Χρειάζεται διόρθωση", className: "delivery-card__status--errors", cardClass: "delivery-card--error" };
  }
  if (filledRequired === totalRequired && errorCount === 0) {
    return { label: "Έτοιμη", className: "delivery-card__status--ready", cardClass: "delivery-card--success" };
  }
  return { label: "Σε επεξεργασία", className: "delivery-card__status--draft", cardClass: "" };
}

function hasTouchedErrors(touched, errors) {
  if (!touched) return false;
  for (const key of Object.keys(errors)) {
    if (touched[key]) return true;
  }
  return false;
}

function formatSummaryValue(field, value) {
  if (!value || String(value).trim() === "") return null;
  const str = String(value).trim();
  if (field.key === "imerominia" && /^\d{4}-\d{2}-\d{2}$/.test(str)) {
    const [y, m, d] = str.split("-");
    return `${d}/${m}/${y}`;
  }
  return str;
}

function buildSummaryText(entry, fields) {
  const fieldMap = {};
  fields.forEach((f) => {
    fieldMap[f.key] = f;
  });
  const parts = [];
  for (const key of SUMMARY_FIELDS) {
    const field = fieldMap[key];
    if (!field) continue;
    const val = formatSummaryValue(field, entry[key]);
    if (val) parts.push(val);
  }
  return parts.join(" · ");
}

export default function DeliveryEntryForm({
  entryId,
  index,
  entry,
  fields,
  onUpdate,
  onReset,
  onRemove,
  canRemove,
  submitAttempted,
  touched,
  onFieldBlur,
  isOpen,
  onToggle,
  hasErrors,
}) {
  const allErrors = useMemo(() => validateDelivery(entry, fields), [entry, fields]);
  const status = getStatusInfo(entry, fields, submitAttempted, touched);
  const summaryText = buildSummaryText(entry, fields);
  const bodyId = `delivery-body-${entryId}`;

  function handleChange(fieldKey, value) {
    onUpdate(entryId, fieldKey, value);
  }

  function getVisibleError(fieldKey) {
    const fieldError = allErrors[fieldKey] || null;
    if (!fieldError) return null;
    if (submitAttempted) return fieldError;
    if (touched && touched[fieldKey]) return fieldError;
    return null;
  }

  function handleRemove() {
    if (!canRemove) return;
    const confirmed = window.confirm(`Θέλετε σίγουρα να αφαιρέσετε την Παράδοση ${index + 1};`);
    if (!confirmed) return;
    onRemove(entryId);
  }

  function renderField(field) {
    const Component = COMPONENT_MAP[field.component] || TextBox;
    const visibleError = getVisibleError(field.key);

    const commonProps = {
      label: field.label,
      name: `entry-${entryId}-${field.key}`,
      value: entry[field.key] || "",
      onChange: (e) => handleChange(field.key, e.target.value),
      onBlur: onFieldBlur ? () => onFieldBlur(entryId, field.key) : undefined,
      placeholder: field.placeholder,
      required: field.required,
      error: visibleError,
    };

    if (field.component === "ComboBox") {
      commonProps.options = field.options || [];
    }

    if (field.component === "NumberInput") {
      commonProps.min = 0;
      commonProps.step = "any";
    }

    if (field.component === "BigTextBox") {
      commonProps.rows = 4;
    }

    return <Component key={field.key} {...commonProps} />;
  }

  const fieldMap = {};
  fields.forEach((f) => {
    fieldMap[f.key] = f;
  });

  return (
    <section
      className={`delivery-card ${status.cardClass} ${isOpen ? "delivery-card--open" : "delivery-card--collapsed"}`}
      aria-label={`Παράδοση ${index + 1}`}
    >
      <div className="delivery-card__header">
        <button
          type="button"
          className="delivery-card__toggle"
          onClick={() => onToggle(entryId)}
          aria-expanded={isOpen}
          aria-controls={bodyId}
        >
          <span className="delivery-card__title-row">
            <span className="delivery-card__title">Παράδοση {index + 1}</span>
            <span className={`delivery-card__status ${status.className}`}>
              {status.label}
            </span>
          </span>
          {summaryText && (
            <span className="delivery-card__summary">{summaryText}</span>
          )}
          <span className="delivery-card__chevron" aria-hidden="true">
            {isOpen ? "▴" : "▾"}
          </span>
        </button>
        <div className="delivery-card__actions">
          <button
            type="button"
            className="btn btn--outline btn--sm"
            onClick={() => onReset(entryId)}
          >
            Επαναφορά
          </button>
          <button
            type="button"
            className="btn btn--danger btn--sm"
            onClick={handleRemove}
            disabled={!canRemove}
          >
            Αφαίρεση
          </button>
        </div>
      </div>
      {isOpen && (
        <div className="delivery-card__body" id={bodyId} role="region" aria-label={`Στοιχεία παράδοσης ${index + 1}`}>
          {FIELD_GROUPS.map((group) => (
            <fieldset key={group.key} className="field-group">
              <legend className="field-group__title">{group.title}</legend>
              <div className="field-group__grid">
                {group.fields.map((key) => {
                  const field = fieldMap[key];
                  if (!field) return null;
                  return renderField(field);
                })}
              </div>
            </fieldset>
          ))}
        </div>
      )}
    </section>
  );
}