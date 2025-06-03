'use client'

import { useState } from 'react'
import { format, isBefore, parseISO, startOfWeek } from 'date-fns'

type Order = {
  id: string
  customerName: string
  userId: string
  time: string // ISO string
}

type Customer = {
  id: string
  name: string
  userId: string
}

// Dummy customers
const customers: Customer[] = Array.from({ length: 50 }, (_, i) => ({
  id: `cust${i + 1}`,
  name: `Customer ${i + 1}`,
  userId: `user${i + 1}`,
}))

// Dummy orders
const orders: Order[] = [
  { id: '1', customerName: 'Customer 1', userId: 'user1', time: '2025-03-28' },
  { id: '2', customerName: 'Customer 5', userId: 'user5', time: '2025-04-20' },
  { id: '3', customerName: 'Customer 20', userId: 'user20', time: '2025-05-15' },
  { id: '4', customerName: 'Customer 35', userId: 'user35', time: '2025-06-28' },
  { id: '5', customerName: 'Customer 10', userId: 'user10', time: '2025-07-01' },
  { id: '6', customerName: 'Customer 3', userId: 'user3', time: '2025-08-24' },
  // others didn't order
]

export default function InactiveCustomersTableWeak() {
  const [selectedDate, setSelectedDate] = useState<string>('2025-04-28')

  const selectedWeekStart = startOfWeek(parseISO(selectedDate))

  const activeUserIdsSince = new Set(
    orders
      .filter((order) => !isBefore(parseISO(order.time), selectedWeekStart))
      .map((order) => order.userId)
  )

  const inactiveCustomers = customers.filter(
    (cust) => !activeUserIdsSince.has(cust.userId)
  )

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">Inactive Customers Since Selected Week</h2>
      <label className="block mb-2">
        Select Week Start Date:
        <input
          type="date"
          className="ml-2 border p-1"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
        />
      </label>

      <table className="w-full border mt-4">
        <thead>
          <tr className="bg-gray-200">
            <th className="border px-4 py-2">Name</th>
            <th className="border px-4 py-2">User ID</th>
          </tr>
        </thead>
        <tbody>
          {inactiveCustomers.map((cust) => (
            <tr key={cust.id}>
              <td className="border px-4 py-2">{cust.name}</td>
              <td className="border px-4 py-2">{cust.userId}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
