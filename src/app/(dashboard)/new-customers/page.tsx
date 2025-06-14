'use client';

import { useEffect, useState } from 'react';
import {
  collection,
  getDocs,
  query,
  where,
  orderBy,
  Timestamp,
} from 'firebase/firestore';
import { db } from '@/lib/firebaseConfig';
import { orderMasterDataT } from '@/lib/types/orderMasterType';

export default function FirstTimeCustomers() {
  const [orders, setOrders] = useState<orderMasterDataT[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string>(() => {
    const today = new Date();
    return today.toISOString().split('T')[0]; // YYYY-MM-DD
  });

  useEffect(() => {
    fetchFirstTimeCustomers(selectedDate);
  }, [selectedDate]);

  const fetchFirstTimeCustomers = async (dateStr: string) => {
    setLoading(true);

    try {
      const collectionRef = collection(db, 'orderMaster');

      // Fetch all orders
      const snapshot = await getDocs(query(collectionRef));
      const allOrders: orderMasterDataT[] = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as orderMasterDataT[];

      // Count number of orders per userId
      const userOrderCounts: Record<string, orderMasterDataT[]> = {};
      for (const order of allOrders) {
        if (order.userId) {
          if (!userOrderCounts[order.userId]) {
            userOrderCounts[order.userId] = [];
          }
          userOrderCounts[order.userId].push(order);
        }
      }

      // Get users who have only one order
      const oneTimeOrders = Object.values(userOrderCounts)
        .filter((orders) => orders.length === 1)
        .map((orders) => orders[0]);

      // Filter by selected date
      const targetDate = new Date(dateStr);
      const targetStart = new Date(targetDate.setHours(0, 0, 0, 0));
      const targetEnd = new Date(targetDate.setHours(23, 59, 59, 999));

      const filteredOrders = oneTimeOrders.filter((order) => {
        const orderDate = order.createdAt?.toDate?.();
        return orderDate && orderDate >= targetStart && orderDate <= targetEnd;
      });

      setOrders(filteredOrders);
    } catch (error) {
      console.error('Error fetching one-time customers:', error);
    }

    setLoading(false);
  };

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">First-Time Customers (Only 1 Order)</h1>

      <div className="mb-4">
        <label className="font-medium mr-2">Select Date:</label>
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="border px-2 py-1 rounded"
        />
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : orders.length === 0 ? (
        <p>No first-time customers on this date.</p>
      ) : (
       <table className="min-w-full border border-gray-300 text-sm">
  <thead className="bg-gray-100">
    <tr>
      <th className="border px-3 py-2 text-left">Customer Name</th>
      <th className="border px-3 py-2 text-left">Email</th>
      <th className="border px-3 py-2 text-left">Order Date</th>
      <th className="border px-3 py-2 text-left">Coupon Code</th> {/* NEW */}
    </tr>
  </thead>
  <tbody>
    {orders.map((order) => (
      <tr key={order.id} className="hover:bg-gray-50">
        <td className="border px-3 py-2">{order.customerName || '-'}</td>
        <td className="border px-3 py-2">{order.email || '-'}</td>
        <td className="border px-3 py-2">
          {order.createdAt?.toDate().toLocaleString() ?? '-'}
        </td>
        <td className="border px-3 py-2">{order.couponCode || '-'}</td> {/* NEW */}
      </tr>
    ))}
  </tbody>
</table>

      )}
    </div>
  );
}
