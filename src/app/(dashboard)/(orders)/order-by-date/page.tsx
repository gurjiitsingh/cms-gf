'use client';

import { useEffect, useState } from 'react';
import {
  collection,
  query,
  orderBy,
  getDocs,
  where,
  Timestamp,
} from 'firebase/firestore';
import { db } from '@/lib/firebaseConfig';
import { orderMasterDataT } from '@/lib/types/orderMasterType';

export default function FirstTimeOrderList() {
  const [orders, setOrders] = useState<orderMasterDataT[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string>(() => {
    const today = new Date();
    return today.toISOString().split('T')[0]; // yyyy-mm-dd
  });

  useEffect(() => {
    if (selectedDate) fetchOrdersByDate(selectedDate);
  }, [selectedDate]);

  const fetchOrdersByDate = async (dateStr: string) => {
    setLoading(true);
    try {
      const start = new Date(dateStr);
      const end = new Date(dateStr);
      end.setHours(23, 59, 59, 999);

      const collectionRef = collection(db, 'orderMaster');
      const dateQuery = query(
        collectionRef,
        where('createdAt', '>=', Timestamp.fromDate(start)),
        where('createdAt', '<=', Timestamp.fromDate(end)),
        orderBy('createdAt', 'desc')
      );

      const snapshot = await getDocs(dateQuery);
      const allOrders: orderMasterDataT[] = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as orderMasterDataT[];

      const userOrderCount: Record<string, number> = {};
      allOrders.forEach((order) => {
        if (order.userId) {
          userOrderCount[order.userId] = (userOrderCount[order.userId] || 0) + 1;
        }
      });

      const firstTimeOrders = allOrders.filter((order) => userOrderCount[order.userId] === 1);
      setOrders(firstTimeOrders);
    } catch (error) {
      console.error('Error fetching orders by date:', error);
    }
    setLoading(false);
  };

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">First-Time Orders</h1>

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
        <p>No first-time orders on this date.</p>
      ) : (
        <table className="min-w-full border border-gray-300 text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="border px-3 py-2 text-left">Customer Name</th>
              <th className="border px-3 py-2 text-left">Email</th>
              <th className="border px-3 py-2 text-left">Date</th>
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
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
