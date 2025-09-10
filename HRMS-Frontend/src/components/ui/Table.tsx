import React from 'react';
import { LeaveRequest } from '../../types/leaves.types'; // Adjust path as needed

type LeaveRequestKey = keyof LeaveRequest;

interface Column {
  key: LeaveRequestKey;
  label: string;
  className?: string;
  render?: (value: any, row: LeaveRequest) => React.ReactNode;
}

interface TableProps {
  columns: Column[];
  data: LeaveRequest[];
  className?: string;
}

export const Table: React.FC<TableProps> = ({ columns, data, className = '' }) => {
  return (
    <div className={`overflow-x-auto ${className}`}>
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            {columns.map((column) => (
              <th
                key={column.key}
                className={`px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${column.className || ''}`}
              >
                {column.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {data.map((row, index) => (
            <tr
              key={row.id || index}
              className="hover:bg-gray-50 transition-colors duration-150"
            >
              {columns.map((column) => (
                <td
                  key={`${column.key}-${row.id || index}`}
                  className="px-6 py-4 whitespace-nowrap text-sm text-gray-900"
                >
                  {column.render
                    ? (() => {
                        try {
                          // FIXED: Pass actual value instead of null
                          return column.render(row[column.key], row);
                        } catch (error) {
                          console.error(`Render error for column ${column.key}:`, error);
                          return 'N/A';
                        }
                      })()
                    : (row[column.key] as string | number | undefined) ?? 'N/A'}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
