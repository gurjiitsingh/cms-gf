'use client';

import React, { useState } from 'react';
import {
  collection,
  query,
  where,
  getDocs,
  writeBatch,
  doc,
} from 'firebase/firestore';
import { db } from '@/lib/firebaseConfig';

type ManualEmailEntryProps = {
  value: string;
  onChange: (val: string) => void;
  visible: boolean;
};

const ManualEmailEntry = ({ value, onChange, visible }: ManualEmailEntryProps) => {
  const [showTextarea, setShowTextarea] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  if (!visible) return null;

  // Helper: Save only unique new emails
  async function saveUniqueEmails(emails: string[]) {
    if (emails.length === 0) return;

    setLoading(true);
    setMessage(null);

    try {
      const emailsToSave: string[] = [];

      for (const email of emails) {
        const q = query(
          collection(db, 'manuallySavedEmails'),
          where('email', '==', email.toLowerCase())
        );
        const snapshot = await getDocs(q);
        if (snapshot.empty) {
          emailsToSave.push(email.toLowerCase());
        }
      }

      if (emailsToSave.length === 0) {
        setMessage('No new unique emails to save.');
        setLoading(false);
        return;
      }

      const batch = writeBatch(db);
      const collectionRef = collection(db, 'manuallySavedEmails');

      emailsToSave.forEach((email) => {
        const newDocRef = doc(collectionRef);
        batch.set(newDocRef, { email });
      });

      await batch.commit();

      setMessage(`Saved ${emailsToSave.length} new emails.`);
    } catch (error) {
      console.error('Error saving emails:', error);
      setMessage('Error saving emails. See console.');
    }

    setLoading(false);
  }

  // Called when textarea loses focus: trigger save
  const handleBlur = () => {
    const emails = value
      .split(/[\n,]+/)
      .map((e) => e.trim())
      .filter((e) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e));

    saveUniqueEmails(emails);
  };

  return (
    <div className="my-8">
      <h4 className="text-xl mb-2 font-semibold text-gray-800">Add Emails Manually</h4>

      <button
        onClick={() => setShowTextarea((prev) => !prev)}
        disabled={loading}
        className={`px-5 py-2 rounded text-white transition font-medium ${
          loading
            ? 'bg-gray-400 cursor-not-allowed'
            : showTextarea
            ? 'bg-orange-500 hover:bg-orange-600'
            : 'bg-gray-400 hover:bg-gray-500'
        }`}
      >
        {loading
          ? 'Saving...'
          : showTextarea
          ? 'Hide Input Box'
          : 'Show Input Box'}
      </button>

      {message && (
        <p className="mt-2 text-sm text-gray-700">{message}</p>
      )}

      {showTextarea && (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onBlur={handleBlur}
          rows={4}
          className="w-full mt-4 border rounded p-2"
          placeholder="Enter emails separated by commas or new lines"
          disabled={loading}
        />
      )}
    </div>
  );
};

export default ManualEmailEntry;
