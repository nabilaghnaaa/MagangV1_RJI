const Textarea = ({
  label,
  name,
  error,
  helperText,
  required = false,
  id,
  className = "",
  ...props
}) => {
  const textareaId = id || name;

  return (
    <div className="space-y-1.5">
      {label && (
        <label
          htmlFor={textareaId}
          className="block text-sm font-semibold text-rji-black"
        >
          {label}

          {required && (
            <span className="ml-1 text-red-500">*</span>
          )}
        </label>
      )}

      <textarea
        id={textareaId}
        name={name}
        className={[
          "min-h-28 w-full resize-y rounded-xl border bg-white px-3.5 py-3",
          "text-sm text-rji-black placeholder:text-neutral-400",
          "outline-none transition",
          error
            ? "border-red-300 focus:border-red-500 focus:ring-4 focus:ring-red-500/10"
            : "border-neutral-300 focus:border-rji-orange focus:ring-4 focus:ring-rji-orange/10",
          className,
        ].join(" ")}
        aria-invalid={Boolean(error)}
        {...props}
      />

      {error ? (
        <p className="text-xs text-red-600">{error}</p>
      ) : (
        helperText && (
          <p className="text-xs text-neutral-500">
            {helperText}
          </p>
        )
      )}
    </div>
  );
};

export default Textarea;