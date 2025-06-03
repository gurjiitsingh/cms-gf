"use client";

import { useState } from "react";
import { db } from "@/lib/firebaseConfig";
import { doc, getDoc } from "firebase/firestore";

export default function FindUserEmail() {
  const [userId, setUserId] = useState("");
  const [email, setEmail] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleSearch = async () => {
    setEmail(null);
    setErrorMsg("");

    if (!userId.trim()) {
      setErrorMsg("Please enter a document ID.");
      return;
    }

    setLoading(true);

    try {
      const ref = doc(db, "user", userId.trim());
      const snapshot = await getDoc(ref);

      if (snapshot.exists()) {
        const data = snapshot.data();
        setEmail(data.email || "Email not available");
      } else {
        setErrorMsg("No user found with that document ID.");
      }
    } catch (error) {
      console.error("Error fetching user:", error);
      setErrorMsg("Error fetching user. See console for details.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow border">
      <h2 className="text-xl font-bold mb-4 text-gray-800">Find User Email by Document ID</h2>

      <div className="flex gap-2">
        <input
          type="text"
          placeholder="Enter document ID"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
          className="flex-1 border border-gray-300 rounded px-3 py-2 focus:outline-none"
        />
        <button
          onClick={handleSearch}
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          {loading ? "Searching..." : "Find"}
        </button>
      </div>

      {email && (
        <p className="mt-4 text-green-600 font-medium">📧 Email: {email}</p>
      )}
      {errorMsg && (
        <p className="mt-4 text-red-600 font-medium">⚠️ {errorMsg}</p>
      )}
    </div>
  );
}
