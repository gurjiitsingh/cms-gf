'use client'
import { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  orderBy,
  limit,
  query,
  startAfter,
  QueryDocumentSnapshot,
  DocumentData,
} from "firebase/firestore";
import { db } from "@/lib/firebaseConfig";

type OrderData = {
  id: string;
  srno: number;
  customerName?: string;
  paymentType?: string;
  userId?: string;
};

const PAGE_SIZE = 20;

export default function OrderTable() {
  const [orders, setOrders] = useState<OrderData[]>([]);
  const [loading, setLoading] = useState(false);
  const [lastDoc, setLastDoc] = useState<QueryDocumentSnapshot<DocumentData> | null>(null);
  const [prevStack, setPrevStack] = useState<QueryDocumentSnapshot<DocumentData>[]>([]);

  const fetchOrders = async (direction: "initial" | "next" | "prev") => {
    setLoading(true);

    const collectionRef = collection(db, "orderMaster");
    let q;

    if (direction === "next" && lastDoc) {
      setPrevStack((prev) => [...prev, lastDoc]);
      q = query(collectionRef, orderBy("srno", "desc"), startAfter(lastDoc), limit(PAGE_SIZE));
    } else if (direction === "prev" && prevStack.length > 0) {
      const prev = [...prevStack];
      const goBackTo = prev.pop();
      setPrevStack(prev);
      q = query(collectionRef, orderBy("srno", "desc"), startAfter(goBackTo!), limit(PAGE_SIZE));
    } else {
      q = query(collectionRef, orderBy("srno", "desc"), limit(PAGE_SIZE));
    }

    const snapshot = await getDocs(q);
    const docs = snapshot.docs;

    const data = docs.map(
      (doc) => ({ id: doc.id, ...doc.data() } as OrderData)
    );

    setOrders(data);
    setLastDoc(docs[docs.length - 1] || null);
    setLoading(false);
  };

  useEffect(() => {
    fetchOrders("initial");
  }, []);

  return (
    <div className="max-w-5xl mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-4">Orders Table</h1>

      <div className="overflow-x-auto">
        <table className="min-w-full border text-sm bg-white shadow-md">
          <thead className="bg-gray-100 text-left">
            <tr>
              <th className="border px-4 py-2">Customer Name</th>
              <th className="border px-4 py-2">Payment Type</th>
              <th className="border px-4 py-2">User ID</th>
            </tr>
          </thead>
          <tbody>
            {orders.length === 0 && !loading ? (
              <tr>
                <td colSpan={3} className="text-center py-4 text-gray-500">
                  No orders found.
                </td>
              </tr>
            ) : (
              orders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="border px-4 py-2">{order.customerName || "-"}</td>
                  <td className="border px-4 py-2">{order.paymentType || "-"}</td>
                  <td className="border px-4 py-2">{order.userId || "-"}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="mt-4 flex justify-between">
        <button
          onClick={() => fetchOrders("prev")}
          disabled={prevStack.length === 0 || loading}
          className="bg-gray-300 text-sm px-4 py-2 rounded disabled:opacity-50"
        >
          Previous
        </button>
        <button
          onClick={() => fetchOrders("next")}
          disabled={orders.length < PAGE_SIZE || loading}
          className="bg-blue-600 text-white text-sm px-4 py-2 rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
}
