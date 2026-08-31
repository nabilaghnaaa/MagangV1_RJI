import { AlertCircle } from "lucide-react";

const Input = ({
  label,
  name,
  error,
  helperText,
  required = false,
  className = "",
  id,
  ...props
}) => {
  const inputId = id || name;

  return (
    <div className="space-y-1.5">
      {label && (
        <label
          htmlFor={inputId}
          className="block text-sm font-semibold text-rji-black"
        >
          {label}

          {required && (
            <span className="ml-1 text-red-500">*</span>
          )}
        </label>
      )}

      <input
        id={inputId}
        name={name}
        className={[
          "h-11 w-full rounded-xl border bg-white px-3.5",
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
        <div className="flex items-center gap-1.5 text-xs text-red-600">
          <AlertCircle size={14} />
          <span>{error}</span>
        </div>
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

export default Input;