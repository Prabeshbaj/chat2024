import React from 'react';
import {
  useTable,
  ColumnDef,
  flexRender,
  getCoreRowModel,
} from '@tanstack/react-table';

// Define your data type based on the JSON structure
type UserProfile = {
  CrewId: string;
  Email: string;
  Firstname: string;
  Lastname: string;
  CreatedOn: string;
};

const UserProfileTable: React.FC<{ data: UserProfile[] }> = ({ data }) => {
  // Define the columns
  const columns: ColumnDef<UserProfile>[] = [
    {
      header: 'Crew ID',
      accessorKey: 'CrewId',
    },
    {
      header: 'First Name',
      accessorKey: 'Firstname',
    },
    {
      header: 'Last Name',
      accessorKey: 'Lastname',
    },
    {
      header: 'Email',
      accessorKey: 'Email',
    },
    {
      header: 'Created On',
      accessorKey: 'CreatedOn',
    },
  ];

  // Create the table instance
  const table = useTable({
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
                {flexRender(
                  header.column.columnDef.header,
                  header.getContext()
                )}
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
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default UserProfileTable;
