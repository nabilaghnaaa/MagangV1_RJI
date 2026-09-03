import Spinner from "../common/Spinner";
import EmptyState from "../common/EmptyState";

const DataTable = ({
  columns = [],
  data = [],
  loading = false,
  emptyTitle = "Belum ada data",
  emptyDescription = "Belum ada data yang tersedia.",
  rowKey = "id",
}) => {
  if (loading) {
    return (
      <div className="flex min-h-72 items-center justify-center rounded-2xl border border-neutral-200 bg-white">
        <Spinner size={28} />
      </div>
    );
  }

  if (!data.length) {
    return (
      <EmptyState
        title={emptyTitle}
        description={emptyDescription}
      />
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[900px] border-collapse">
          <thead>
            <tr className="border-b border-neutral-200 bg-neutral-50">
              {columns.map((column) => (
                <th
                  key={column.key}
                  className={[
                    "px-5 py-3.5 text-left",
                    "text-xs font-semibold uppercase tracking-wide text-neutral-500",
                    column.headerClassName || "",
                  ].join(" ")}
                >
                  {column.label}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {data.map((row, rowIndex) => (
              <tr
                key={
                  row[rowKey] ??
                  row.id ??
                  rowIndex
                }
                className="border-b border-neutral-100 last:border-b-0 hover:bg-neutral-50/70"
              >
                {columns.map((column) => (
                  <td
                    key={column.key}
                    className={[
                      "px-5 py-4 text-sm text-neutral-700",
                      column.className || "",
                    ].join(" ")}
                  >
                    {column.render
                      ? column.render(
                          row,
                          rowIndex
                        )
                      : row[column.key] ?? "-"}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DataTable;