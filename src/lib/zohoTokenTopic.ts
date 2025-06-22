// lib/zohoTokenTopic.ts
import { db } from "@/lib/firebaseConfig";
import { doc, getDoc, setDoc } from "firebase/firestore";
import axios from "axios";

const client_id = process.env.ZOHO_CLIENT_ID!;
const client_secret = process.env.ZOHO_CLIENT_SECRET!;
const tokenUrl = "https://accounts.zoho.in/oauth/v2/token"; // India DC

// This version is dedicated to tokens that include topic scope
export async function getZohoTopicAccessToken(userId: string): Promise<string | null> {
  const docRef = doc(db, "zoho_topic_tokens", userId);
  const snapshot = await getDoc(docRef);

  if (!snapshot.exists()) return null;

  const data = snapshot.data();
  const now = Date.now();

  // ✅ Return token if still valid
  if (data.expires_at && data.expires_at > now) {
    return data.access_token;
  }

  // 🔄 Refresh token
  const params = new URLSearchParams({
    grant_type: "refresh_token",
    client_id,
    client_secret,
    refresh_token: data.refresh_token,
  });

  try {
    const res = await axios.post(tokenUrl, params, {
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
    });

    const { access_token, expires_in } = res.data;

    await setDoc(docRef, {
      ...data,
      access_token,
      expires_at: now + expires_in * 1000,
      updated_at: now,
    });

    return access_token;
  } catch (err: any) {
    console.error("Topic token refresh failed:", err.response?.data || err.message);
    return null;
  }
}
