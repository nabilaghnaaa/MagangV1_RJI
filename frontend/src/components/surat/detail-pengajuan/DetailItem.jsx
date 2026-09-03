const DetailItem = ({
  icon: Icon,
  label,
  value,
}) => {
  return (
    <div className="flex gap-3">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-orange-50 text-rji-orange">
        <Icon size={17} />
      </div>

      <div className="min-w-0">
        <p className="text-xs font-medium text-neutral-400">
          {label}
        </p>

        <p className="mt-1 break-words text-sm font-medium text-rji-black">
          {value || "-"}
        </p>
      </div>
    </div>
  );
};

export default DetailItem;