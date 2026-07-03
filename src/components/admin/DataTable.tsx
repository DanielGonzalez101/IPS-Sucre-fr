interface Column<T> {
  key: keyof T;
  header: string;
}

interface DataTableProps<T extends Record<string, unknown>> {
  columns: Column<T>[];
  data: T[];
}

export default function DataTable<T extends Record<string, unknown>>({
  columns,
  data,
}: DataTableProps<T>) {
  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white shadow-sm">
      <table className="w-full text-sm">
        <thead className="bg-gray-50 text-left text-gray-600">
          <tr>
            {columns.map((col) => (
              <th key={String(col.key)} className="px-4 py-3 font-medium">
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100 text-gray-700">
          {data.map((row, i) => (
            <tr key={i} className="hover:bg-gray-50">
              {columns.map((col) => (
                <td key={String(col.key)} className="px-4 py-3">
                  {String(row[col.key] ?? "")}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
