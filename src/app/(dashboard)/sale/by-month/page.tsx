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

export default function MonthlySalesReport() {
  const [orders, setOrders] = useState<orderMasterDataT[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState<string>(() => {
    const today = new Date();
    return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}`;
  });
  const [totalSales, setTotalSales] = useState<number>(0);

  useEffect(() => {
    if (selectedMonth) fetchOrdersByMonth(selectedMonth);
  }, [selectedMonth]);

 const fetchOrdersByMonth = async (monthStr: string) => {
  setLoading(true);
  try {
    const [year, month] = monthStr.split('-').map(Number);
    const start = new Date(year, month - 1, 1);
    const end = new Date(year, month, 0, 23, 59, 59, 999);

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

    const completedOrders = allOrders.filter(order => order.status === 'Completed');
    setOrders(completedOrders);

  
const total = completedOrders.reduce((sum, order) => sum + (order.endTotalG || 0), 0);

    setTotalSales(total);
  } catch (error) {
    console.error('Error fetching orders by month:', error);
  }
  setLoading(false);
};


  return (
    <div className="p-4 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Monthly Sales Report</h1>

      <div className="mb-4">
        <label className="font-medium mr-2">Select Month:</label>
        <input
          type="month"
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
          className="border px-2 py-1 rounded"
        />
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : orders.length === 0 ? (
        <p>No orders found for this month.</p>
      ) : (
        <>
          <p className="font-semibold mb-3">Total Sales: €{totalSales.toFixed(2)}</p>
          <table className="min-w-full border border-gray-300 text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="border px-3 py-2 text-left">Customer Name</th>
                <th className="border px-3 py-2 text-left">User ID</th>
                <th className="border px-3 py-2 text-left">Date</th>
                <th className="border px-3 py-2 text-left">Total (€)</th>
                <th className="border px-3 py-2 text-left">Payment Type</th>
                <th className="border px-3 py-2 text-left">Status</th>
              </tr>
            </thead>
            <tbody>
            {orders.map((order) => {
  if (order.endTotalG === undefined) {
    console.warn("Missing endTotalG for order:", order.id, order);
  }
  return (
    <tr key={order.id} className="hover:bg-gray-50">
      <td className="border px-3 py-2">{order.customerName || '-'}</td>
      <td className="border px-3 py-2">{order.userId}</td>
      <td className="border px-3 py-2">
        {order.createdAt?.toDate().toLocaleString() ?? '-'}
      </td>
      <td className="border px-3 py-2">€{(order.endTotalG ?? 0).toFixed(2)}</td>
      <td className="border px-3 py-2">{order.paymentType}</td>
      <td className="border px-3 py-2">{order.status}</td>
    </tr>
  );
})}

            </tbody>
          </table>
        </>
      )}
    </div>
  );
}
