'use client';

import { useState } from 'react';
import { collection, getDocs, addDoc } from 'firebase/firestore';
import { db } from '@/lib/firebaseConfig';

export default function BackupOrderMasterExact() {
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
        const data = doc.data(); // 🔒 no changes at all
        await addDoc(collection(db, 'orderMasterCopyDito'), data);
        count++;
      }

      setStatus('done');
      setMessage(`✅ Backed up ${count} record(s) to orderMasterCopyDito.`);
    } catch (err) {
      console.error('❌ Backup failed:', err);
      setStatus('error');
      setMessage('❌ Failed to backup. Check console for details.');
    }
  };

  return (
    <div className="max-w-xl mx-auto bg-white border rounded p-6 shadow">
      <h2 className="text-xl font-bold text-green-700 mb-4">
        Exact Backup: <code>orderMaster</code> ➝ <code>orderMasterCopyDito</code>
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
