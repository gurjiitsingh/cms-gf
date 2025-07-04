'use client';

import { useEffect, useState } from 'react';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebaseConfig';

type EmailRecord = {
  email: string;
  source?: string;
  createdAt?: { seconds: number };
  unsubscribed?: boolean;
  spam?: boolean;
};

export default function EmailListViewer() {
  const [emails, setEmails] = useState<EmailRecord[]>([]);
  const [filter, setFilter] = useState<'all' | 'regular' | 'unsubscribed' | 'spam'>('all');
  const [loading, setLoading] = useState(true);
  const [showSourceCounts, setShowSourceCounts] = useState(false);
  const [sourceSearch, setSourceSearch] = useState(''); // 🆕 source search

  useEffect(() => {
    const fetchEmails = async () => {
      setLoading(true);
      try {
        const q = query(collection(db, 'campaignEmailListFinal'), orderBy('createdAt', 'desc'));
        const snapshot = await getDocs(q);
        const data: EmailRecord[] = snapshot.docs.map((doc) => doc.data() as EmailRecord);
        setEmails(data);
      } catch (error) {
        console.error('Error fetching emails:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchEmails();
  }, []);

  const filteredEmails = emails.filter((email) => {
    const matchesFilter =
      (filter === 'regular' && !email.unsubscribed && !email.spam) ||
      (filter === 'unsubscribed' && email.unsubscribed) ||
      (filter === 'spam' && email.spam) ||
      filter === 'all';

    const matchesSource = email.source?.toLowerCase().includes(sourceSearch.toLowerCase().trim()) ?? false;

    return matchesFilter && (sourceSearch ? matchesSource : true);
  });

  const sourceCountMap = emails.reduce<Record<string, number>>((acc, email) => {
    const source = email.source || 'unknown';
    acc[source] = (acc[source] || 0) + 1;
    return acc;
  }, {});

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white shadow rounded-lg">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-4">
        <h2 className="text-xl font-bold">📬 Email List</h2>
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value as any)}
            className="border px-3 py-1 rounded"
          >
            <option value="all">All</option>
            <option value="regular">Regular Only</option>
            <option value="unsubscribed">Unsubscribed</option>
            <option value="spam">Spam</option>
          </select>
          <input
            type="text"
            placeholder="Search by source..."
            value={sourceSearch}
            onChange={(e) => setSourceSearch(e.target.value)}
            className="border px-3 py-1 rounded"
          />
          <button
            onClick={() => setShowSourceCounts((prev) => !prev)}
            className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
          >
            {showSourceCounts ? 'Hide Count by Source' : 'Show Count by Source'}
          </button>
        </div>
      </div>

      {showSourceCounts && (
        <div className="mb-4 bg-gray-50 p-4 rounded border">
          <h3 className="font-semibold mb-2">📊 Email Count by Source</h3>
          <ul className="list-disc list-inside text-sm">
            {Object.entries(sourceCountMap).map(([source, count]) => (
              <li key={source}>
                <strong>{source}</strong>: {count}
              </li>
            ))}
          </ul>
        </div>
      )}

      {loading ? (
        <p className="text-gray-500">Loading emails...</p>
      ) : filteredEmails.length === 0 ? (
        <p className="text-gray-600">No emails found for the selected filter.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm border">
            <thead className="bg-gray-100 text-gray-700">
              <tr>
                <th className="px-4 py-2 border">#</th>
                <th className="px-4 py-2 border text-left">Email</th>
                <th className="px-4 py-2 border text-left">Source</th>
                <th className="px-4 py-2 border text-left">Created At</th>
                <th className="px-4 py-2 border text-center">Unsubscribed</th>
                <th className="px-4 py-2 border text-center">Spam</th>
              </tr>
            </thead>
            <tbody>
              {filteredEmails.map((record, idx) => (
                <tr key={record.email + idx} className="hover:bg-gray-50">
                  <td className="px-4 py-2 border text-center">{idx + 1}</td>
                  <td className="px-4 py-2 border">{record.email}</td>
                  <td className="px-4 py-2 border">{record.source || '—'}</td>
                  <td className="px-4 py-2 border">
                    {record.createdAt
                      ? new Date(record.createdAt.seconds * 1000).toLocaleString()
                      : '—'}
                  </td>
                  <td className="px-4 py-2 border text-center">
                    {record.unsubscribed ? '✅' : ''}
                  </td>
                  <td className="px-4 py-2 border text-center">{record.spam ? '🚫' : ''}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
