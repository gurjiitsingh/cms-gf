'use client';

import { useState } from 'react';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebaseConfig';
import { FiMail } from 'react-icons/fi';
import Link from 'next/link';

export default function EmailListsManager() {
  const [listName, setListName] = useState('');
  const [emailInput, setEmailInput] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const emails = emailInput
      .split(/[\n,]+/)
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
      alert('Email list saved successfully!');
    } catch (error) {
      console.error('Error adding email list:', error);
      alert('Failed to save email list.');
    }
  };

  return (
    <div className="max-w-xl mx-auto px-6 py-8 text-left">
      <h1 className="text-3xl font-bold text-[#016630] mb-6 flex items-center gap-2">
        <FiMail size={28} className="text-[#016630]" />
        Create Email List
      </h1>

      <form
        onSubmit={handleSubmit}
        className="space-y-6 bg-white border border-[#016630]/20 rounded-xl shadow-sm p-6"
      >
        <div>
          <label htmlFor="listName" className="block text-sm font-medium text-gray-700 mb-1">
            List Name
          </label>
          <input
            id="listName"
            type="text"
            value={listName}
            onChange={(e) => setListName(e.target.value)}
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#016630]/60"
            placeholder="e.g. March Newsletter"
            required
          />
        </div>

        <div>
          <label htmlFor="emailInput" className="block text-sm font-medium text-gray-700 mb-1">
            Emails (comma or newline separated)
          </label>
          <textarea
            id="emailInput"
            value={emailInput}
            onChange={(e) => setEmailInput(e.target.value)}
            className="w-full px-4 py-2 border rounded-md h-32 resize-none focus:outline-none focus:ring-2 focus:ring-[#016630]/60"
            placeholder={`email1@example.com,\nemail2@example.com`}
            required
          />
        </div>

        <button
          type="submit"
          className="bg-[#016630] text-white px-5 py-2 rounded-md font-medium hover:bg-[#014e26] transition"
        >
          Save List
        </button>
      </form>
      {/* Back link */}
<div className="mt-4 text-center">
  <Link href="/auto-campaign/manage-lists" className="text-[#016630] hover:underline">
    ← Back to Manage Lists
  </Link>
</div>
    </div>
  );
}
