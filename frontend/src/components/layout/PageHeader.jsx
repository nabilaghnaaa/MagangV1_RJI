const PageHeader = ({
  title,
  description,
  action,
}) => {
  return (
    <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-rji-black sm:text-3xl">
          {title}
        </h1>

        {description && (
          <p className="mt-1.5 max-w-2xl text-sm text-neutral-500">
            {description}
          </p>
        )}
      </div>

      {action && <div>{action}</div>}
    </div>
  );
};

export default PageHeader;