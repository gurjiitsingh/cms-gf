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
  marketingConsent: boolean;
}


export async function getInactiveCustomers_w(days: number): Promise<InactiveCustomer[]> {
  const now = new Date();
  const cutoffDate = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);  // Calculate the cutoff date
  console.log("Cutoff Date:", cutoffDate.toISOString());  // Log cutoff date for debugging

  const customersRef = collection(db, "marketingData1");
  const querySnapshot = await getDocs(customersRef);  // Fetch all customers

  const inactiveCustomers = querySnapshot.docs
    .map((doc) => {
      const data = doc.data();
      const updatedAtRaw = data.updatedAt;

      // Convert 'updatedAt' from Firestore Timestamp to Date and then to ISO string
      let updatedAt: string;
      if (updatedAtRaw && typeof updatedAtRaw.toDate === "function") {
        updatedAt = updatedAtRaw.toDate().toISOString();  // Convert to ISO string
      } else {
        updatedAt = new Date(0).toISOString();  // Fallback to 1970 if it's invalid or missing
      }

      // Convert 'lastOrderDate' from Firestore Timestamp to Date and then to ISO string
      let lastOrderDate: string;
      if (data.lastOrderDate && typeof data.lastOrderDate.toDate === "function") {
        lastOrderDate = data.lastOrderDate.toDate().toISOString();  // Convert to ISO string
      } else {
        lastOrderDate = new Date(0).toISOString();  // Fallback to 1970 if it's invalid or missing
      }

      return {
        id: doc.id,
        ...data,
        updatedAt,         // Use ISO string for 'updatedAt'
        lastOrderDate,     // Use ISO string for 'lastOrderDate'
      };
    })
    .filter((customer) => {
      const updatedAt = new Date(customer.updatedAt);
      console.log("Comparing:", updatedAt.toISOString(), "with", cutoffDate.toISOString());

      // Only include customers whose updatedAt is older than the cutoff date
      return updatedAt < cutoffDate;
    });

  

  return inactiveCustomers;
}


export async function getInactiveCustomers1(days: number): Promise<InactiveCustomer[]> {
  const now = new Date();
  const cutoffDate = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);  // Calculate the cutoff date
  console.log("Cutoff Date:", cutoffDate.toISOString());  // Log cutoff date for debugging

  const customersRef = collection(db, "marketingData1");
  const querySnapshot = await getDocs(customersRef);  // Fetch all customers

  const inactiveCustomers = querySnapshot.docs
    .map((doc) => {
      const data = doc.data();
      const updatedAtRaw = data.updatedAt;

      // Log the raw 'updatedAt' value
      console.log(`Customer ${doc.id} - raw updatedAt:`, updatedAtRaw);

      // Ensure 'updatedAt' is a valid Date object
      let updatedAt: Date;
      if (updatedAtRaw && typeof updatedAtRaw.toDate === "function") {
        updatedAt = updatedAtRaw.toDate();  // Convert Firestore Timestamp to Date object
      } else {
        updatedAt = new Date(0);  // Fallback to 1970 if it's invalid or missing
      }

      console.log(`Customer ${doc.id} - updatedAt after conversion:`, updatedAt.toISOString());

      return {
        id: doc.id,
        ...data,
        updatedAt: updatedAt.toISOString(),  // Return updatedAt as ISO string
      };
    })
    .filter((customer) => {
      const updatedAt = new Date(customer.updatedAt);
      console.log("Comparing:", updatedAt.toISOString(), "with", cutoffDate.toISOString());

      // Only include customers whose updatedAt is older than the cutoff date
      return updatedAt < cutoffDate;
    });

  console.log("Inactive customers:", inactiveCustomers.map((c) => c.name));  // Log inactive customers' names for debugging

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

