'use client';

import { useEffect, useState } from 'react';
import {
  collection,
  query,
  orderBy,
  limit,
  startAfter,
  getDocs,
  deleteDoc,
  doc,
  where,
  DocumentData,
  QueryDocumentSnapshot,
} from 'firebase/firestore';
import { orderMasterDataT } from '@/lib/types/orderMasterType';
import { db } from '@/lib/firebaseConfig';

export default function OrderList() {
  const [orders, setOrders] = useState<orderMasterDataT[]>([]);
  const [lastDoc, setLastDoc] = useState<QueryDocumentSnapshot<DocumentData> | null>(null);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(false);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);

    try {
      const collectionRef = collection(db, 'orderMaster');
      const baseQuery = query(collectionRef, orderBy('srno', 'desc'), limit(20));
      const snapshot = await getDocs(baseQuery);

      const result: orderMasterDataT[] = snapshot.docs.map((doc) => ({
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
      const result: orderMasterDataT[] = snapshot.docs.map((doc) => ({
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

  const handleDeleteByUserId = async (userIdToDelete: string) => {
    const confirmDelete = window.confirm(
      `Are you sure you want to delete all orders for userId: "${userIdToDelete}"?`
    );
    if (!confirmDelete) return;

    try {
      const q = query(collection(db, 'orderMaster'), where('userId', '==', userIdToDelete));
      const snapshot = await getDocs(q);

      if (snapshot.empty) {
        alert('No orders found for this user.');
        return;
      }

      const deletePromises = snapshot.docs.map((docSnap) =>
        deleteDoc(doc(db, 'orderMaster', docSnap.id))
      );
      await Promise.all(deletePromises);

      alert(`Deleted ${snapshot.size} order(s) for userId "${userIdToDelete}".`);

      fetchOrders(); // Refresh list
    } catch (error) {
      console.error('Error deleting orders:', error);
      alert('Failed to delete orders.');
    }
  };

  return (
    <div className="p-4 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Orders (Sorted by Sr No)</h1>

      <table className="min-w-full border border-gray-300 text-sm">
        <thead className="bg-gray-100">
          <tr>
            <th className="border px-3 py-2 text-left">Sr No</th>
            <th className="border px-3 py-2 text-left">Customer Name</th>
            <th className="border px-3 py-2 text-left">User ID</th>
            <th className="border px-3 py-2 text-left">Order ID</th>
            <th className="border px-3 py-2 text-left">Created At</th>
            <th className="border px-3 py-2 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.id} className="hover:bg-gray-50">
              <td className="border px-3 py-2">{order.srno}</td>
              <td className="border px-3 py-2">{order.customerName}</td>
              <td className="border px-3 py-2">{order.userId}</td>
              <td className="border px-3 py-2">{order.id}</td>
              <td className="border px-3 py-2">
                {order.createdAt?.toDate().toLocaleString() ?? '-'}
              </td>
              <td className="border px-3 py-2">
                <button
                  onClick={() => handleDeleteByUserId(order.userId)}
                  className="bg-red-600 text-white px-2 py-1 rounded hover:bg-red-700"
                >
                  Delete All by User
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {hasMore && (
        <div className="mt-4 text-center">
          <button
            onClick={fetchMore}
            disabled={loading}
            className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
          >
            {loading ? 'Loading...' : 'Load More'}
          </button>
        </div>
      )}
    </div>
  );
}
