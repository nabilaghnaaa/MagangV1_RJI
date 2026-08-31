const Card = ({
  children,
  title,
  description,
  action,
  padding = "p-6",
  className = "",
}) => {
  return (
    <section
      className={[
        "rounded-2xl border border-neutral-200 bg-white shadow-sm",
        padding,
        className,
      ].join(" ")}
    >
      {(title || description || action) && (
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            {title && (
              <h2 className="text-base font-semibold text-rji-black">
                {title}
              </h2>
            )}

            {description && (
              <p className="mt-1 text-sm text-neutral-500">
                {description}
              </p>
            )}
          </div>

          {action && <div>{action}</div>}
        </div>
      )}

      {children}
    </section>
  );
};

export default Card;