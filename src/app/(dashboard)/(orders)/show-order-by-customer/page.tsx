"use client";

import { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  orderBy,
  query,
} from "firebase/firestore";
import { db } from "@/lib/firebaseConfig";
import { orderMasterDataT } from "@/lib/types/orderMasterType";

type GroupedOrders = {
  [count: number]: {
    email: string;
    customerName: string;
    totalOrders: number;
  }[];
};

export default function CustomerOrderFrequency() {
  const [grouped, setGrouped] = useState<GroupedOrders>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchAndGroupOrders();
  }, []);

  const fetchAndGroupOrders = async () => {
    setLoading(true);
    try {
      const collectionRef = collection(db, "orderMaster");
      const q = query(collectionRef, orderBy("createdAt", "desc"));
      const snapshot = await getDocs(q);

      const allOrders: orderMasterDataT[] = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as orderMasterDataT[];

      // Count orders by email
      const countMap = new Map<
        string,
        { customerName: string; email: string; count: number }
      >();

      for (const order of allOrders) {
        const email = order.email || "unknown";
        if (countMap.has(email)) {
          countMap.get(email)!.count += 1;
        } else {
          countMap.set(email, {
            customerName: order.customerName || "-",
            email,
            count: 1,
          });
        }
      }

      // Group by count
      const groupedResult: GroupedOrders = {};
      for (const entry of countMap.values()) {
        const count = entry.count;
        if (!groupedResult[count]) groupedResult[count] = [];
        groupedResult[count].push({
          email: entry.email,
          customerName: entry.customerName,
          totalOrders: count,
        });
      }

      setGrouped(groupedResult);
    } catch (err) {
      console.error("Error fetching orders:", err);
    }
    setLoading(false);
  };

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Customer Order Frequency</h1>
      {loading ? (
        <p>Loading...</p>
      ) : Object.keys(grouped).length === 0 ? (
        <p>No data available.</p>
      ) : (
        Object.keys(grouped)
          .map(Number) // 🔄 Convert keys to numbers
          .sort((a, b) => a - b)
          .map((count) => (
            <div key={count} className="mb-6">
              <h2 className="text-lg font-semibold mb-2">
                Customers who ordered {count} time{count > 1 ? "s" : ""}
              </h2>
              <table className="min-w-full border border-gray-300 text-sm">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="border px-3 py-2 text-left">Customer Name</th>
                    <th className="border px-3 py-2 text-left">Email</th>
                    <th className="border px-3 py-2 text-left">Total Orders</th>
                  </tr>
                </thead>
                <tbody>
                  {grouped[count]?.map((cust, idx) => (
                    <tr key={idx} className="hover:bg-gray-50">
                      <td className="border px-3 py-2">{cust.customerName}</td>
                      <td className="border px-3 py-2">{cust.email}</td>
                      <td className="border px-3 py-2">{cust.totalOrders}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ))
      )}
    </div>
  );
}
