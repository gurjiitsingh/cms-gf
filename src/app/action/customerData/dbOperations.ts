"use server";

import { db } from "@/lib/firebaseConfig";

import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  updateDoc,
  where,
  getFirestore,
  orderBy,
  limit,
  Timestamp,
  setDoc
} from "@firebase/firestore";


import { subDays } from "date-fns";



export interface InactiveCustomer {
  id: string;
  name: string;
  email: string;
  userId: string;
  lastOrderDate: string | null;
  updatedAt: string | null;
 noOfferEmails: boolean;
}


export async function getInactiveCustomers_w(days: number): Promise<InactiveCustomer[]> {
  const now = new Date();
  const cutoffDate = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);
  console.log("Cutoff Date:", cutoffDate.toISOString());

  const customersRef = collection(db, "marketingData1");
  const querySnapshot = await getDocs(customersRef);

  const inactiveCustomers: InactiveCustomer[] = querySnapshot.docs
    .map((doc) => {
      const data = doc.data();

      const updatedAt = data.updatedAt?.toDate?.().toISOString() ?? new Date(0).toISOString();
      const lastOrderDate = data.lastOrderDate?.toDate?.().toISOString() ?? new Date(0).toISOString();

      return {
        id: doc.id,
        name: data.name ?? "",
        email: data.email ?? "",
        userId: data.userId ?? "",
        marketingConsent: data.marketingConsent ?? false,
        noOfferEmails: data.noOfferEmails ?? false,
        updatedAt,
        lastOrderDate,
      };
    })
    .filter((customer) => {
      const updatedAt = new Date(customer.updatedAt);
      console.log("Comparing:", updatedAt.toISOString(), "with", cutoffDate.toISOString());
      return updatedAt < cutoffDate;
    });

  return inactiveCustomers;
}



export async function getInactiveCustomers1(days: number): Promise<InactiveCustomer[]> {
  const now = new Date();
  const cutoffDate = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);
  console.log("Cutoff Date:", cutoffDate.toISOString());

  const customersRef = collection(db, "marketingData1");
  const querySnapshot = await getDocs(customersRef);

  const inactiveCustomers: InactiveCustomer[] = querySnapshot.docs
    .map((doc) => {
      const data = doc.data();
      const updatedAtRaw = data.updatedAt;
      const lastOrderDateRaw = data.lastOrderDate;

      console.log(`Customer ${doc.id} - raw updatedAt:`, updatedAtRaw);

      // Safe date conversion
      const updatedAt = updatedAtRaw?.toDate?.().toISOString() ?? new Date(0).toISOString();
      const lastOrderDate = lastOrderDateRaw?.toDate?.().toISOString() ?? new Date(0).toISOString();

      return {
        id: doc.id,
        name: data.name ?? "",
        email: data.email ?? "",
        userId: data.userId ?? "",
        // marketingConsent: data.marketingConsent ?? false,
        noOfferEmails: data.noOfferEmails ?? false, // ✅ required field
        updatedAt,
        lastOrderDate,
      };
    })
    .filter((customer) => {
      const updatedAt = new Date(customer.updatedAt);
      console.log("Comparing:", updatedAt.toISOString(), "with", cutoffDate.toISOString());
      return updatedAt < cutoffDate;
    });

  return inactiveCustomers;
}










// export type InactiveCustomer = {
//   id: string;
//   name: string;
//   email: string;
//   userId: string;
//   noOfferEmails?: boolean;
//   lastOrderDate?: string; // plain string format
//   updatedAt?: string; // plain string format
// };

export async function getInactiveCustomers(days: number): Promise<InactiveCustomer[]> {
  const now = new Date();
  const cutoffDateJS = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);

  const cutoffDate = Timestamp.fromDate(cutoffDateJS);
 //marketingData
  const customersRef = collection(db, "customerRecentOrder");
  const q = query(customersRef, where("lastOrderDate", "<", cutoffDate));
  const querySnapshot = await getDocs(q);

  const inactiveCustomers: InactiveCustomer[] = querySnapshot.docs.map(doc => {
    const data = doc.data();
   
    return {
      id: doc.id,
      name: data.name,
      email: data.email,
      userId: data.userId,
      noOfferEmails: data.noOfferEmails,
      lastOrderDate: data.lastOrderDate?.toDate().toISOString(), // convert Timestamp to ISO string
      updatedAt: data.updatedAt?.toDate().toISOString(), // convert Timestamp to ISO string
    };
  });
 

  return inactiveCustomers;
}


export async function getInactiveCustomers_working(days: number): Promise<InactiveCustomer[]> {
  const now = new Date();
  const cutoffDateJS = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);
  console.log("cutoffDateJS----------", cutoffDateJS);

  const cutoffDate = Timestamp.fromDate(cutoffDateJS);
  console.log("cutoffDate ---------", cutoffDate);

  const customersRef = collection(db, "marketingData");
  const q = query(customersRef, where("updatedAt", ">", cutoffDate));

  const querySnapshot = await getDocs(q);

  const inactiveCustomers: InactiveCustomer[] = querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
  })) as InactiveCustomer[];

  console.log("inacitvecustomer---------", inactiveCustomers);
  return inactiveCustomers;

}

