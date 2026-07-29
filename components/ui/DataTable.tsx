import type { ReactNode } from "react";

export interface DataTableColumn<TItem> {
  readonly key: string;
  readonly header: string;
  readonly render: (item: TItem) => ReactNode;
}

export interface DataTableProps<TItem> {
  readonly columns: readonly DataTableColumn<TItem>[];
  readonly rows: readonly TItem[];
  readonly rowKey: (item: TItem, index: number) => string;
  readonly emptyState?: ReactNode;
}

export default function DataTable<TItem>({
  columns,
  rows,
  rowKey,
  emptyState = "No records available.",
}: DataTableProps<TItem>) {
  if (rows.length === 0) {
    return <div className="rounded-xl border border-slate-800 bg-slate-950/50 p-4 text-sm text-slate-400">{emptyState}</div>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="ds-table">
        <thead>
          <tr>
            {columns.map((column) => (
              <th key={column.key} scope="col">
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => (
            <tr key={rowKey(row, index)}>
              {columns.map((column) => (
                <td key={column.key}>{column.render(row)}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
