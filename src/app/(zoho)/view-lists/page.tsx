'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function MailingListsPage() {
  const [loading, setLoading] = useState(false);
  const [mailingLists, setMailingLists] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Fetch all lists on component mount
  useEffect(() => {
    handleFetchLists();
  }, []);

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
      console.log("data--------",data)

      if (!res.ok) {
        setError(data.error || 'Unknown error');
        console.error("❌ API Error:", data.details);
        return;
      }

      setMailingLists(data.mailingLists || []);
    } catch (err: any) {
      setError("Network error");
      console.error("❌ Fetch error:", err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-700">Zoho Mailing Lists</h1>

        <Link
          href="/create-list"
          className="bg-orange-500 hover:bg-orange-600 text-white font-medium px-4 py-2 rounded shadow"
        >
          Create List
        </Link>
      </div>

      {error && (
        <div className="text-red-600 text-center mb-4 font-medium">{error}</div>
      )}

      {loading ? (
        <p className="text-center text-gray-500">Loading mailing lists...</p>
      ) : mailingLists.length > 0 ? (
        <ul className="divide-y border rounded-lg bg-white shadow-sm">
          {mailingLists.map((list, index) => (
            <li
              key={index}
              className="flex justify-between items-center p-4 hover:bg-gray-50"
            >
              <div>
                <h2 className="text-lg font-semibold text-gray-800">
                  {list.listname || 'Untitled List'}{' '}
                  <span className="font-normal text-gray-500">
                    ({list.noofcontacts})
                  </span>
                </h2>
                <p className="text-sm text-gray-500">
                  Created on: {list.list_created_date}
                </p>
              </div>

              <div className="text-sm text-gray-400 hover:text-gray-600 cursor-pointer">
                •••
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-center text-gray-500">No mailing lists found.</p>
      )}
    </div>
  );
}
