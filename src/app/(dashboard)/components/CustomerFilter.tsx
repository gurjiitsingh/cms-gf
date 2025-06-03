'use client';

import { useState } from 'react';

type Order = {
  id: string;
  customerName: string;
  userId: string;
  addressId: string;
  time: string;
  endTotalG: number;
  itemTotal: number;
  paymentType: string;
  totalDiscountG: number;
  flatDiscount: number;
  status: string;
  srno: number;
  timeId: string;
  deliveryCost: number;
  calculatedPickUpDiscountL: number;
  calCouponDiscount: number;
  couponDiscountPercentL: number;
  pickUpDiscountPercentL: number;
};

type Props = {
  orders: Order[];
};

export default function CustomerFilter({ orders }: Props) {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const filteredOrders = orders.filter((order) => {
    const orderTime = new Date(order.time).getTime();
    const start = startDate ? new Date(startDate).getTime() : -Infinity;
    const end = endDate ? new Date(endDate).getTime() : Infinity;
    return orderTime >= start && orderTime <= end;
  });

  return (
    <div className="p-4 max-w-3xl mx-auto">
      <h2 className="text-xl font-semibold mb-4">Filter Customers by Date</h2>
      <div className="flex gap-4 mb-6">
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className="border p-2 rounded"
        />
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          className="border p-2 rounded"
        />
      </div>

      <ul className="space-y-2">
        {filteredOrders.map((order) => (
          <li
            key={order.id}
            className="p-3 border rounded shadow-sm hover:bg-gray-50 transition"
          >
            <p><span className="font-medium">Name:</span> {order.customerName}</p>
            <p><span className="font-medium">User ID:</span> {order.userId}</p>
            <p className="text-sm text-gray-500">Time: {new Date(order.time).toLocaleString()}</p>
          </li>
        ))}
        {filteredOrders.length === 0 && (
          <p className="text-gray-500">No orders found in this date range.</p>
        )}
      </ul>
    </div>
  );
}
