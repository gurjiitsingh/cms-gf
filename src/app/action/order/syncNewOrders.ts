// app/_actions/order/syncNewOrders.ts

"use server";

import { db } from "@/lib/firebaseConfig";
import { orderMasterDataT } from "@/lib/types/orderMasterType";
import { TuserSchem } from "@/lib/types/userType";
import {
  collection,
  getDocs,
  query,
  orderBy,
  setDoc,
  doc,
  where,
} from "firebase/firestore";

export async function syncNewOrders() {
  try {
    const snapshot = await getDocs(
      query(collection(db, "orderMaster"), orderBy("srno", "desc"))
    );

   const orders = snapshot.docs.map((doc) => {
  const data = doc.data() as orderMasterDataT;
  return {
    ...data,
    id: doc.id, // ✅ overwrite after spreading to ensure it's your value
  };
});

    for (const order of orders) {
      const email = await fetchUserEmail(order.userId);

      const newOrderData = {
        ...order,
        email: email || "",
      };

      await setDoc(doc(db, "newOrder", order.id), newOrderData);
    }

    console.log("✅ newOrder collection synced successfully.");
  } catch (error) {
    console.error("❌ Failed to sync newOrder:", error);
    throw error;
  }
}

async function fetchUserEmail(id: string): Promise<string | null> {
  try {
    if (!id) return null;

    const q = query(collection(db, "user"), where("userId", "==", id));
    const querySnapshot = await getDocs(q);

    for (const doc of querySnapshot.docs) {
      const data = doc.data() as TuserSchem;
      return data.email || null;
    }

    return null;
  } catch (err) {
    console.error(`❌ Error fetching user email for userId=${id}:`, err);
    return null;
  }
}
