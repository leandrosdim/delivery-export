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

export default function DeliveryEntryForm({
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
}) {
  const allErrors = useMemo(() => validateDelivery(entry, fields), [entry, fields]);
  const status = getStatusInfo(entry, fields, submitAttempted, touched[index]);

  function handleChange(fieldKey, value) {
    onUpdate(index, fieldKey, value);
  }

  function getVisibleError(fieldKey) {
    const fieldError = allErrors[fieldKey] || null;
    if (!fieldError) return null;
    if (submitAttempted) return fieldError;
    const entryTouched = touched[index];
    if (entryTouched && entryTouched[fieldKey]) return fieldError;
    return null;
  }

  function handleRemove() {
    if (!canRemove) return;
    const confirmed = window.confirm(`Θέλετε σίγουρα να αφαιρέσετε την Παράδοση ${index + 1};`);
    if (!confirmed) return;
    onRemove(index);
  }

  function renderField(field) {
    const Component = COMPONENT_MAP[field.component] || TextBox;
    const visibleError = getVisibleError(field.key);

    const commonProps = {
      label: field.label,
      name: `entry-${index}-${field.key}`,
      value: entry[field.key] || "",
      onChange: (e) => handleChange(field.key, e.target.value),
      onBlur: onFieldBlur ? () => onFieldBlur(index, field.key) : undefined,
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
    <section className={`delivery-card ${status.cardClass}`} aria-label={`Παράδοση ${index + 1}`}>
      <div className="delivery-card__header">
        <div className="delivery-card__title-row">
          <h2 className="delivery-card__title">Παράδοση {index + 1}</h2>
          <span className={`delivery-card__status ${status.className}`}>
            {status.label}
          </span>
        </div>
        <div className="delivery-card__actions">
          <button
            type="button"
            className="btn btn--outline btn--sm"
            onClick={() => onReset(index)}
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
      <div className="delivery-card__body">
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
    </section>
  );
}