'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function MailingListsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [mailingLists, setMailingLists] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [showMenuFor, setShowMenuFor] = useState<string | null>(null);

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
      if (!res.ok) {
        setError(data.error || 'Unknown error');
        return;
      }

      setMailingLists(data.mailingLists || []);
    } catch (err: any) {
      setError('Network error');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteList = async (listkey: string) => {
    const confirmDelete = confirm('Are you sure you want to delete this mailing list?');
    if (!confirmDelete) return;

    try {
      const res = await fetch('/api/zoho/lists/delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ listkey }),
      });

      const result = await res.json();
      if (result.status === 'success') {
        alert('✅ List deleted successfully');
        router.push('/lists/view-lists'); // ⬅ redirect after deletion
      } else {
        alert('❌ Failed to delete list: ' + (result.message || 'Unknown error'));
      }
    } catch (err) {
      console.error(err);
      alert('❌ Error deleting list');
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-700">Mailing Lists</h1>
        <Link
          href="/lists/create-list"
          className="bg-orange-500 hover:bg-orange-600 text-white font-medium px-4 py-2 rounded shadow"
        >
          Create List
        </Link>
      </div>

      {error && <div className="text-red-600 text-center mb-4 font-medium">{error}</div>}
      {loading ? (
        <p className="text-center text-gray-500">Loading mailing lists...</p>
      ) : mailingLists.length > 0 ? (
        <ul className="divide-y border rounded-lg bg-white shadow-sm">
          {mailingLists.map((list: any) => (
            <li
              key={list.listkey}
              className="flex justify-between items-center p-4 hover:bg-gray-50 relative"
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

              <div className="relative">
                <div
                  className="text-sm text-gray-400 hover:text-gray-600 cursor-pointer"
                  onClick={() =>
                    setShowMenuFor(showMenuFor === list.listkey ? null : list.listkey)
                  }
                >
                  •••
                </div>

                {showMenuFor === list.listkey && (
                  <div className="absolute right-0 mt-2 bg-white border rounded shadow w-36 z-10">
                    <button
                      onClick={() => handleDeleteList(list.listkey)}
                      className="w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100"
                    >
                      Delete List
                    </button>
                  </div>
                )}
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
