const DataTable = ({
  columns,
  rows,
  rowKey,
  emptyText = "No records found.",
}) => (
  <div className="overflow-x-auto rounded-xl border border-white/[0.08] bg-white/[0.02]">
    <table className="w-full text-sm text-left">
      <thead className="bg-white/[0.03] text-white/40 text-[10px] uppercase tracking-[0.18em]">
        <tr>
          {columns.map((col) => (
            <th
              key={col.key}
              className={`px-4 py-3 font-semibold whitespace-nowrap font-rr ${col.className || ""}`}
            >
              {col.label}
            </th>
          ))}
        </tr>
      </thead>
      <tbody className="divide-y divide-white/[0.04]">
        {rows.length === 0 ? (
          <tr>
            <td
              colSpan={columns.length}
              className="px-4 py-12 text-center text-white/40"
            >
              {emptyText}
            </td>
          </tr>
        ) : (
          rows.map((row) => (
            <tr
              key={rowKey(row)}
              className="hover:bg-white/[0.02] transition-colors"
            >
              {columns.map((col) => (
                <td
                  key={col.key}
                  className={`px-4 py-3 text-white align-top text-xs sm:text-sm ${
                    col.wrap ? "min-w-[14rem]" : "whitespace-nowrap"
                  } ${col.className || ""}`}
                >
                  {col.render ? col.render(row) : (row[col.key] ?? "—")}
                </td>
              ))}
            </tr>
          ))
        )}
      </tbody>
    </table>
  </div>
);

export default DataTable;
