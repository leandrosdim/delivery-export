import FormField from "./FormField";

export default function BigTextBox({
  label,
  name,
  value,
  onChange,
  onBlur,
  placeholder,
  required,
  error,
  disabled,
  rows,
}) {
  return (
    <FormField label={label} name={name} required={required} error={error}>
      {({ "aria-describedby": describedBy, "aria-invalid": invalid }) => (
        <textarea
          id={name}
          name={name}
          className="form-input form-input--textarea"
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          placeholder={placeholder}
          required={required}
          disabled={disabled}
          rows={rows || 4}
          aria-describedby={describedBy}
          aria-invalid={invalid}
        />
      )}
    </FormField>
  );
}