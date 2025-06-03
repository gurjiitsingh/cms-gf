// components/RecentOrders.tsx
'use client'

import React from 'react'
import Table from '@/components/ui/Table'
import { ColumnDef } from '@tanstack/react-table'

type Order = {
  id: string
  customer: string
  total: number
  date: string
}

const orders: Order[] = [
  { id: '001', customer: 'John Doe', total: 120.5, date: '2025-04-29' },
  { id: '002', customer: 'Jane Smith', total: 85.0, date: '2025-05-01' },
  { id: '003', customer: 'Bob Lee', total: 150.25, date: '2025-04-25' },
  { id: '004', customer: 'Alice Ray', total: 92.0, date: '2025-05-03' },
]

const columns: ColumnDef<Order>[] = [
  { accessorKey: 'id', header: 'Order ID' },
  { accessorKey: 'customer', header: 'Customer' },
  {
    accessorKey: 'total',
    header: 'Total',
    cell: ({ getValue }) => `$${getValue<number>().toFixed(2)}`,
  },
  {
    accessorKey: 'date',
    header: 'Date',
    cell: ({ getValue }) => new Date(getValue<string>()).toLocaleDateString(),
  },
]

export default function RecentOrders() {
  return (
    <div className="bg-white p-6 rounded shadow-md">
      <h2 className="text-xl font-semibold mb-4">Orders This Week</h2>
      <Table columns={columns} data={orders} />
    </div>
  )
}
