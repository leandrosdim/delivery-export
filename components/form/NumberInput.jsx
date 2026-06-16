import FormField from "./FormField";

export default function NumberInput({
  label,
  name,
  value,
  onChange,
  placeholder,
  required,
  error,
  disabled,
  min,
  step,
}) {
  return (
    <FormField label={label} name={name} required={required} error={error}>
      {({ "aria-describedby": describedBy, "aria-invalid": invalid }) => (
        <input
          id={name}
          name={name}
          type="number"
          className="form-input"
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          disabled={disabled}
          min={min}
          step={step}
          aria-describedby={describedBy}
          aria-invalid={invalid}
        />
      )}
    </FormField>
  );
}