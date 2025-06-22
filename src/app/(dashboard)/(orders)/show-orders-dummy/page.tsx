'use client';

import { useEffect, useState } from 'react';
import { collection, getDocs, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebaseConfig';

type OrderMasterDummyT = {
  id: string;
  customerName: string;
  email: string;
  createdAt: Timestamp | string;
  createdAtA?: Timestamp | string; // made optional to fix error
  time: string;
};

export default function OrderMasterDummyList() {
  const [data, setData] = useState<OrderMasterDummyT[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDummyOrders = async () => {
      try {
        const snapshot = await getDocs(collection(db, 'orderMaster'));
        const result: OrderMasterDummyT[] = snapshot.docs.map((doc) => {
          const d = doc.data();
          return {
            id: doc.id,
            customerName: d.customerName || 'N/A',
            email: d.email || 'N/A',
            time: d.time || '',
            createdAt: d.createdAt,
            createdAtA: d.createdAtA, // optional
          };
        });

        result.sort((a, b) => {
          const aDate = a.createdAt instanceof Timestamp ? a.createdAt.toDate() : new Date(a.createdAt);
          const bDate = b.createdAt instanceof Timestamp ? b.createdAt.toDate() : new Date(b.createdAt);
          return bDate.getTime() - aDate.getTime();
        });

        setData(result);
      } catch (error) {
        console.error('Error fetching orderMasterDummy:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDummyOrders();
  }, []);

  const formatDate = (val: Timestamp | string) => {
    if (val instanceof Timestamp) {
      return val.toDate().toLocaleString('en-DE');
    }
    if (typeof val === 'string' && !isNaN(Date.parse(val))) {
      return new Date(val).toLocaleString('en-DE');
    }
    return 'Invalid date';
  };

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-2 text-green-700">OrderMasterDummy Records</h1>
      <p className="text-gray-600 mb-4">Total Records: <strong>{data.length}</strong></p>

      {loading ? (
        <p className="text-gray-600">Loading...</p>
      ) : data.length === 0 ? (
        <p className="text-red-600">No records found.</p>
      ) : (
        <div className="overflow-auto border border-gray-300 rounded">
          <table className="min-w-full table-auto text-sm text-left">
            <thead className="bg-green-800 text-white">
              <tr>
                <th className="px-4 py-2">Name</th>
                <th className="px-4 py-2">Email</th>
                <th className="px-4 py-2">Time</th>
                <th className="px-4 py-2">Created At</th>
              </tr>
            </thead>
            <tbody>
              {data.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50 border-t">
                  <td className="px-4 py-2">{order.customerName}</td>
                  <td className="px-4 py-2">{order.email}</td>
                  <td className="px-4 py-2">{order.time}</td>
                  <td className="px-4 py-2">{formatDate(order.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

