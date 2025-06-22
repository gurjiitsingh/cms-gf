'use client';

import { useState } from 'react';
import { db } from '@/lib/firebaseConfig';
import {
  collection,
  getDocs,
  addDoc,
  Timestamp,
} from 'firebase/firestore';

export default function RestoreOrderMasterFromDummy() {
  const [status, setStatus] = useState<'idle' | 'loading' | 'done' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleRestore = async () => {
    setStatus('loading');
    setMessage('');

    try {
      const snapshot = await getDocs(collection(db, 'orderMasterDummy'));
      if (snapshot.empty) {
        setMessage('No documents found in orderMasterDummy.');
        setStatus('done');
        return;
      }

      let count = 0;

      for (const doc of snapshot.docs) {
        const data = doc.data();

        // Use createdAtA from Dummy as the new createdAt
        const createdAt = data.createdAtA instanceof Timestamp
          ? data.createdAtA
          : Timestamp.now();

        // Remove createdAtA before saving
        const { createdAtA, ...rest } = data;

        await addDoc(collection(db, 'orderMaster'), {
          ...rest,
          createdAt, // Override with createdAtA
        });

        count++;
      }

      setStatus('done');
      setMessage(`✅ Restored ${count} record(s) to orderMaster with updated createdAt.`);
    } catch (err) {
      console.error('❌ Error restoring records:', err);
      setStatus('error');
      setMessage('❌ Failed to restore. Check console for details.');
    }
  };

  return (
    <div className="p-6 max-w-xl mx-auto bg-white border rounded shadow">
      <h2 className="text-xl font-bold mb-4 text-gray-800">
        Restore <code>orderMaster</code> from <code>orderMasterDummy</code>
      </h2>

      <button
        onClick={handleRestore}
        disabled={status === 'loading'}
        className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
      >
        {status === 'loading' ? 'Restoring...' : 'Start Restore'}
      </button>

      {message && (
        <p className="mt-4 text-gray-700 font-medium">{message}</p>
      )}
    </div>
  );
}
