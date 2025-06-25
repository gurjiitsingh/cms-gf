'use client';

import { useEffect, useState } from 'react';
import { collection, getDocs, orderBy, query } from 'firebase/firestore';
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

export default function OrderListPage() {
  const [orders, setOrders] = useState<orderMasterDataT[]>([]);
  const [couponSearch, setCouponSearch] = useState('');

  useEffect(() => {
    fetchOrders();
  }, []);

  async function fetchOrders() {
    const q = query(collection(db, 'orderMaster'), orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);

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
  }

  const filteredOrders = orders.filter((order) =>
    order.couponCode.toLowerCase().includes(couponSearch.toLowerCase())
  );

  const totalAmount = filteredOrders.reduce((acc, order) => acc + (order.endTotalG || 0), 0);

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-semibold mb-4">All Orders</h2>

      <div className="mb-4">
        <input
          type="text"
          placeholder="Search by coupon code..."
          value={couponSearch}
          onChange={(e) => setCouponSearch(e.target.value)}
          className="border px-4 py-2 rounded w-full md:w-1/2"
        />
      </div>

      {couponSearch && (
        <div className="mb-4 text-green-700 font-medium">
          Total for coupon "<strong>{couponSearch}</strong>": <span className="font-bold">€ {totalAmount.toFixed(2)}</span>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-300">
          <thead className="bg-gray-100">
            <tr>
              <th className="border px-4 py-2">Customer</th>
              <th className="border px-4 py-2">Email</th>
              <th className="border px-4 py-2">Coupon</th>
              <th className="border px-4 py-2">Payment</th>
              <th className="border px-4 py-2">Status</th>
              <th className="border px-4 py-2">Total (€)</th>
              <th className="border px-4 py-2">Time</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.map((order) => (
              <tr key={order.id} className="text-center">
                <td className="border px-4 py-2">{order.customerName}</td>
                <td className="border px-4 py-2">{order.email}</td>
                <td className="border px-4 py-2">{order.couponCode || '-'}</td>
                <td className="border px-4 py-2">{order.paymentType}</td>
                <td className="border px-4 py-2">{order.status}</td>
                <td className="border px-4 py-2">€ {order.endTotalG?.toFixed(2)}</td>
                <td className="border px-4 py-2">{order.time}</td>
              </tr>
            ))}
            {filteredOrders.length === 0 && (
              <tr>
                <td colSpan={7} className="text-center py-4 text-gray-500">
                  No orders found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
