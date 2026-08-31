const FormActions = ({
  children,
  className = "",
}) => {
  return (
    <div
      className={[
        "flex flex-col-reverse gap-3 border-t border-neutral-200 pt-6 sm:flex-row sm:items-center sm:justify-end",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {children}
    </div>
  );
};

export default FormActions;