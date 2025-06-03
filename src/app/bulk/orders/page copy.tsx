'use client'
import { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  orderBy,
  limit,
  query,
  startAfter,
  endBefore,
  limitToLast,
  QueryDocumentSnapshot,
  DocumentData,
} from "firebase/firestore";
import { db } from "@/lib/firebaseConfig";
import { orderMasterDataT } from "@/lib/types/orderMasterType";


const PAGE_SIZE = 20;

export default function OrderListWithPagination() {
  const [orders, setOrders] = useState<orderMasterDataT[]>([]);
  const [loading, setLoading] = useState(false);
  const [lastDoc, setLastDoc] = useState<QueryDocumentSnapshot<DocumentData> | null>(null);
  const [firstDoc, setFirstDoc] = useState<QueryDocumentSnapshot<DocumentData> | null>(null);
  const [prevStack, setPrevStack] = useState<QueryDocumentSnapshot<DocumentData>[]>([]);

  const fetchOrders = async (direction: "initial" | "next" | "prev") => {
    setLoading(true);

    const collectionRef = collection(db, "orderMaster");
    let q;

    if (direction === "next" && lastDoc) {
      setPrevStack((prev) => [...prev, firstDoc!]);
      q = query(collectionRef, orderBy("srno", "desc"), startAfter(lastDoc), limit(PAGE_SIZE));
    } else if (direction === "prev" && prevStack.length > 0) {
      const prev = prevStack[prevStack.length - 1];
      setPrevStack((prev) => prev.slice(0, -1));
      q = query(collectionRef, orderBy("srno", "desc"), startAfter(prev), limit(PAGE_SIZE));
    } else {
      // initial load
      q = query(collectionRef, orderBy("srno", "desc"), limit(PAGE_SIZE));
    }

    const snapshot = await getDocs(q);
    const docs = snapshot.docs;
    const data: orderMasterDataT[] = docs.map((doc) => ({ id: doc.id, ...doc.data() })) as orderMasterDataT[];

    setOrders(data);
    setFirstDoc(docs[0] || null);
    setLastDoc(docs[docs.length - 1] || null);
    setLoading(false);
  };

  useEffect(() => {
    fetchOrders("initial");
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h2 className="text-xl font-bold mb-4">Orders</h2>
      {loading ? (
        <p>Loading...</p>
      ) : orders.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order.id} className="p-4 border rounded bg-white shadow">
              <p className="font-semibold">Order #{order.srno}</p>
              {/* Display other orderMasterDataT fields as needed */}
              <pre className="text-sm text-gray-600">{JSON.stringify(order, null, 2)}</pre>
            </div>
          ))}
        </div>
      )}

      <div className="mt-6 flex justify-between">
        <button
          onClick={() => fetchOrders("prev")}
          disabled={prevStack.length === 0 || loading}
          className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
        >
          Previous
        </button>
        <button
          onClick={() => fetchOrders("next")}
          disabled={orders.length < PAGE_SIZE || loading}
          className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
}
