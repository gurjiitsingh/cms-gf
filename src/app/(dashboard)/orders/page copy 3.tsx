'use client';

import { useEffect, useState } from 'react';
import { db } from '@/lib/firebaseConfig'; // adjust your Firebase path
import {
  collection,
  query,
  orderBy,
  limit,
  getDocs,
  startAfter,
  DocumentData,
  QueryDocumentSnapshot,
} from 'firebase/firestore';
import { orderMasterDataT } from '@/lib/types/orderMasterType';
 // adjust import to your type location

export default function OrderList() {
  const [orders, setOrders] = useState<orderMasterDataT[]>([]);
  const [lastDoc, setLastDoc] = useState<QueryDocumentSnapshot<DocumentData> | null>(null);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const fetchOrders = async (nextPage = false) => {
    setLoading(true);
    const collectionRef = collection(db, 'orderMaster');
    const baseQuery = query(
      collectionRef,
      orderBy('userId'),
      orderBy('srno', 'desc'),
      limit(20)
    );

    const targetQuery = nextPage && lastDoc
      ? query(baseQuery, startAfter(lastDoc))
      : baseQuery;

    const snapshot = await getDocs(targetQuery);

    const newOrders = snapshot.docs.map(
      (doc) => ({ id: doc.id, ...doc.data() } as orderMasterDataT)
    );

    setOrders(prev => nextPage ? [...prev, ...newOrders] : newOrders);
    setLastDoc(snapshot.docs[snapshot.docs.length - 1]);
    setHasMore(snapshot.docs.length === 20);
    setLoading(false);
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Order List</h2>
      <table className="w-full border-collapse border text-sm">
        <thead>
          <tr className="bg-gray-100">
            <th className="border p-2 text-left">SR No</th>
            <th className="border p-2 text-left">Customer Name</th>
            <th className="border p-2 text-left">Created At</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.id} className="even:bg-gray-50">
              <td className="border p-2">{order.srno}</td>
              <td className="border p-2">{order.customerName}</td>
              <td className="border p-2">
                {order.createDate
                  ? new Date(order.createDate.seconds * 1000).toLocaleString()
                  : 'N/A'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {hasMore && (
        <div className="mt-4">
          <button
            onClick={() => fetchOrders(true)}
            disabled={loading}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Loading...' : 'Load More'}
          </button>
        </div>
      )}
    </div>
  );
}
