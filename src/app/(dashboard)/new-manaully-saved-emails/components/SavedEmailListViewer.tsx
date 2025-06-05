'use client';

import React, { useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebaseConfig';

const SavedEmailListViewer = () => {
  const [showTextarea, setShowTextarea] = useState(false);
  const [emails, setEmails] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const handleFetchSavedEmails = async () => {
    if (showTextarea) {
      setShowTextarea(false);
      return;
    }

    setLoading(true);
    try {
      const snapshot = await getDocs(collection(db, 'manuallySavedEmails'));

      const allEmails: string[] = [];

      snapshot.forEach((doc) => {
        const data = doc.data();
        if (data && typeof data.email === 'string') {
          allEmails.push(data.email.trim().toLowerCase());
        }
      });

      const uniqueEmails = [...new Set(allEmails)];
      setEmails(uniqueEmails);
      setShowTextarea(true);
    } catch (error) {
      console.error('Error fetching saved emails:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="">
      <h4 className="text-lg font-semibold text-gray-800 mb-1">Saved Emails</h4>

      <button
        onClick={handleFetchSavedEmails}
        disabled={loading}
        className={`px-5 py-2 rounded text-white transition font-medium ${
          loading
            ? 'bg-gray-400 cursor-not-allowed'
            : showTextarea
            ? 'bg-orange-500 hover:bg-orange-600'
            : 'bg-gray-400 hover:bg-blue-500'
        }`}
      >
        {loading ? 'Loading...' : showTextarea ? 'Hide Saved Emails' : 'Show Saved Emails'}
      </button>

      {showTextarea && (
        <textarea
          readOnly
          value={emails.join('\n')}
          rows={10}
          className="w-full mt-4 border rounded p-2 bg-gray-100 text-sm text-gray-700"
        />
      )}
    </div>
  );
};

export default SavedEmailListViewer;
