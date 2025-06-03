'use client';

import { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const dummyOrders = [
  {
    id: '1',
    customerName: 'John Doe',
    userId: 'U123',
    time: '2025-05-01T10:00:00Z',
  },
  {
    id: '2',
    customerName: 'Jane Smith',
    userId: 'U124',
    time: '2025-05-03T14:30:00Z',
  },
  {
    id: '3',
    customerName: 'Ali Khan',
    userId: 'U125',
    time: '2025-04-25T09:45:00Z',
  },
];

export default function OrdersByDateRange() {
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);

  const filteredOrders = dummyOrders.filter((order) => {
    const orderDate = new Date(order.time);
    return (
      (!startDate || orderDate >= startDate) &&
      (!endDate || orderDate <= endDate)
    );
  });

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-semibold mb-4">Orders by Date Range</h2>

      <div className="flex gap-4 mb-6">
        <DatePicker
          selected={startDate}
          onChange={(date) => setStartDate(date)}
          selectsStart
          startDate={startDate}
          endDate={endDate}
          placeholderText="Start Date"
          className="border p-2 rounded"
        />
        <DatePicker
          selected={endDate}
          onChange={(date) => setEndDate(date)}
          selectsEnd
          startDate={startDate}
          endDate={endDate}
          placeholderText="End Date"
          className="border p-2 rounded"
        />
      </div>

      <table className="w-full border border-gray-300 text-left">
        <thead className="bg-gray-100">
          <tr>
            <th className="border px-4 py-2">Customer Name</th>
            <th className="border px-4 py-2">User ID</th>
            <th className="border px-4 py-2">Order Date</th>
          </tr>
        </thead>
        <tbody>
          {filteredOrders.length === 0 ? (
            <tr>
              <td colSpan={3} className="text-center p-4">
                No orders found.
              </td>
            </tr>
          ) : (
            filteredOrders.map((order) => (
              <tr key={order.id} className="border-t">
                <td className="px-4 py-2">{order.customerName}</td>
                <td className="px-4 py-2">{order.userId}</td>
                <td className="px-4 py-2">
                  {new Date(order.time).toLocaleString()}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
