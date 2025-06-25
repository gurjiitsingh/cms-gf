'use client';

import { useEffect, useState } from 'react';
import {
  collection,
  query,
  orderBy,
  limit,
  startAfter,
  getDocs,
  DocumentData,
  QueryDocumentSnapshot,
} from 'firebase/firestore';
import { db } from '@/lib/firebaseConfig';
import { orderMasterDataT } from '@/lib/types/orderMasterType';

export default function OrderList() {
  const [orders, setOrders] = useState<orderMasterDataT[]>([]);
  const [lastDoc, setLastDoc] = useState<QueryDocumentSnapshot<DocumentData> | null>(null);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(false);

  // 👇 Add or reorder any fields you want to show
  const fields = [
    'srno',
    'customerName',
    'email',
    'userId',
    'addressId', // ← Added here
    'id',
    'createdAt',
    'totalAmount',
    'status',
  ];

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const collectionRef = collection(db, 'orderMaster');
      const q = query(collectionRef, orderBy('srno', 'desc'), limit(20));
      const snapshot = await getDocs(q);

      const result = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as orderMasterDataT[];

      setOrders(result);
      setLastDoc(snapshot.docs[snapshot.docs.length - 1] || null);
      setHasMore(snapshot.docs.length === 20);
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
    setLoading(false);
  };

  const fetchMore = async () => {
    if (!lastDoc) return;
    setLoading(true);

    try {
      const collectionRef = collection(db, 'orderMaster');
      const nextQuery = query(
        collectionRef,
        orderBy('srno', 'desc'),
        startAfter(lastDoc),
        limit(20)
      );
      const snapshot = await getDocs(nextQuery);

      const result = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as orderMasterDataT[];

      setOrders((prev) => [...prev, ...result]);
      setLastDoc(snapshot.docs[snapshot.docs.length - 1] || null);
      setHasMore(snapshot.docs.length === 20);
    } catch (error) {
      console.error('Error fetching more orders:', error);
    }
    setLoading(false);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">📦 All Orders</h1>

      {orders.length === 0 && !loading ? (
        <p>No orders found.</p>
      ) : (
        <div className="overflow-x-auto border rounded">
          <table className="min-w-full text-sm text-left">
            <thead className="bg-gray-100">
              <tr>
                {fields.map((field) => (
                  <th key={field} className="px-4 py-2 border capitalize whitespace-nowrap">
                    {field}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50">
                  {fields.map((field) => (
                    <td key={field} className="px-4 py-2 border whitespace-nowrap">
                      {field === 'createdAt' && order[field]?.toDate
                        ? order[field].toDate().toLocaleString()
                        : String(order[field] ?? '-')}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {hasMore && (
        <div className="mt-6 text-center">
          <button
            onClick={fetchMore}
            disabled={loading}
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Loading...' : 'Load More'}
          </button>
        </div>
      )}
    </div>
  );
}
