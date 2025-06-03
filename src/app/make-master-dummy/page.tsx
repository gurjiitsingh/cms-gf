"use client";

import { useState } from "react";
import { db } from "@/lib/firebaseConfig";
import {
  collection,
  getDocs,
  addDoc,
  Timestamp,
} from "firebase/firestore";

export default function TransferOrderToDummy() {
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [message, setMessage] = useState("");

  type orderMasterDataT = {
    id: string;
    customerName: string;
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
    createdAt: Timestamp | string;
    calCouponDiscount: number;
    couponDiscountPercentL: number;
    couponCode: string | undefined;
    pickUpDiscountPercentL: number;
  };

  const handleTransfer = async () => {
    setStatus("loading");
    setMessage("");

    try {
      const snapshot = await getDocs(collection(db, "orderMaster"));
      if (snapshot.empty) {
        setMessage("No data found in orderMaster.");
        setStatus("done");
        return;
      }

      let count = 0;

     for (const docSnap of snapshot.docs) {
  const data = docSnap.data() as orderMasterDataT;

  // ✅ Safe handling of createdAt
  const createdAt =
    data.createdAt instanceof Timestamp
      ? data.createdAt
      : typeof data.createdAt === "string" && !isNaN(Date.parse(data.createdAt))
      ? Timestamp.fromDate(new Date(data.createdAt))
      : Timestamp.now(); // fallback if undefined or invalid

  await addDoc(collection(db, "orderMasterDummy"), {
    ...data,
    createdAt,
  });

  count++;
}
      setStatus("done");
      setMessage(`✅ Successfully transferred ${count} record(s) to orderMasterDummy.`);
    } catch (error) {
      console.error("❌ Error transferring orders:", error);
      setStatus("error");
      setMessage("❌ Failed to transfer orders. See console for details.");
    }
  };

  return (
    <div className="p-6 max-w-xl mx-auto bg-white border rounded shadow">
      <h2 className="text-xl font-bold mb-4 text-gray-800">
        Copy <code>orderMaster</code> to <code>orderMasterDummy</code>
      </h2>

      <button
        onClick={handleTransfer}
        disabled={status === "loading"}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        {status === "loading" ? "Transferring..." : "Start Transfer"}
      </button>

      {message && (
        <p className="mt-4 text-gray-700 font-medium">{message}</p>
      )}
    </div>
  );
}
