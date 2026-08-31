import { Search, X } from "lucide-react";

const TableSearch = ({
  value,
  onChange,
  placeholder = "Cari data...",
}) => {
  return (
    <div className="relative w-full sm:max-w-sm">
      <Search
        size={18}
        className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400"
      />

      <input
        type="text"
        value={value}
        onChange={(event) =>
          onChange(event.target.value)
        }
        placeholder={placeholder}
        className="h-10 w-full rounded-xl border border-neutral-300 bg-white pl-10 pr-10 text-sm text-rji-black outline-none transition placeholder:text-neutral-400 focus:border-rji-orange focus:ring-4 focus:ring-rji-orange/10"
      />

      {value && (
        <button
          type="button"
          onClick={() => onChange("")}
          className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-700"
          aria-label="Hapus pencarian"
        >
          <X size={15} />
        </button>
      )}
    </div>
  );
};

export default TableSearch;