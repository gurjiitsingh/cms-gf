'use client';

import { useState } from 'react';
import { collection, getDocs, addDoc } from 'firebase/firestore';
import { db } from '@/lib/firebaseConfig';
import { Timestamp } from 'firebase/firestore';

type OrderMasterT = {
  [key: string]: any;
  createdAt?: Timestamp | string;
};

export default function CopyOrderMasterToBackup() {
  const [status, setStatus] = useState<'idle' | 'loading' | 'done' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleBackup = async () => {
    setStatus('loading');
    setMessage('');

    try {
      const snapshot = await getDocs(collection(db, 'orderMaster'));

      if (snapshot.empty) {
        setMessage('No documents found in orderMaster.');
        setStatus('done');
        return;
      }

      let count = 0;

      for (const doc of snapshot.docs) {
        const data: OrderMasterT = doc.data();

        // Ensure createdAt is in correct format
        const createdAt = data.createdAt instanceof Timestamp
          ? data.createdAt
          : typeof data.createdAt === 'string' && !isNaN(Date.parse(data.createdAt))
            ? Timestamp.fromDate(new Date(data.createdAt))
            : Timestamp.now();

        await addDoc(collection(db, 'orderMasterCopy'), {
          ...data,
          createdAt,
        });

        count++;
      }

      setStatus('done');
      setMessage(`✅ Successfully backed up ${count} records to orderMasterCopy.`);
    } catch (error) {
      console.error('❌ Backup failed:', error);
      setStatus('error');
      setMessage('❌ Failed to backup. See console for details.');
    }
  };

  return (
    <div className="max-w-xl mx-auto bg-white border rounded p-6 shadow">
      <h2 className="text-xl font-bold text-green-700 mb-4">
        Backup orderMaster ➝ orderMasterCopy
      </h2>

      <button
        onClick={handleBackup}
        disabled={status === 'loading'}
        className="bg-green-700 text-white px-4 py-2 rounded hover:bg-green-800"
      >
        {status === 'loading' ? 'Backing up...' : 'Start Backup'}
      </button>

      {message && <p className="mt-4 text-gray-800 font-medium">{message}</p>}
    </div>
  );
}
