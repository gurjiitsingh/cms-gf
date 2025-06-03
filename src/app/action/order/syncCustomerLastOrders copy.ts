// app/_actions/order.ts (must NOT be in a "use client" module)

"use server";

import { db } from "@/lib/firebaseConfig";
import { orderMasterDataT } from "@/lib/types/orderMasterType";
import {
  collection,
  getDocs,
  query,
  orderBy,
  doc,
  setDoc,
} from "firebase/firestore";


type CustomerLastOrderT = {
  customerId: string;
  name: string;
  orderDate: string;
};

export async function syncCustomerLastOrders() {
  try {
    const snapshot = await getDocs(
      query(collection(db, "orderMaster"), orderBy("srno", "desc"))
    );

    const allOrders = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as orderMasterDataT[];

    const customerMap = new Map<string, CustomerLastOrderT>();

    for (const order of allOrders) {
      if (!customerMap.has(order.userId)) {
        customerMap.set(order.userId, {
          customerId: order.userId,
          name: order.customerName,
          orderDate: order.time,
        });
      }
    }

    const lastOrderCollection = collection(db, "CustomerLastOrder");

    for (const lastOrder of customerMap.values()) {
      await setDoc(doc(lastOrderCollection, lastOrder.customerId), lastOrder);
    }

    console.log("✅ CustomerLastOrder collection updated.");
  } catch (error) {
    console.error("❌ Failed to sync customer last orders:", error);
    throw error;
  }
}
