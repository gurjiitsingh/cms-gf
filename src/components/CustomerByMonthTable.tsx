'use client'

import { useState, useMemo } from 'react'
import { useTable } from '@tanstack/react-table'
import { format } from 'date-fns'


const dummyCustomers = [
  { id: 1, name: 'John Doe', email: 'john@example.com', createdAt: new Date('2025-05-01') },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com', createdAt: new Date('2025-04-15') },
  { id: 3, name: 'Ali Khan', email: 'ali@example.com', createdAt: new Date('2025-03-20') },
  { id: 4, name: 'Maria Gomez', email: 'maria@example.com', createdAt: new Date('2025-05-03') },
]

export default function CustomerByMonthTable() {
  const [selectedMonth, setSelectedMonth] = useState('')

  const filteredCustomers = useMemo(() => {
    if (!selectedMonth) return dummyCustomers
    const [year, month] = selectedMonth.split('-').map(Number)
    return dummyCustomers.filter(
      (c) =>
        c.createdAt.getFullYear() === year &&
        c.createdAt.getMonth() === month - 1
    )
  }, [selectedMonth])

  const columns = useMemo(
    () => [
      { Header: 'Name', accessor: 'name' },
      { Header: 'Email', accessor: 'email' },
      {
        Header: 'Date',
        accessor: (row: any) => format(row.createdAt, 'yyyy-MM-dd'),
        id: 'createdAt',
      },
    ],
    []
  )

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable({ columns, data: filteredCustomers })

  return (
    <div className="p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-semibold mb-4">Customers by Month</h2>

      <input
        type="month"
        value={selectedMonth}
        onChange={(e) => setSelectedMonth(e.target.value)}
        className="mb-4 p-2 border border-gray-300 rounded"
      />

      <table {...getTableProps()} className="w-full text-left border border-gray-300">
        <thead className="bg-gray-100">
          {headerGroups.map((headerGroup) => (
            <tr {...headerGroup.getHeaderGroupProps()} key={headerGroup.id}>
              {headerGroup.headers.map((column) => (
                <th
                  {...column.getHeaderProps()}
                  key={column.id}
                  className="px-4 py-2 border"
                >
                  {column.render('Header')}
                </th>
              ))}
            </tr>
          ))}
        </thead>

        <tbody {...getTableBodyProps()}>
          {rows.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="text-center py-4 text-gray-500">
                No customers found for this month.
              </td>
            </tr>
          ) : (
            rows.map((row) => {
              prepareRow(row)
              return (
                <tr {...row.getRowProps()} key={row.id} className="hover:bg-gray-50">
                  {row.cells.map((cell) => (
                    <td
                      {...cell.getCellProps()}
                      key={cell.column.id}
                      className="px-4 py-2 border"
                    >
                      {cell.render('Cell')}
                    </td>
                  ))}
                </tr>
              )
            })
          )}
        </tbody>
      </table>
    </div>
  )
}
