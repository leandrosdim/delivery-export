export default function FormField({ label, name, required, error, children }) {
  const errorId = error ? `${name}-error` : undefined;

  return (
    <div className="form-field">
      {label && (
        <label htmlFor={name} className="form-field__label">
          {label}
          {required && <span className="form-field__required"> *</span>}
        </label>
      )}
      <div className="form-field__control">
        {typeof children === "function"
          ? children({ "aria-describedby": errorId, "aria-invalid": !!error })
          : children}
      </div>
      {error && (
        <span id={errorId} className="form-field__error" role="alert">
          {error}
        </span>
      )}
    </div>
  );
}