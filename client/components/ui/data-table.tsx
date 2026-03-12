import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

type TableColumn<T> = {
  key: keyof T;
  header: string;
  className?: string;
  render?: (value: T[keyof T], row: T) => ReactNode;
};

type DataTableProps<T extends { id?: string; title?: string; name?: string }> =
  {
    caption?: string;
    columns: TableColumn<T>[];
    rows: T[];
    emptyMessage?: string;
    getRowId?: (row: T, rowIndex: number) => string;
  };

export function DataTable<
  T extends { id?: string; title?: string; name?: string },
>({
  caption,
  columns,
  rows,
  emptyMessage = "No records available.",
  getRowId,
}: DataTableProps<T>) {
  return (
    <div className="overflow-hidden rounded-[28px] border border-white/70 bg-white/86 shadow-[0_34px_90px_-48px_rgba(15,23,42,0.44)] backdrop-blur-xl">
      {caption ? (
        <div className="border-b border-slate-200/80 px-5 py-4 text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">
          {caption}
        </div>
      ) : null}
      <div className="overflow-x-auto">
        <table className="min-w-full border-separate border-spacing-0 text-left">
          <thead>
            <tr className="bg-slate-50/92 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
              {columns.map((column) => (
                <th
                  key={String(column.key)}
                  className={cn("px-5 py-4", column.className)}
                >
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td
                  className="px-5 py-10 text-sm text-slate-500"
                  colSpan={columns.length}
                >
                  {emptyMessage}
                </td>
              </tr>
            ) : null}
            {rows.map((row, rowIndex) => (
              <tr
                key={
                  getRowId?.(row, rowIndex) ??
                  row.id ??
                  row.title ??
                  row.name ??
                  `row-${rowIndex}`
                }
                className="align-top"
              >
                {columns.map((column) => {
                  const value = row[column.key];
                  return (
                    <td
                      key={String(column.key)}
                      className={cn(
                        "border-t border-slate-200/70 px-5 py-4 text-sm leading-6 text-slate-700",
                        column.className
                      )}
                    >
                      {column.render
                        ? column.render(value, row)
                        : String(value)}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
