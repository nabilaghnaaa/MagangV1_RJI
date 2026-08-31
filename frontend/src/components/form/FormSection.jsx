const FormSection = ({
  title,
  description,
  children,
  className = "",
}) => {
  return (
    <section
      className={[
        "rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm sm:p-7",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {(title || description) && (
        <div className="mb-6">
          {title && (
            <h2 className="text-base font-bold tracking-tight text-rji-black">
              {title}
            </h2>
          )}

          {description && (
            <p className="mt-1.5 text-sm leading-6 text-neutral-500">
              {description}
            </p>
          )}
        </div>
      )}

      <div>{children}</div>
    </section>
  );
};

export default FormSection;