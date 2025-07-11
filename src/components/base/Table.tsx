import type { ReactNode } from "react";


export interface TableProps {
  headers: string[];
  rows: {
    key: number | string;
    onClick?: () => void;
    columns: (string | ReactNode)[];
  }[];
  columnClasses?: string[];
}

export default function Table({ headers, rows, columnClasses = [] }: TableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="table-fixed w-full text-sm text-left">
        <thead className="bg-gray-200 text-gray-600 font-medium">
          <tr>
            {headers.map((header, index) => (
              <th
                key={index}
                className={`px-4 py-3 ${columnClasses[index] || ""}`}
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {rows.map((row) => (
            <tr
              key={row.key}
              onClick={row.onClick}
              className="cursor-pointer odd:bg-white even:bg-gray-50 hover:bg-gray-100 transition"
            >
              {row.columns.map((col, colIndex) => (
                <td
                  key={colIndex}
                  className={`px-4 py-3 ${columnClasses[colIndex] || ""}`}
                >
                  {col}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
