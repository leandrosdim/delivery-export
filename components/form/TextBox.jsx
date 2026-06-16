import FormField from "./FormField";

export default function TextBox({
  label,
  name,
  value,
  onChange,
  placeholder,
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
          type="text"
          className="form-input"
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          disabled={disabled}
          aria-describedby={describedBy}
          aria-invalid={invalid}
        />
      )}
    </FormField>
  );
}