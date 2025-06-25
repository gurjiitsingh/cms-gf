'use client';

import { useEffect, useState } from 'react';
import { db } from '@/lib/firebaseConfig';
import { collection, getDocs } from 'firebase/firestore';

type User = {
  username?: string;
  email?: string;
  time?: string;
  createdAt?: string;
  id: string;
};

export default function UserList() {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [emailsPerFile, setEmailsPerFile] = useState(100);

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const querySnapshot = await getDocs(collection(db, 'user'));
        const usersData: User[] = querySnapshot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        })) as User[];

        const sorted = usersData.sort((a, b) => {
          const dateA = new Date(a.time || '').getTime();
          const dateB = new Date(b.time || '').getTime();
          return dateB - dateA; // most recent first
        });

        setUsers(sorted);
        setFilteredUsers(sorted);
      } catch (err) {
        console.error('Error fetching users:', err);
        setError('Failed to load users.');
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  useEffect(() => {
    if (!selectedDate) {
      setFilteredUsers(users);
      return;
    }

    const targetDate = new Date(selectedDate).toDateString();
    const matched = users.filter((user) => {
      const userDate = new Date(user.time || '').toDateString();
      return userDate === targetDate;
    });

    setFilteredUsers(matched);
  }, [selectedDate, users]);

  const downloadEmailsAsCsvChunks = () => {
    const emails = filteredUsers
      .map((u) => u.email)
      .filter((email) => email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email));

    const chunkSize = emailsPerFile || 100;
    const totalChunks = Math.ceil(emails.length / chunkSize);

    for (let i = 0; i < totalChunks; i++) {
      const chunk = emails.slice(i * chunkSize, (i + 1) * chunkSize);
      const csvContent = chunk.join('\n');
      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);

      const a = document.createElement('a');
      a.href = url;
      a.download = `ml-${i + 1}.csv`;
      a.click();

      URL.revokeObjectURL(url);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white border rounded-lg shadow">
      {/* Header and filter */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-4">
        <h2 className="text-2xl font-semibold text-gray-800">
          👥 All Users ({filteredUsers.length})
        </h2>

        <div className="flex gap-4 flex-wrap items-center">
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Filter by Date:
            </label>
            <input
              type="date"
              className="border px-3 py-1 rounded-md"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Emails per file:
            </label>
            <input
              type="number"
              min={1}
              value={emailsPerFile}
              onChange={(e) => setEmailsPerFile(parseInt(e.target.value) || 1)}
              className="border px-3 py-1 rounded-md w-24"
            />
          </div>

          <button
            onClick={downloadEmailsAsCsvChunks}
            className="bg-orange-500 text-white px-4 py-2 mt-5 sm:mt-0 rounded hover:bg-orange-600"
          >
            Download Email CSVs
          </button>
        </div>
      </div>

      {loading && <p className="text-gray-500">Loading users...</p>}
      {error && <p className="text-red-600">{error}</p>}
      {!loading && filteredUsers.length === 0 && (
        <p>No users found for selected date.</p>
      )}

      {/* Table */}
      {!loading && filteredUsers.length > 0 && (
        <>
          <div className="overflow-x-auto mb-6">
            <table className="w-full text-left border">
              <thead>
                <tr className="bg-gray-100 text-gray-700">
                  <th className="py-2 px-4 border">#</th>
                  <th className="py-2 px-4 border">Document ID</th>
                  <th className="py-2 px-4 border">Name</th>
                  <th className="py-2 px-4 border">Email</th>
                  <th className="py-2 px-4 border">Registered At</th>
                  <th className="py-2 px-4 border">Created At</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user, index) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="py-2 px-4 border">{index + 1}</td>
                    <td className="py-2 px-4 border font-mono text-xs">
                      {user.id}
                    </td>
                    <td className="py-2 px-4 border">
                      {user.username || '—'}
                    </td>
                    <td className="py-2 px-4 border">{user.email || '—'}</td>
                    <td className="py-2 px-4 border text-sm">
                      {user.time || '—'}
                    </td>
                    <td className="py-2 px-4 border text-sm">
                      {user.createdAt || '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Emails textarea */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              All Emails:
            </label>
            <textarea
              readOnly
              rows={10}
              className="w-full border rounded px-3 py-2 font-mono text-sm bg-gray-50"
              value={filteredUsers
                .map((user) => user.email)
                .filter(Boolean)
                .join('\n')}
            />
          </div>
        </>
      )}
    </div>
  );
}
