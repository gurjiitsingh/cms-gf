'use client';

import { useState } from 'react';

export default function MailingListsPage() {
  const [loading, setLoading] = useState(false);
  const [mailingLists, setMailingLists] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handleFetchLists = async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/zoho/getLists', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({}),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Unknown error');
        console.error("❌ API Error:", data.details);
        return;
      }

      console.log("✅ Mailing Lists:", data.mailingLists);
      setMailingLists(data.mailingLists || []);
    } catch (err: any) {
      setError("Network error");
      console.error("❌ Fetch error:", err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center text-blue-800">
        📧 Zoho Mailing Lists
      </h1>

      <div className="text-center mb-6">
        <button
          onClick={handleFetchLists}
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-2 rounded shadow"
        >
          {loading ? 'Fetching...' : 'Fetch Mailing Lists'}
        </button>
      </div>

      {error && (
        <div className="text-red-600 text-center mb-4 font-medium">{error}</div>
      )}

      {mailingLists.length > 0 && (
        <div className="grid md:grid-cols-2 gap-6">
          {mailingLists.map((list, index) => (
            <div
              key={index}
              className="border rounded-lg bg-white shadow-sm p-4 hover:shadow-md transition"
            >
              <h2 className="text-xl font-semibold text-gray-800 mb-2">
                {list.listname || 'Untitled List'}
              </h2>

              <p className="text-sm text-gray-600 mb-1">
                <strong>📅 Created On:</strong> {list.list_created_date}
              </p>
              <p className="text-sm text-gray-600 mb-1">
                <strong>👥 Contacts:</strong> {list.noofcontacts}
              </p>
              <p className="text-sm text-gray-600 mb-1">
                <strong>🔑 List Key:</strong> {list.listkey}
              </p>
              <p className="text-sm text-gray-600 mb-1">
                <strong>📖 Description:</strong>{' '}
                {list.listdesc && list.listdesc !== 'undefined'
                  ? list.listdesc
                  : '—'}
              </p>
              <p className="text-sm text-gray-600 mb-1">
                <strong>👤 Owner:</strong> {list.owner}
              </p>
              <p className="text-sm text-gray-600">
                <strong>🔓 Public:</strong>{' '}
                {list.is_public === 'true' ? 'Yes' : 'No'}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
