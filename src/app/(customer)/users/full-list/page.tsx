"use client";

import { useEffect, useState } from "react";
import { db } from "@/lib/firebaseConfig";
import { collection, getDocs } from "firebase/firestore";

type User = {
  username?: string;
  email?: string;
  id: string; // doc.id
};

export default function UserList() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const querySnapshot = await getDocs(collection(db, "user"));
        const usersData: User[] = querySnapshot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        })) as User[];
        setUsers(usersData);
      } catch (err) {
        console.error("Error fetching users:", err);
        setError("Failed to load users.");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white border rounded-lg shadow">
      <h2 className="text-2xl font-semibold mb-4 text-gray-800">👥 All Users</h2>

      {loading && <p className="text-gray-500">Loading users...</p>}
      {error && <p className="text-red-600">{error}</p>}

      {!loading && users.length === 0 && <p>No users found.</p>}

      {!loading && users.length > 0 && (
        <table className="w-full text-left border">
          <thead>
            <tr className="bg-gray-100 text-gray-700">
              <th className="py-2 px-4 border">#</th>
              <th className="py-2 px-4 border">Document ID</th>
              <th className="py-2 px-4 border">Name</th>
              <th className="py-2 px-4 border">Email</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, index) => (
              <tr key={user.id} className="hover:bg-gray-50">
                <td className="py-2 px-4 border">{index + 1}</td>
                <td className="py-2 px-4 border font-mono text-sm">{user.id}</td>
                <td className="py-2 px-4 border">{user.username || "—"}</td>
                <td className="py-2 px-4 border">{user.email || "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
