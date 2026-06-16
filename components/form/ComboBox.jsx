import FormField from "./FormField";

export default function ComboBox({
  label,
  name,
  value,
  onChange,
  onBlur,
  options,
  placeholder,
  required,
  error,
  disabled,
}) {
  return (
    <FormField label={label} name={name} required={required} error={error}>
      {({ "aria-describedby": describedBy, "aria-invalid": invalid }) => (
        <select
          id={name}
          name={name}
          className="form-input"
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          required={required}
          disabled={disabled}
          aria-describedby={describedBy}
          aria-invalid={invalid}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      )}
    </FormField>
  );
}