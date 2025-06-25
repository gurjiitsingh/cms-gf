"use client";

import { useState } from "react";
import { db } from "@/lib/firebaseConfig";
import {
  collection,
  getDocs,
  query,
  limit,
  setDoc,
  doc,
} from "firebase/firestore";

export default function CopyOrdersClient() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleCopyOrders = async () => {
    setLoading(true);
    setMessage("");

    try {
      // Step 1: Get first 20 orders from orderMaster
      const orderMasterRef = collection(db, "orderMaster");
      const orderQuery = query(orderMasterRef, limit(20));
      const snapshot = await getDocs(orderQuery);

      const orders = snapshot.docs.map((docSnap) => ({
        id: docSnap.id,
        ...docSnap.data(),
      }));

      // Step 2: Save to smallorder
      const smallOrderRef = collection(db, "smallorder");

      for (const order of orders) {
        await setDoc(doc(smallOrderRef, order.id), order);
      }

      setMessage("✅ Successfully copied 20 records to 'smallorder' collection.");
    } catch (error) {
      console.error("❌ Error copying orders:", error);
      setMessage("❌ Failed to copy orders. Check console for details.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 border rounded shadow max-w-md mx-auto">
      <h2 className="text-xl font-bold mb-4 text-center text-green-700">Copy Orders</h2>
      <button
        onClick={handleCopyOrders}
        disabled={loading}
        className={`w-full px-4 py-2 rounded text-white font-semibold ${
          loading ? "bg-gray-400" : "bg-green-600 hover:bg-green-700"
        }`}
      >
        {loading ? "Copying..." : "Copy First 20 Orders to smallorder"}
      </button>
      {message && <p className="mt-4 text-center">{message}</p>}
    </div>
  );
}
