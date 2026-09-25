const DataTable = ({
  columns,
  rows,
  rowKey,
  emptyText = "No records found.",
}) => (
  <div className="overflow-x-auto rounded-xl border border-border bg-white">
    <table className="w-full text-sm text-left">
      <thead className="bg-gray-50 text-muted-foreground text-xs uppercase tracking-wider">
        <tr>
          {columns.map((col) => (
            <th
              key={col.key}
              className={`px-4 py-3 font-semibold whitespace-nowrap ${col.className || ""}`}
            >
              {col.label}
            </th>
          ))}
        </tr>
      </thead>
      <tbody className="divide-y divide-border">
        {rows.length === 0 ? (
          <tr>
            <td
              colSpan={columns.length}
              className="px-4 py-10 text-center text-muted-foreground"
            >
              {emptyText}
            </td>
          </tr>
        ) : (
          rows.map((row) => (
            <tr
              key={rowKey(row)}
              className="hover:bg-gray-50 transition-colors"
            >
              {columns.map((col) => (
                <td
                  key={col.key}
                  className={`px-4 py-3 text-foreground align-top ${
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
