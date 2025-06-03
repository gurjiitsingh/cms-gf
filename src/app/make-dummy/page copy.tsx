"use client";

import { useState } from "react";
import { db } from "@/lib/firebaseConfig";
import {
  collection,
  getDocs,
  setDoc,
  doc,
  Timestamp,
} from "firebase/firestore";

type CustomerRecentOrder = {
  customerId: string;
  name: string;
  email: string;
  orderDate: string; // e.g. "16 May 2025, 13:51:04"
};

export default function CustomerRecentOrderMigrator() {
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);

  const handleMigrate = async () => {
    setLoading(true);
    setStatus("");

    try {
      const srcRef = collection(db, "customerRecentOrder");
      const snapshot = await getDocs(srcRef);

      for (const docSnap of snapshot.docs) {
        const data = docSnap.data() as CustomerRecentOrder;

        const dateObj = new Date(data.orderDate);
        if (isNaN(dateObj.getTime())) {
          console.warn(`Invalid date for ${data.customerId}:`, data.orderDate);
          continue;
        }

        const lastOrderDate = Timestamp.fromDate(dateObj);

        const newData = {
          customerId: data.customerId,
          name: data.name,
          email: data.email,
          lastOrderDate,
        };

        const destRef = doc(db, "customerRecentOrderDummy", data.customerId);
        await setDoc(destRef, newData);
      }

      setStatus("✅ Migration completed successfully.");
    } catch (err) {
      console.error("❌ Migration failed:", err);
      setStatus("❌ Migration failed. Check console for errors.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto my-10 p-4 bg-white border rounded shadow">
      <h2 className="text-xl font-semibold mb-4">
        Migrate Customer Orders to Dummy Collection
      </h2>
      <button
        onClick={handleMigrate}
        disabled={loading}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        {loading ? "Migrating..." : "Start Migration"}
      </button>

      {status && <p className="mt-4 font-medium text-blue-700">{status}</p>}
    </div>
  );
}
