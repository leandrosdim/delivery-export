import { TextBox, NumberInput, ComboBox, DateInput, BigTextBox } from "./form";
import { FIELD_GROUPS } from "../src/lib/deliverySchema";

const COMPONENT_MAP = {
  TextBox,
  NumberInput,
  ComboBox,
  DateInput,
  BigTextBox,
};

export default function DeliveryEntryForm({
  index,
  entry,
  fields,
  onUpdate,
  onReset,
  onRemove,
  canRemove,
}) {
  function handleChange(fieldKey, value) {
    onUpdate(index, fieldKey, value);
  }

  function renderField(field) {
    const Component = COMPONENT_MAP[field.component] || TextBox;
    const commonProps = {
      label: field.label,
      name: `entry-${index}-${field.key}`,
      value: entry[field.key] || "",
      onChange: (e) => handleChange(field.key, e.target.value),
      placeholder: field.placeholder,
      required: field.required,
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
    <div className="delivery-card">
      <div className="delivery-card__header">
        <div className="delivery-card__title-row">
          <h2 className="delivery-card__title">Παράδοση {index + 1}</h2>
          <span className="delivery-card__helper">
            {index === 0 ? "Κύρια παράδοση" : "Πρόσθετη παράδοση"}
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
            onClick={() => onRemove(index)}
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
    </div>
  );
}