'use client';

import { useState } from 'react';
import {
  collection,
  query,
  where,
  getDocs,
  orderBy,
} from 'firebase/firestore';
import { db } from '@/lib/firebaseConfig';
import { orderMasterDataT } from '@/lib/types/orderMasterType';

export default function OrderSearchByName() {
  const [name, setName] = useState('');
  const [results, setResults] = useState<orderMasterDataT[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!name.trim()) return;

    setLoading(true);
    setResults([]);

    try {
      const q = query(
        collection(db, 'orderMaster'),
        where('customerName', '==', name.trim()),
        orderBy('srno', 'desc')
      );

      const snapshot = await getDocs(q);

      const orders: orderMasterDataT[] = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as orderMasterDataT[];

      setResults(orders);
    } catch (error) {
      console.error('Search failed:', error);
    }

    setLoading(false);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto bg-white rounded shadow border">
      <h2 className="text-xl font-semibold mb-4">🔍 Search Orders by Name</h2>

      <div className="flex flex-col sm:flex-row gap-2 mb-4">
        <input
          type="text"
          placeholder="Enter customer name"
          className="border px-3 py-2 rounded flex-1"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <button
          onClick={handleSearch}
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          {loading ? 'Searching...' : 'Search'}
        </button>
      </div>

      {results.length > 0 && (
        <table className="min-w-full border border-gray-300 text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="border px-3 py-2 text-left">Sr No</th>
              <th className="border px-3 py-2 text-left">Customer Name</th>
              <th className="border px-3 py-2 text-left">Email</th>
              <th className="border px-3 py-2 text-left">User ID</th>
              <th className="border px-3 py-2 text-left">Order ID</th>
              <th className="border px-3 py-2 text-left">Created At</th>
            </tr>
          </thead>
          <tbody>
            {results.map((order) => (
              <tr key={order.id} className="hover:bg-gray-50">
                <td className="border px-3 py-2">{order.srno}</td>
                <td className="border px-3 py-2">{order.customerName || '-'}</td>
                <td className="border px-3 py-2">{order.email || '-'}</td>
                <td className="border px-3 py-2">{order.userId}</td>
                <td className="border px-3 py-2">{order.id}</td>
                <td className="border px-3 py-2">
                  {order.createdAt?.toDate().toLocaleString() ?? '-'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {!loading && results.length === 0 && (
        <p className="text-gray-500">No results found.</p>
      )}
    </div>
  );
}
