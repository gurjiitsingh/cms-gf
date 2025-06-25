'use client';

import { useEffect, useState } from 'react';
import {
  collection,
  getDocs,
  limit,
  orderBy,
  query,
  startAfter,
  DocumentData,
  QueryDocumentSnapshot,
} from 'firebase/firestore';
import { db } from '@/lib/firebaseConfig';
import { Timestamp } from 'firebase/firestore';

export type orderMasterDataT = {
  id: string;
  customerName: string;
  couponCode: string;
  email: string;
  userId: string;
  addressId: string;
  time: string;
  endTotalG: number;
  itemTotal: number;
  paymentType: string;
  totalDiscountG: number;
  flatDiscount: number;
  status: string;
  srno: number;
  timeId: string;
  deliveryCost: number;
  calculatedPickUpDiscountL: number;
  calCouponDiscount: number;
  couponDiscountPercentL: number;
  pickUpDiscountPercentL: number;
  createdAt?: Timestamp;
};

const ORDERS_PER_PAGE = 5;

export default function OrderListPage() {
  const [orders, setOrders] = useState<orderMasterDataT[]>([]);
  const [lastDoc, setLastDoc] = useState<QueryDocumentSnapshot<DocumentData> | null>(null);
  const [firstDoc, setFirstDoc] = useState<QueryDocumentSnapshot<DocumentData> | null>(null);
  const [prevDocsStack, setPrevDocsStack] = useState<QueryDocumentSnapshot<DocumentData>[]>([]);

  useEffect(() => {
    fetchOrders();
  }, []);

  async function fetchOrders(next = false, back = false) {
    const collectionRef = collection(db, 'orderMaster');
    let q;

    if (next && lastDoc) {
      setPrevDocsStack((prev) => [...prev, lastDoc]);
      q = query(collectionRef, orderBy('createdAt', 'desc'), startAfter(lastDoc), limit(ORDERS_PER_PAGE));
    } else if (back && prevDocsStack.length > 1) {
      const newStack = [...prevDocsStack];
      newStack.pop();
      const prev = newStack[newStack.length - 1];
      setPrevDocsStack(newStack);
      q = query(collectionRef, orderBy('createdAt', 'desc'), startAfter(prev), limit(ORDERS_PER_PAGE));
    } else {
      q = query(collectionRef, orderBy('createdAt', 'desc'), limit(ORDERS_PER_PAGE));
      setPrevDocsStack([]);
    }

    const snapshot = await getDocs(q);

    if (!snapshot.empty) {
      const newOrders = snapshot.docs.map((doc) => {
        const data = doc.data();
        const date = data.createdAt?.toDate?.();
        const formattedDate = date?.toLocaleString('en-GB', {
          year: 'numeric',
          month: 'long',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
        });

        return {
          id: doc.id,
          customerName: data.customerName || '',
          email: data.email || '',
          paymentType: data.paymentType || '',
          status: data.status || '',
          time: formattedDate || '',
          couponCode: data.couponCode || '',
          userId: data.userId || '',
          addressId: data.addressId || '',
          endTotalG: data.endTotalG || 0,
          itemTotal: data.itemTotal || 0,
          totalDiscountG: data.totalDiscountG || 0,
          flatDiscount: data.flatDiscount || 0,
          srno: data.srno || 0,
          timeId: data.timeId || '',
          deliveryCost: data.deliveryCost || 0,
          calculatedPickUpDiscountL: data.calculatedPickUpDiscountL || 0,
          calCouponDiscount: data.calCouponDiscount || 0,
          couponDiscountPercentL: data.couponDiscountPercentL || 0,
          pickUpDiscountPercentL: data.pickUpDiscountPercentL || 0,
          createdAt: data.createdAt,
        } as orderMasterDataT;
      });

      setOrders(newOrders);
      setFirstDoc(snapshot.docs[0]);
      setLastDoc(snapshot.docs[snapshot.docs.length - 1]);
    }
  }

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-semibold mb-4">All Orders</h2>

      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-300">
          <thead className="bg-gray-100">
            <tr>
              <th className="border px-4 py-2">Customer</th>
              <th className="border px-4 py-2">Email</th>
              <th className="border px-4 py-2">Coupon</th>
              <th className="border px-4 py-2">Payment</th>
              <th className="border px-4 py-2">Status</th>
              <th className="border px-4 py-2">Time</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id} className="text-center">
                <td className="border px-4 py-2">{order.customerName}</td>
                <td className="border px-4 py-2">{order.email}</td>
                <td className="border px-4 py-2">{order.couponCode || '-'}</td>
                <td className="border px-4 py-2">{order.paymentType}</td>
                <td className="border px-4 py-2">{order.status}</td>
                <td className="border px-4 py-2">{order.time}</td>
              </tr>
            ))}
            {orders.length === 0 && (
              <tr>
                <td colSpan={6} className="text-center py-4">
                  No data found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="mt-4 flex justify-between">
        <button
          onClick={() => fetchOrders(false, true)}
          className="bg-gray-200 px-4 py-2 rounded hover:bg-gray-300"
          disabled={prevDocsStack.length <= 1}
        >
          Previous
        </button>
        <button
          onClick={() => fetchOrders(true)}
          className="bg-gray-800 text-white px-4 py-2 rounded hover:bg-gray-700"
          disabled={orders.length < ORDERS_PER_PAGE}
        >
          Next
        </button>
      </div>
    </div>
  );
}
