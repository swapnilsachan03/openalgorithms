import React from "react";

export type Alignment = "left" | "center" | "right";

export interface Column<T> {
  key: keyof T;
  label: string;
  align?: Alignment;
  sortable?: boolean;
  width?: string;
  render?: (value: unknown, row: T) => React.ReactNode;
}

export interface TableProps<T> {
  headers: Column<T>[];
  data: T[];
  showHeaders?: boolean;
  showBorders?: boolean;
  showRowBorders?: boolean;
  striped?: boolean;
  hover?: boolean;
  compact?: boolean;
  loading?: boolean;
  emptyText?: string;
  className?: string;
}

export default function Table<T extends Record<string, unknown>>({
  headers,
  data,
  showHeaders = true,
  showBorders = false,
  showRowBorders = false,
  striped = false,
  hover = true,
  compact = false,
  loading = false,
  emptyText = "No records found",
  className = "",
}: TableProps<T>) {
  return (
    <div className={`overflow-x-auto ${className}`}>
      <table
        className={`
          min-w-full border-neutral-400
          ${showBorders ? "border-collapse border" : ""}
          ${striped ? "odd:bg-white even:bg-gray-50" : ""}
        `}
      >
        {showHeaders ? (
          <thead className="bg-neutral-100 dark:bg-neutral-800 pb-1">
            <tr>
              {headers.map(col => {
                let alignClass = "text-center";

                switch (col.align) {
                  case "left":
                    alignClass = "text-left";
                    break;

                  case "right":
                    alignClass = "text-right";
                    break;
                }

                return (
                  <th
                    key={String(col.key)}
                    className={`
                    px-4 ${compact ? "py-1.5" : "py-2"}
                    ${alignClass}
                    ${col.width || ""}
                    ${showBorders ? "border-collapse border" : ""}
                    ${showRowBorders ? "border-collapse border-b-[1px]" : ""}
                  `}
                  >
                    {col.label}
                  </th>
                );
              })}
            </tr>
          </thead>
        ) : null}

        <tbody>
          {loading ? (
            <tr>
              <td colSpan={headers.length} className="p-4 text-center">
                Loading…
              </td>
            </tr>
          ) : data.length > 0 ? (
            data.map((row, rowIndex) => (
              <tr
                key={rowIndex}
                className={`${hover ? "hover:bg-gray-100" : ""} ${
                  showRowBorders ? "border-collapse border-b-[1px]" : ""
                }`}
              >
                {headers.map(col => {
                  const raw = row[col.key];
                  const cell = col.render ? col.render(raw, row) : raw;

                  let alignClass = "text-left";

                  switch (col.align) {
                    case "center":
                      alignClass = "text-center";
                      break;

                    case "right":
                      alignClass = "text-right";
                      break;
                  }

                  return (
                    <td
                      key={String(col.key)}
                      className={`px-4 ${compact ? "py-1" : "py-2"}
                        ${alignClass}
                        ${col.width || ""}
                        ${showBorders ? "border-collapse border" : ""}
                        ${
                          showRowBorders ? "border-collapse border-b-[1px]" : ""
                        }
                      `}
                    >
                      {cell as React.ReactNode}
                    </td>
                  );
                })}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={headers.length} className="p-4 text-center">
                {emptyText}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
