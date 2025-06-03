'use client'

import React, { useState, useMemo } from 'react'
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  ColumnDef,
} from '@tanstack/react-table'

type Customer = {
  id: number
  name: string
  email: string
  phone: string
  joinedAt: Date
}

const dummyData: Customer[] = [
  { id: 1, name: 'Alice Johnson', email: 'alice@example.com', phone: '123-456-7890', joinedAt: new Date() },
  { id: 2, name: 'Bob Smith', email: 'bob@example.com', phone: '987-654-3210', joinedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) }, // Last week
  { id: 3, name: 'Charlie Brown', email: 'charlie@example.com', phone: '555-123-4567', joinedAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000) }, // Older
  { id: 4, name: 'Diana Prince', email: 'diana@example.com', phone: '321-654-0987', joinedAt: new Date() },
]

const columns: ColumnDef<Customer>[] = [
  {
    accessorKey: 'name',
    header: 'Name',
  },
  {
    accessorKey: 'email',
    header: 'Email',
  },
  {
    accessorKey: 'phone',
    header: 'Phone',
  },
  {
    accessorKey: 'joinedAt',
    header: 'Joined At',
    cell: info => new Date(info.getValue() as Date).toLocaleDateString(),
  },
]

function getFilteredData(data: Customer[], filter: string) {
  const now = new Date()
  const startOfThisWeek = new Date(now)
  startOfThisWeek.setDate(now.getDate() - now.getDay())
  startOfThisWeek.setHours(0, 0, 0, 0)

  const startOfLastWeek = new Date(startOfThisWeek)
  startOfLastWeek.setDate(startOfThisWeek.getDate() - 7)

  if (filter === 'thisWeek') {
    return data.filter(c => c.joinedAt >= startOfThisWeek)
  } else if (filter === 'lastWeek') {
    return data.filter(c => c.joinedAt >= startOfLastWeek && c.joinedAt < startOfThisWeek)
  } else {
    return data.filter(c => c.joinedAt < startOfLastWeek)
  }
}

export function CustomerByWeekTable() {
  const [weekFilter, setWeekFilter] = useState<'thisWeek' | 'lastWeek' | 'older'>('thisWeek')

  const filteredData = useMemo(() => getFilteredData(dummyData, weekFilter), [weekFilter])

  const table = useReactTable({
    data: filteredData,
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

  return (
    <div className="p-4 bg-white shadow rounded-lg">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Customers by Week</h2>
        <select
          value={weekFilter}
          onChange={(e) => setWeekFilter(e.target.value as any)}
          className="border rounded px-2 py-1 text-sm"
        >
          <option value="thisWeek">This Week</option>
          <option value="lastWeek">Last Week</option>
          <option value="older">Older</option>
        </select>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm text-left border border-gray-200">
          <thead className="bg-gray-50 text-gray-700">
            {table.getHeaderGroups().map(headerGroup => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map(header => (
                  <th key={header.id} className="px-4 py-2 border-b">
                    {flexRender(header.column.columnDef.header, header.getContext())}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className="text-gray-900">
            {table.getRowModel().rows.map(row => (
              <tr key={row.id} className="hover:bg-gray-100">
                {row.getVisibleCells().map(cell => (
                  <td key={cell.id} className="px-4 py-2 border-b">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
