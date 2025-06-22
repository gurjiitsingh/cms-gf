'use client';

import { useEffect, useState } from 'react';
import {
  collection,
  getDocs,
  orderBy,
  query,
  Timestamp,
  where,
} from 'firebase/firestore';
import { db } from '@/lib/firebaseConfig';
import { orderMasterDataT } from '@/lib/types/orderMasterType';

type OrderEntry = {
  id: string;
  customerName: string;
  email: string;
  userId: string;
  createdAt: Timestamp;
};

export default function OneTimeCustomersByMonth() {
  const [orders, setOrders] = useState<OrderEntry[]>([]);
  const [totalOrders, setTotalOrders] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState('all');
  const [emails, setEmails] = useState<string>(''); // ⬅ New state

  useEffect(() => {
    fetchOneTimeCustomers(selectedMonth);
  }, [selectedMonth]);

  const fetchOneTimeCustomers = async (monthStr: string) => {
    setLoading(true);
    try {
      const collectionRef = collection(db, 'orderMaster');

      let q;
      if (monthStr === 'all') {
        q = query(collectionRef, orderBy('createdAt', 'desc'));
      } else {
        const [year, month] = monthStr.split('-').map(Number);
        const start = new Date(year, month - 1, 1);
        const end = new Date(year, month, 0, 23, 59, 59, 999);

        q = query(
          collectionRef,
          where('createdAt', '>=', Timestamp.fromDate(start)),
          where('createdAt', '<=', Timestamp.fromDate(end)),
          orderBy('createdAt', 'desc')
        );
      }

      const snapshot = await getDocs(q);

      const allOrders = snapshot.docs.map((doc) => {
        const data = doc.data() as orderMasterDataT;
        return {
          id: doc.id,
          customerName: data.customerName || '-',
          email: data.email || 'unknown',
          userId: data.userId || '-',
          createdAt: data.createdAt as Timestamp,
        };
      });

      setTotalOrders(allOrders.length);

      const emailMap = new Map<string, OrderEntry[]>();
      for (const order of allOrders) {
        const list = emailMap.get(order.email) || [];
        list.push(order);
        emailMap.set(order.email, list);
      }

      const oneTimers: OrderEntry[] = [];
      for (const ordersList of emailMap.values()) {
        if (ordersList.length === 1) {
          oneTimers.push(ordersList[0]);
        }
      }

      setOrders(oneTimers);
      setEmails(''); // Clear previous emails
    } catch (err) {
      console.error('Error fetching one-time customers:', err);
    }
    setLoading(false);
  };

  const handleExtractEmails = () => {
  //  const emailList = orders.map((order) => order.email).join(', ');
  const emailList = orders.map((order) => order.email).join('\n'); 
  setEmails(emailList);
  };

  return (
    <div className="p-4 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-4 text-blue-700">One-Time Customers</h1>

      {/* Month filter */}
      <div className="flex gap-4 mb-4 items-center">
        <label className="text-sm font-medium">Select Month:</label>
        <input
          type="month"
          value={selectedMonth === 'all' ? '' : selectedMonth}
          onChange={(e) =>
            setSelectedMonth(e.target.value ? e.target.value : 'all')
          }
          className="border px-2 py-1 rounded"
        />
        <button
          onClick={() => setSelectedMonth('all')}
          className="text-blue-600 underline text-sm"
        >
          Show All Time
        </button>
      </div>

      {/* Stats */}
      <div className="mb-4 text-sm text-gray-700">
        <p>
          Total Orders: <strong>{totalOrders}</strong>
        </p>
        <p>
          One-Time Customers: <strong>{orders.length}</strong>
        </p>
      </div>

      {/* Extract Emails Button */}
      {orders.length > 0 && (
        <div className="mb-4">
          <button
            onClick={handleExtractEmails}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
          >
            Copy Emails
          </button>
        </div>
      )}

      {/* Email List TextArea */}
      {emails && (
        <div className="mb-6">
          <label className="block mb-2 text-sm font-semibold text-gray-700">Email List:</label>
          <textarea
            rows={5}
            value={emails}
            readOnly
            className="w-full border rounded p-2 text-sm font-mono"
          />
        </div>
      )}

      {/* Table */}
      {loading ? (
        <p>Loading...</p>
      ) : orders.length === 0 ? (
        <p>No one-time customers found.</p>
      ) : (
        <table className="min-w-full border border-gray-300 text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="border px-3 py-2 text-left">Customer Name</th>
              <th className="border px-3 py-2 text-left">Email</th>
              <th className="border px-3 py-2 text-left">User ID</th>
              <th className="border px-3 py-2 text-left">Order Date</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id} className="hover:bg-gray-50">
                <td className="border px-3 py-2">{order.customerName}</td>
                <td className="border px-3 py-2">{order.email}</td>
                <td className="border px-3 py-2">{order.userId}</td>
                <td className="border px-3 py-2">
                  {order.createdAt?.toDate().toLocaleString('en-GB')}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
