"use client";

import { useEffect, useState } from "react";
import { db } from "@/lib/firebaseConfig";
import { collection, getDocs } from "firebase/firestore";

type SmallOrder = {
  id: string;
  [key: string]: any;
};

export default function SmallOrderList() {
  const [orders, setOrders] = useState<SmallOrder[]>([]);
  const [allKeys, setAllKeys] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const snapshot = await getDocs(collection(db, "smallorder"));
        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        const keysSet = new Set<string>();
        data.forEach((doc) => {
          Object.keys(doc).forEach((key) => keysSet.add(key));
        });

        setOrders(data);
        setAllKeys(Array.from(keysSet));
      } catch (error) {
        console.error("Error fetching small orders:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  return (
    <div className="overflow-x-auto max-w-7xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4 text-green-700">📦 All Small Order Fields</h1>

      {loading ? (
        <p>Loading orders...</p>
      ) : orders.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        <table className="min-w-full border border-gray-300 text-sm">
          <thead>
            <tr className="bg-green-100 text-left">
              {allKeys.map((key) => (
                <th key={key} className="border p-2 font-semibold whitespace-nowrap">
                  {key}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {orders.map((order, index) => (
              <tr key={order.id || index} className="border-t">
                {allKeys.map((key) => (
                  <td key={key} className="border p-2 whitespace-nowrap">
                    {typeof order[key] === "object"
                      ? JSON.stringify(order[key])
                      : String(order[key] ?? "")}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
