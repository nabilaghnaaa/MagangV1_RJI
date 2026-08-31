const Select = ({
  label,
  name,
  options = [],
  error,
  helperText,
  required = false,
  placeholder = "Pilih...",
  id,
  className = "",
  ...props
}) => {
  const selectId = id || name;

  return (
    <div className="space-y-1.5">
      {label && (
        <label
          htmlFor={selectId}
          className="block text-sm font-semibold text-rji-black"
        >
          {label}

          {required && (
            <span className="ml-1 text-red-500">*</span>
          )}
        </label>
      )}

      <select
        id={selectId}
        name={name}
        className={[
          "h-11 w-full rounded-xl border bg-white px-3.5",
          "text-sm text-rji-black outline-none transition",
          error
            ? "border-red-300 focus:border-red-500 focus:ring-4 focus:ring-red-500/10"
            : "border-neutral-300 focus:border-rji-orange focus:ring-4 focus:ring-rji-orange/10",
          className,
        ].join(" ")}
        aria-invalid={Boolean(error)}
        {...props}
      >
        <option value="">{placeholder}</option>

        {options.map((option) => {
          if (typeof option === "string") {
            return (
              <option key={option} value={option}>
                {option}
              </option>
            );
          }

          return (
            <option
              key={option.value}
              value={option.value}
            >
              {option.label}
            </option>
          );
        })}
      </select>

      {error && (
        <p className="text-xs text-red-600">
          {error}
        </p>
      )}

      {!error && helperText && (
        <p className="text-xs text-neutral-500">
          {helperText}
        </p>
      )}
    </div>
  );
};

export default Select;