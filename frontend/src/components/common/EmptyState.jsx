import { Inbox } from "lucide-react";

const EmptyState = ({
  icon: Icon = Inbox,
  title = "Belum ada data",
  description = "Belum ada data yang tersedia.",
  action,
}) => {
  return (
    <div className="flex min-h-60 flex-col items-center justify-center rounded-2xl border border-dashed border-neutral-200 bg-neutral-50 px-6 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-neutral-400 shadow-sm">
        <Icon size={22} />
      </div>

      <h3 className="mt-4 text-sm font-semibold text-rji-black">
        {title}
      </h3>

      <p className="mt-1 max-w-sm text-xs leading-5 text-neutral-500">
        {description}
      </p>

      {action && <div className="mt-5">{action}</div>}
    </div>
  );
};

export default EmptyState;