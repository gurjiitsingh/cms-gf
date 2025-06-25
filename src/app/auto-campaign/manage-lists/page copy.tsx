'use client';

import { useEffect, useState } from 'react';
import {
  addDoc,
  collection,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from '@/lib/firebaseConfig';

type EmailList = {
  id: string;
  listName: string;
  emails: string[];
  createdAt: any;
};

export default function EmailListsManager() {
  const [listName, setListName] = useState('');
  const [emailInput, setEmailInput] = useState('');
  const [emailLists, setEmailLists] = useState<EmailList[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchLists = async () => {
    const q = query(collection(db, 'emailLists'), orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    const lists: EmailList[] = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...(doc.data() as Omit<EmailList, 'id'>),
    }));
    setEmailLists(lists);
    setLoading(false);
  };

  useEffect(() => {
    fetchLists();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Normalize input: split by comma or newline, trim, and filter valid emails
    const emails = emailInput
      .split(/[\n,]+/) // split by comma or newline
      .map((e) => e.trim())
      .filter((e) => e.length > 0 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e));

    if (!listName || emails.length === 0) {
      alert('Please enter a list name and at least one valid email.');
      return;
    }

    try {
      await addDoc(collection(db, 'emailLists'), {
        listName,
        emails,
        createdAt: serverTimestamp(),
      });

      setListName('');
      setEmailInput('');
      fetchLists();
    } catch (error) {
      console.error('Error adding email list:', error);
      alert('Failed to add email list.');
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Email Lists Manager</h1>

      <form onSubmit={handleSubmit} className="mb-6 space-y-4">
        <div>
          <label className="block font-medium mb-1">List Name:</label>
          <input
            value={listName}
            onChange={(e) => setListName(e.target.value)}
            className="border rounded w-full px-3 py-2"
            placeholder="e.g. list1"
            required
          />
        </div>

        <div>
          <label className="block font-medium mb-1">
            Emails (comma or newline separated):
          </label>
          <textarea
            value={emailInput}
            onChange={(e) => setEmailInput(e.target.value)}
            className="border rounded w-full px-3 py-2 h-24"
            placeholder={`email1@example.com,\nemail2@example.com`}
            required
          />
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Add List
        </button>
      </form>

      <hr className="my-6" />

      <h2 className="text-xl font-semibold mb-4">Saved Lists</h2>

      {loading ? (
        <p>Loading...</p>
      ) : emailLists.length === 0 ? (
        <p>No email lists found.</p>
      ) : (
        <div className="space-y-6">
          {emailLists.map((list) => (
            <div key={list.id} className="border rounded p-4 bg-gray-50">
              <h3 className="font-bold text-lg">{list.listName}</h3>
              <p className="text-sm text-gray-600">
                {list.emails.length} email{list.emails.length !== 1 && 's'}:
              </p>
              <ul className="list-disc pl-5 mt-2 text-sm text-gray-800">
                {list.emails.map((email, i) => (
                  <li key={i}>{email}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
