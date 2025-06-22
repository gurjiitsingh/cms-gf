'use client';

import { useEffect, useState } from 'react';

type OpenedEmail = {
  email: string;
  event: string;
  date: string;
  messageId: string;
  ip?: string;
  country?: string;
};

export default function OpenedEmailsList() {
  const [openedEmails, setOpenedEmails] = useState<OpenedEmail[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOpenedEmails = async () => {
      try {
        const res = await fetch('/api/getOpenedEmails');
        const data = await res.json();
        setOpenedEmails(data.openedEmails || []);
      } catch (error) {
        console.error('Failed to fetch opened emails:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOpenedEmails();
  }, []);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold text-blue-700 mb-4">Opened Emails</h2>
      {loading ? (
        <p>Loading...</p>
      ) : openedEmails.length === 0 ? (
        <p>No opened emails found.</p>
      ) : (
        <table className="min-w-full border border-gray-300 text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 border">Email</th>
              <th className="px-4 py-2 border">Opened At</th>
              <th className="px-4 py-2 border">Country</th>
              <th className="px-4 py-2 border">IP</th>
            </tr>
          </thead>
          <tbody>
            {openedEmails.map((e, index) => (
              <tr key={index} className="hover:bg-gray-50">
                <td className="px-4 py-2 border">{e.email}</td>
                <td className="px-4 py-2 border">{new Date(e.date).toLocaleString('en-IN')}</td>
                <td className="px-4 py-2 border">{e.country ?? '-'}</td>
                <td className="px-4 py-2 border">{e.ip ?? '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
