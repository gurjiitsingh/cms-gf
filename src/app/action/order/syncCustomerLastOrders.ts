// app/_actions/order.ts

"use server";

import { db } from "@/lib/firebaseConfig";
import { orderMasterDataT } from "@/lib/types/orderMasterType";
import { TuserSchem } from "@/lib/types/userType";
import {
  collection,
  getDocs,
  query,
  orderBy,
  doc,
  setDoc,
  getDoc,
} from "firebase/firestore";

type CustomerLastOrderT = {
  customerId: string;
  addressId:string;
  name: string;
  orderDate: string;
  noOfferEmails:boolean;
  email?: string;
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
      const addressId = order.userId;

      if (!customerMap.has(addressId)) {
      
const { email, userId } = await getUserEmailAndUserId(addressId);
        customerMap.set(addressId, {
          customerId: userId || "",
          email: email || "",
          name: order.customerName,
          addressId:addressId || "",
          noOfferEmails: false,
          orderDate: order.time,
          
        });
      }
    }

    // 🔁 UPDATED collection name here
    const recentOrderCollection = collection(db, "customerRecentOrderDummy");

    for (const lastOrder of customerMap.values()) {
      await setDoc(doc(recentOrderCollection, lastOrder.customerId), lastOrder);
    }

    console.log("✅ customerRecentOrder collection updated.");
  } catch (error) {
    console.error("❌ Failed to sync customer recent orders:", error);
    throw error;
  }
}

export async function getUserEmailAndUserId(addressId: string): Promise<{ email: string | null; userId: string | null }> {
  try {
    const ref = doc(db, "address", addressId); // Fetch document directly by addressId
    const snapshot = await getDoc(ref);

    if (snapshot.exists()) {
      const userData = snapshot.data() as TuserSchem;
      return {
        email: userData.email || null,
        userId: userData.userId || null,
      };
    } else {
      return { email: null, userId: null };
    }
  } catch (err) {
    console.error(`Error fetching user data for addressId: ${addressId}`, err);
    return { email: null, userId: null };
  }
}



// export async function getUserEmailAndUserId(addressId: string): Promise<string | null> {
//   try {
//     const ref = doc(db, "address", addressId); // Fetch document directly by ID
//     const snapshot = await getDoc(ref);

//     if (snapshot.exists()) {
//       const userData = snapshot.data() as TuserSchem;
//       return userData.email || null;
//     } else {
//       return null;
//     }
//   } catch (err) {
//     console.error(`Error fetching user email for userId: ${addressId}`, err);
//     return null;
//   }
// }



