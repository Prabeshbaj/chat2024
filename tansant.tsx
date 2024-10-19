import React from 'react';
import { createColumnHelper, useReactTable, getCoreRowModel } from '@tanstack/react-table';

// Define your data type based on the JSON structure
type UserProfile = {
  CrewId: string;
  Email: string;
  Firstname: string;
  Lastname: string;
  CreatedOn: string;
};

const columnHelper = createColumnHelper<UserProfile>();

const UserProfileTable: React.FC<{ data: UserProfile[] }> = ({ data }) => {
  // Define the columns
  const columns = [
    columnHelper.accessor('CrewId', {
      header: 'Crew ID',
    }),
    columnHelper.accessor('Firstname', {
      header: 'First Name',
    }),
    columnHelper.accessor('Lastname', {
      header: 'Last Name',
    }),
    columnHelper.accessor('Email', {
      header: 'Email',
    }),
    columnHelper.accessor('CreatedOn', {
      header: 'Created On',
    }),
  ];

  // Create the table instance
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <table>
      <thead>
        {table.getHeaderGroups().map(headerGroup => (
          <tr key={headerGroup.id}>
            {headerGroup.headers.map(header => (
              <th key={header.id}>
                {header.isPlaceholder ? null : header.column.columnDef.header}
              </th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody>
        {table.getRowModel().rows.map(row => (
          <tr key={row.id}>
            {row.getVisibleCells().map(cell => (
              <td key={cell.id}>
                {cell.getValue()}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default UserProfileTable;
