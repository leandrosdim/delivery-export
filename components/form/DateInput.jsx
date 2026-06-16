import FormField from "./FormField";

export default function DateInput({
  label,
  name,
  value,
  onChange,
  onBlur,
  required,
  error,
  disabled,
}) {
  return (
    <FormField label={label} name={name} required={required} error={error}>
      {({ "aria-describedby": describedBy, "aria-invalid": invalid }) => (
        <input
          id={name}
          name={name}
          type="date"
          className="form-input"
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          required={required}
          disabled={disabled}
          aria-describedby={describedBy}
          aria-invalid={invalid}
        />
      )}
    </FormField>
  );
}