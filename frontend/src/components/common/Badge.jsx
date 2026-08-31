const VARIANTS = {
  default: "bg-neutral-100 text-neutral-700",
  orange: "bg-orange-50 text-orange-700",
  success: "bg-green-50 text-green-700",
  warning: "bg-yellow-50 text-yellow-700",
  danger: "bg-red-50 text-red-700",
  info: "bg-blue-50 text-blue-700",
};

const Badge = ({
  children,
  variant = "default",
  dot = false,
  className = "",
}) => {
  return (
    <span
      className={[
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1",
        "text-xs font-semibold",
        VARIANTS[variant] || VARIANTS.default,
        className,
      ].join(" ")}
    >
      {dot && (
        <span className="h-1.5 w-1.5 rounded-full bg-current" />
      )}

      {children}
    </span>
  );
};

export default Badge;