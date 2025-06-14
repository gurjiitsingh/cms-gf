'use client';

import React, { useEffect, useState } from 'react';

export default function SentDataPage() {
  const [emails, setEmails] = useState<string[]>([]);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [nextPageUrl, setNextPageUrl] = useState<string | null>(null);

  const fetchEmails = async (url = '/api/mailgun/sent-list') => {
    setLoading(true);
    try {
      const res = await fetch(url);
      const data = await res.json();
      setEmails((prev) => [...prev, ...data.emails]);
      setCount((prev) => prev + (data.count || 0));
      setNextPageUrl(data.nextPageUrl || null);
    } catch (error) {
      console.error('Failed to load emails:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmails();
  }, []);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">📬 Sent Emails ({count})</h1>
      <div className="bg-white shadow rounded-lg p-4 border">
        {emails.length === 0 && !loading && (
          <p className="text-red-500">No emails found.</p>
        )}
        <ul className="list-decimal list-inside space-y-1 text-sm text-gray-800 max-h-[70vh] overflow-y-auto">
          {emails.map((email, index) => (
            <li key={index}>{email}</li>
          ))}
        </ul>
        {nextPageUrl && (
          <button
            onClick={() =>
              fetchEmails(`/api/mailgun/sent-list?pageUrl=${encodeURIComponent(nextPageUrl)}`)
            }
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            disabled={loading}
          >
            {loading ? 'Loading…' : 'Load More'}
          </button>
        )}
      </div>
    </div>
  );
}
