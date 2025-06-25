"use client";

import { useEffect, useState } from "react";
import {
  collection,
  getCountFromServer,
  getDocs,
  orderBy,
  limit,
  startAfter,
  endBefore,
  QueryDocumentSnapshot,
  DocumentData,
  query,
} from "firebase/firestore";
import { db } from "@/lib/firebaseConfig";

type CustomerRecentOrderT = {
  customerId: string;
  name: string;
  orderDate: string;
  email?: string;
};

const PAGE_SIZE = 10;

export default function CustomerRecentOrderList() {
  const [orders, setOrders] = useState<CustomerRecentOrderT[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(false);

  const [lastVisible, setLastVisible] =
    useState<QueryDocumentSnapshot<DocumentData> | null>(null);
  const [firstVisible, setFirstVisible] =
    useState<QueryDocumentSnapshot<DocumentData> | null>(null);
  const [pageHistory, setPageHistory] = useState<
    QueryDocumentSnapshot<DocumentData>[]
  >([]);

  useEffect(() => {
    const fetchInitialData = async () => {
      setLoading(true);
      try {
        const countSnap = await getCountFromServer(
          collection(db, "customerRecentOrder")
        );
        setTotalCount(countSnap.data().count);

        const q = query(
          collection(db, "customerRecentOrder"),
          orderBy("orderDate", "desc"),
          limit(PAGE_SIZE)
        );
        const snap = await getDocs(q);

        setOrders(snap.docs.map((doc) => doc.data() as CustomerRecentOrderT));
        setFirstVisible(snap.docs[0]);
        setLastVisible(snap.docs[snap.docs.length - 1]);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchInitialData();
  }, []);

  const fetchNext = async () => {
    if (!lastVisible) return;
    setLoading(true);

    try {
      const q = query(
        collection(db, "customerRecentOrder"),
        orderBy("orderDate", "desc"),
        startAfter(lastVisible),
        limit(PAGE_SIZE)
      );
      const snap = await getDocs(q);

      if (!snap.empty) {
        setPageHistory((prev) => [...prev, firstVisible!]);
        setOrders(snap.docs.map((doc) => doc.data() as CustomerRecentOrderT));
        setFirstVisible(snap.docs[0]);
        setLastVisible(snap.docs[snap.docs.length - 1]);
      }
    } catch (error) {
      console.error("Next page error:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchPrevious = async () => {
    if (pageHistory.length === 0) return;
    setLoading(true);

    try {
      const previousCursor = pageHistory[pageHistory.length - 1];

      const q = query(
        collection(db, "customerRecentOrder"),
        orderBy("orderDate", "desc"),
        startAfter(previousCursor),
        limit(PAGE_SIZE)
      );
      const snap = await getDocs(q);

      if (!snap.empty) {
        setOrders(snap.docs.map((doc) => doc.data() as CustomerRecentOrderT));
        setFirstVisible(snap.docs[0]);
        setLastVisible(snap.docs[snap.docs.length - 1]);

        setPageHistory((prev) => prev.slice(0, -1));
      }
    } catch (error) {
      console.error("Previous page error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-5 max-w-6xl mx-auto">
      <h2 className="text-xl font-bold mb-4">
        All Customers’ Recent Orders ({totalCount})
      </h2>

      {loading && orders.length === 0 ? (
        <p className="text-gray-600">Loading...</p>
      ) : orders.length === 0 ? (
        <p className="text-gray-600">No data found.</p>
      ) : (
        <>
          <table className="w-full table-auto border border-gray-300 text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-2 border">Customer ID</th>
                <th className="p-2 border">Name</th>
                <th className="p-2 border">Order Date</th>
                <th className="p-2 border">Email</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.customerId + order.orderDate}>
                  <td className="p-2 border">{order.customerId}</td>
                  <td className="p-2 border">{order.name}</td>
                  <td className="p-2 border">{order.orderDate}</td>
                  <td className="p-2 border">{order.email || "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="flex justify-between mt-4">
            <button
              onClick={fetchPrevious}
              className="bg-gray-500 text-white px-4 py-2 rounded disabled:opacity-50"
              disabled={pageHistory.length === 0 || loading}
            >
              Previous
            </button>
            <button
              onClick={fetchNext}
              className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
              disabled={!lastVisible || loading}
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
}

