const StatCard = ({
  label,
  value,
  description,
}) => {
  return (
    <div className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm">
      <div className="flex min-h-[112px] flex-col justify-between">
        <div>
          <p className="text-sm font-medium text-neutral-500">
            {label}
          </p>

          <p className="mt-2 text-3xl font-bold tracking-tight text-rji-black">
            {value}
          </p>
        </div>

        {description && (
          <p className="mt-3 text-xs leading-5 text-neutral-400">
            {description}
          </p>
        )}
      </div>
    </div>
  );
};

export default StatCard;