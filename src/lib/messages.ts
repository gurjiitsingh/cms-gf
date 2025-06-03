import { db } from "@/lib/firebaseConfig"; // your Firestore instance
import { collection, addDoc, Timestamp } from "firebase/firestore";

export async function saveMarketingMessage(message: string) {
  const messagesRef = collection(db, "marketingMessages");

  await addDoc(messagesRef, {
    message,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  });
}
