'use client';

import { useState } from 'react';
import { db } from '@/lib/firebaseConfig';
import {
  collection,
  getDocs,
  query,
  where,
  serverTimestamp,
  addDoc,
  writeBatch,
  doc,
} from 'firebase/firestore';

type Props = {
  selectedEmails: string[];
};

export default function EmailListSaver({ selectedEmails }: Props) {
  const [listName, setListName] = useState('');
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!listName.trim()) {
      alert('Please enter a list name.');
      return;
    }

    if (selectedEmails.length === 0) {
      alert('No emails selected.');
      return;
    }

    try {
      setSaving(true);

      // Step 1: Fetch existing emails in campaignEmailListFinal
      const chunks: string[][] = [];
      for (let i = 0; i < selectedEmails.length; i += 10) {
        chunks.push(selectedEmails.slice(i, i + 10));
      }

      const existingSet = new Set<string>();

      for (const chunk of chunks) {
        const q = query(
          collection(db, 'campaignEmailListFinal'),
          where('email', 'in', chunk)
        );

        const snapshot = await getDocs(q);
        snapshot.forEach((doc) => {
          const data = doc.data();
          if (data.email) {
            existingSet.add(data.email);
          }
        });
      }

      const uniqueEmails = selectedEmails.filter((email) => !existingSet.has(email));

      if (uniqueEmails.length === 0) {
        alert('All selected emails already exist. Nothing new to add.');
        return;
      }

      // Step 2: Add unique emails to emailLists
      await addDoc(collection(db, 'emailLists'), {
        listName: listName.trim(),
        emails: uniqueEmails,
        createdAt: serverTimestamp(),
      });

      // Step 3: Add to campaignEmailListFinal
      const batch = writeBatch(db);
      uniqueEmails.forEach((email) => {
        const ref = collection(db, 'campaignEmailListFinal');
        const newDoc = doc(ref); // Firestore auto ID
        batch.set(newDoc, {
          email,
          source: 'manual',
          createdAt: serverTimestamp(),
        });
      });

      if (uniqueEmails.length > 0) {
        await batch.commit();
      }

      alert(`✅ Saved ${uniqueEmails.length} new email(s) successfully.`);
      setListName('');
    } catch (error) {
      console.error('Save failed:', error);
      alert('❌ Failed to save email list.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="">
    
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
        <input
          type="text"
          value={listName}
          onChange={(e) => setListName(e.target.value)}
          className="border px-3 py-2 rounded w-full sm:w-auto"
          placeholder="Enter list name"
        />
        <button
          onClick={handleSave}
          disabled={saving}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          {saving ? 'Saving...' : 'Save Email to List'}
        </button>
      </div>
    </div>
  );
}
