"use client";

import { useEffect, useState } from "react";
import { db } from "@/lib/firebaseConfig";
import { collection, getDocs, query, orderBy } from "firebase/firestore";

type NewOrderType = {
  id: string;
  customerName: string;
  userId: string;
  email?: string;
  orderDate?: string;
  srno: number;
};

export default function NewOrderList() {
  const [orders, setOrders] = useState<NewOrderType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const q = query(collection(db, "orderMaster"), orderBy("srno", "desc"));
        const snapshot = await getDocs(q);

        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as NewOrderType[];

        setOrders(data);
      } catch (err) {
        console.error("Error fetching newOrder:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  return (
    <div className="p-5 max-w-4xl mx-auto">
      <h2 className="text-xl font-bold mb-4">New Orders</h2>
      {loading ? (
        <p>Loading...</p>
      ) : orders.length === 0 ? (
        <p>No new orders found.</p>
      ) : (
        <table className="w-full table-auto border border-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="border p-2">Sr No</th>
              <th className="border p-2">Name</th>
              <th className="border p-2">User ID</th>
              <th className="border p-2">Email</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id}>
                <td className="border p-2">{order.srno}</td>
                <td className="border p-2">{order.customerName}</td>
                <td className="border p-2">{order.userId}</td>
                <td className="border p-2">{order.email || "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
