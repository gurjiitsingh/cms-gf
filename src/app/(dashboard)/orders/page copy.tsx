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
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<orderMasterDataT[] | null>(null);
  const [couponTotal, setCouponTotal] = useState<number | null>(null);

  const pageSize = 10;

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const collectionRef = collection(db, 'orderMaster');
      const q = query(collectionRef, orderBy('srno', 'desc'), limit(pageSize));
      const snapshot = await getDocs(q);

      const result = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as orderMasterDataT[];

      setOrders(result);
      setLastDoc(snapshot.docs[snapshot.docs.length - 1] || null);
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
    setLoading(false);
  };

  const handleNext = async () => {
    if (!lastDoc) return;
    setLoading(true);
    try {
      const q = query(
        collection(db, 'orderMaster'),
        orderBy('srno', 'desc'),
        startAfter(lastDoc),
        limit(pageSize)
      );
      const snapshot = await getDocs(q);
      const result = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as orderMasterDataT[];

      setOrders((prev) => [...prev, ...result]);
      setLastDoc(snapshot.docs[snapshot.docs.length - 1] || null);
    } catch (error) {
      console.error('Error loading next page:', error);
    }
    setLoading(false);
  };

  const handleSearch = async () => {
    const term = searchTerm.trim().toLowerCase();

    if (!term) {
      setSearchResults(null);
      setCouponTotal(null);
      fetchOrders();
      return;
    }

    try {
      const snapshot = await getDocs(collection(db, 'orderMaster'));
      const allOrders = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as orderMasterDataT[];

      const filtered = allOrders.filter((order) => {
        const coupon = order.couponCode?.toLowerCase()?.trim();
        const isValidCoupon = coupon && coupon !== 'na';

        return (
          isValidCoupon &&
          (order.customerName?.toLowerCase().includes(term) ||
            order.email?.toLowerCase().includes(term) ||
            coupon.includes(term))
        );
      });

      const total = filtered.reduce((sum, order) => {
        return sum + (Number(order.totalAmount) || 0);
      }, 0);

      setSearchResults(filtered);
      setCouponTotal(total);
    } catch (err) {
      console.error('Error searching:', err);
    }
  };

  const dataToDisplay = searchResults || orders;

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">📦 Orders</h1>

      <div className="mb-4 flex gap-2">
        <input
          type="text"
          placeholder="Search by name, email or coupon..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border px-3 py-2 rounded w-full md:w-1/3"
        />
        <button
          onClick={handleSearch}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Search
        </button>
      </div>

      {couponTotal !== null && (
        <div className="text-green-700 font-semibold mb-2">
          Total for this coupon: ₹{couponTotal.toFixed(2)}
        </div>
      )}

      <div className="overflow-x-auto border rounded">
        <table className="min-w-full text-sm text-left">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 border">Sr No</th>
              <th className="px-4 py-2 border">Customer Name</th>
              <th className="px-4 py-2 border">Email</th>
              <th className="px-4 py-2 border">Coupon Code</th>
              <th className="px-4 py-2 border">Total</th>
              <th className="px-4 py-2 border">Status</th>
              <th className="px-4 py-2 border">Created At</th>
            </tr>
          </thead>
          <tbody>
            {dataToDisplay.map((order) => (
              <tr key={order.id} className="hover:bg-gray-50">
                <td className="px-4 py-2 border">{order.srno}</td>
                <td className="px-4 py-2 border">{order.customerName || '-'}</td>
                <td className="px-4 py-2 border">{order.email || '-'}</td>
                <td className="px-4 py-2 border">{order.couponCode || '-'}</td>
                <td className="px-4 py-2 border">{Number(order.totalAmount) || 0}</td>
                <td className="px-4 py-2 border">{order.status || '-'}</td>
                <td className="px-4 py-2 border">
                  {order.createdAt?.toDate().toLocaleString() ?? '-'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {!searchResults && (
        <div className="mt-4 flex justify-end">
          <button
            onClick={handleNext}
            disabled={loading}
            className="bg-gray-200 hover:bg-gray-300 text-sm px-4 py-2 rounded disabled:opacity-50"
          >
            Next →
          </button>
        </div>
      )}
    </div>
  );
}
