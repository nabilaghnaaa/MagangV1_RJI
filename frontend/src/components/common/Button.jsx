import { Loader2 } from "lucide-react";

const VARIANTS = {
  primary:
    "bg-rji-orange text-white hover:bg-rji-orange-dark focus:ring-rji-orange/30",

  secondary:
    "bg-rji-black text-white hover:bg-neutral-800 focus:ring-neutral-300",

  outline:
    "border border-neutral-300 bg-white text-rji-black hover:bg-neutral-50 focus:ring-neutral-200",

  ghost:
    "bg-transparent text-neutral-600 hover:bg-neutral-100 hover:text-rji-black focus:ring-neutral-200",

  danger:
    "bg-red-600 text-white hover:bg-red-700 focus:ring-red-200",
};

const SIZES = {
  sm: "h-9 px-3 text-sm",
  md: "h-10 px-4 text-sm",
  lg: "h-11 px-5 text-sm",
};

const Button = ({
  children,
  type = "button",
  variant = "primary",
  size = "md",
  loading = false,
  disabled = false,
  icon: Icon,
  iconPosition = "left",
  className = "",
  ...props
}) => {
  const isDisabled = disabled || loading;

  return (
    <button
      type={type}
      disabled={isDisabled}
      className={[
        "inline-flex items-center justify-center gap-2",
        "rounded-xl font-semibold",
        "transition-all duration-200",
        "focus:outline-none focus:ring-4",
        "disabled:cursor-not-allowed disabled:opacity-60",
        VARIANTS[variant] || VARIANTS.primary,
        SIZES[size] || SIZES.md,
        className,
      ].join(" ")}
      {...props}
    >
      {loading ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" />
          <span>Memproses...</span>
        </>
      ) : (
        <>
          {Icon && iconPosition === "left" && (
            <Icon size={17} strokeWidth={2} />
          )}

          <span>{children}</span>

          {Icon && iconPosition === "right" && (
            <Icon size={17} strokeWidth={2} />
          )}
        </>
      )}
    </button>
  );
};

export default Button;