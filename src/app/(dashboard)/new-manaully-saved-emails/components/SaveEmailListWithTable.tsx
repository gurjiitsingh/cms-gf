'use client';

import { useState, useEffect } from 'react';
import {
  collection,
  getDocs,
  addDoc,
  query,
  orderBy,
  limit,
  startAfter,
  deleteDoc,
  doc,
  DocumentData,
} from 'firebase/firestore';
import { db } from '@/lib/firebaseConfig';

const PAGE_SIZE = 10;

const SaveEmailListWithTable = () => {
  const [emailText, setEmailText] = useState('');
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<string | null>(null);
  const [emails, setEmails] = useState<DocumentData[]>([]);
  const [lastDoc, setLastDoc] = useState<any>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchEmails = async (pageNumber: number) => {
    const baseQuery = query(
      collection(db, 'manuallySavedEmails'),
      orderBy('createdAt', 'desc'),
      limit(PAGE_SIZE)
    );

    const finalQuery =
      pageNumber === 1
        ? baseQuery
        : query(baseQuery, startAfter(lastDoc));

    const snapshot = await getDocs(finalQuery);
    const docs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    setEmails(docs);
    setLastDoc(snapshot.docs[snapshot.docs.length - 1] || null);
    setHasMore(snapshot.docs.length === PAGE_SIZE);
  };

  useEffect(() => {
    fetchEmails(1);
  }, []);

  const handleNext = async () => {
    if (hasMore) {
      const newPage = page + 1;
      await fetchEmails(newPage);
      setPage(newPage);
    }
  };

  const handlePrevious = async () => {
    if (page > 1) {
      const newPage = page - 1;
      setPage(newPage);
      await fetchEmails(1); // re-fetch from start
    }
  };

  const handleSaveEmails = async () => {
    const rawEmails = emailText
      .split(/[\n,]+/)
      .map(e => e.trim().toLowerCase())
      .filter(e => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e));

    if (rawEmails.length === 0) {
      setStatus('⚠️ Please enter valid emails.');
      return;
    }

    setSaving(true);
    setStatus(null);

    try {
      const snapshot = await getDocs(collection(db, 'manuallySavedEmails'));
      const existingEmails = snapshot.docs.map(doc => doc.data()?.email?.toLowerCase());

      const uniqueNewEmails = rawEmails.filter(email => !existingEmails.includes(email));

      const batch = uniqueNewEmails.map(email =>
        addDoc(collection(db, 'manuallySavedEmails'), {
          email,
          createdAt: new Date().toISOString(),
        })
      );

      await Promise.all(batch);

      setStatus(`✅ Saved ${uniqueNewEmails.length} new email(s).`);
      setEmailText('');
      fetchEmails(1);
      setPage(1);
    } catch (error) {
      console.error('Error saving emails:', error);
      setStatus('❌ Failed to save emails.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string, email: string) => {
    const confirmDelete = window.confirm(`Are you sure you want to delete "${email}"?`);
    if (!confirmDelete) return;

    setDeletingId(id);
    setStatus(null);

    try {
      await deleteDoc(doc(db, 'manuallySavedEmails', id));
      setStatus(`✅ Deleted email "${email}".`);
      // Refresh list after delete
      fetchEmails(1);
      setPage(1);
    } catch (error) {
      console.error('Error deleting email:', error);
      setStatus('❌ Failed to delete email.');
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="my-6 max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Save Emails to DB</h2>

      <textarea
        value={emailText}
        onChange={(e) => setEmailText(e.target.value)}
        placeholder="Enter emails separated by commas or new lines"
        rows={5}
        className="w-full border border-gray-300 rounded p-3 text-sm"
      />

      <button
        onClick={handleSaveEmails}
        disabled={saving || emailText.trim() === ''}
        className={`mt-3 px-5 py-2 rounded text-white transition ${
          saving || emailText.trim() === ''
            ? 'bg-gray-400 cursor-not-allowed'
            : 'bg-indigo-600 hover:bg-indigo-700'
        }`}
      >
        {saving ? 'Saving...' : 'Save Email List to DB'}
      </button>

      {status && <p className="mt-2 text-sm text-gray-700">{status}</p>}

      <div className="mt-8">
        <h3 className="text-xl font-semibold mb-3">Saved Emails</h3>
        <div className="overflow-x-auto border rounded">
          <table className="w-full text-sm text-left text-gray-700">
            <thead className="bg-gray-100 text-xs uppercase text-gray-600">
              <tr>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Saved At</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {emails.map((email) => (
                <tr key={email.id} className="border-t">
                  <td className="px-4 py-2">{email.email}</td>
                  <td className="px-4 py-2">{new Date(email.createdAt).toLocaleString()}</td>
                  <td className="px-4 py-2">
                    <button
                      onClick={() => handleDelete(email.id, email.email)}
                      disabled={deletingId === email.id}
                      className={`px-3 py-1 rounded text-white text-sm transition ${
                        deletingId === email.id
                          ? 'bg-gray-400 cursor-not-allowed'
                          : 'bg-red-600 hover:bg-red-700'
                      }`}
                    >
                      {deletingId === email.id ? 'Deleting...' : 'Delete'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        <div className="flex items-center justify-between mt-4">
          <button
            onClick={handlePrevious}
            disabled={page === 1}
            className="px-4 py-1 bg-gray-200 rounded disabled:opacity-50"
          >
            Previous
          </button>
          <span className="text-sm text-gray-600">Page {page}</span>
          <button
            onClick={handleNext}
            disabled={!hasMore}
            className="px-4 py-1 bg-gray-200 rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default SaveEmailListWithTable;
