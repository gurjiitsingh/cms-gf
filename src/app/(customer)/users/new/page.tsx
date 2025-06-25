"use client";

import { useEffect, useState } from "react";
import { db } from "@/lib/firebaseConfig";
import { collection, getDocs } from "firebase/firestore";

type User = {
  username?: string;
  email?: string;
  time?: string;
  id: string;
};

export default function UserList() {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedDate, setSelectedDate] = useState("");

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const querySnapshot = await getDocs(collection(db, "user"));
        const usersData: User[] = querySnapshot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        })) as User[];

        const sorted = usersData.sort((a, b) => {
          const dateA = new Date(a.time || "").getTime();
          const dateB = new Date(b.time || "").getTime();
          return dateB - dateA; // most recent first
        });

        setUsers(sorted);
        setFilteredUsers(sorted);
      } catch (err) {
        console.error("Error fetching users:", err);
        setError("Failed to load users.");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // Filter users when selectedDate changes
  useEffect(() => {
    if (!selectedDate) {
      setFilteredUsers(users);
      return;
    }

    const targetDate = new Date(selectedDate).toDateString(); // Normalize to day only
    const matched = users.filter((user) => {
      const userDate = new Date(user.time || "").toDateString();
      return userDate === targetDate;
    });

    setFilteredUsers(matched);
  }, [selectedDate, users]);

  return (
    <div className="max-w-5xl mx-auto p-6 bg-white border rounded-lg shadow">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-4">
        <h2 className="text-2xl font-semibold text-gray-800">👥 All Users ({filteredUsers.length})</h2>

        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">Filter by Registration Date:</label>
          <input
            type="date"
            className="border px-3 py-1 rounded-md"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
          />
        </div>
      </div>

      {loading && <p className="text-gray-500">Loading users...</p>}
      {error && <p className="text-red-600">{error}</p>}

      {!loading && filteredUsers.length === 0 && <p>No users found for selected date.</p>}

      {!loading && filteredUsers.length > 0 && (
        <div className="overflow-x-auto">
          <table className="w-full text-left border">
            <thead>
              <tr className="bg-gray-100 text-gray-700">
                <th className="py-2 px-4 border">#</th>
                <th className="py-2 px-4 border">Document ID</th>
                <th className="py-2 px-4 border">Name</th>
                <th className="py-2 px-4 border">Email</th>
                <th className="py-2 px-4 border">Registered At</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user, index) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="py-2 px-4 border">{index + 1}</td>
                  <td className="py-2 px-4 border font-mono text-xs">{user.id}</td>
                  <td className="py-2 px-4 border">{user.username || "—"}</td>
                  <td className="py-2 px-4 border">{user.email || "—"}</td>
                  <td className="py-2 px-4 border text-sm">{user.time || "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
