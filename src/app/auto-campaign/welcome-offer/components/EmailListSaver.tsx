'use client';

import { useEffect, useState } from 'react';
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
  updateDoc,
} from 'firebase/firestore';

type Props = {
  selectedEmails: string[];
};

export default function EmailListSaver({ selectedEmails }: Props) {
  const [listName, setListName] = useState('');
  const [saving, setSaving] = useState(false);
  const [mode, setMode] = useState<'new' | 'existing'>('new');
  const [existingLists, setExistingLists] = useState<{ id: string; name: string }[]>([]);
  const [selectedListId, setSelectedListId] = useState('');

  useEffect(() => {
    const fetchLists = async () => {
      const snapshot = await getDocs(collection(db, 'emailLists'));
      const lists = snapshot.docs.map((doc) => ({
        id: doc.id,
        name: doc.data().listName || 'Unnamed',
      }));
      setExistingLists(lists);
    };
    fetchLists();
  }, []);

  const handleSave = async () => {
    const listTitle = listName.trim();

    if (mode === 'new' && !listTitle) {
      alert('Please enter a list name.');
      return;
    }

    if (mode === 'existing' && !selectedListId) {
      alert('Please select a list to update.');
      return;
    }

    if (selectedEmails.length === 0) {
      alert('No emails selected.');
      return;
    }

    try {
      setSaving(true);

      // Step 1: Find which emails are new to campaignEmailListFinal
      const chunks: string[][] = [];
      for (let i = 0; i < selectedEmails.length; i += 10) {
        chunks.push(selectedEmails.slice(i, i + 10));
      }

      const existingSet = new Set<string>();
      for (const chunk of chunks) {
        const q = query(collection(db, 'campaignEmailListFinal'), where('email', 'in', chunk));
        const snapshot = await getDocs(q);
        snapshot.forEach((doc) => {
          const data = doc.data();
          if (data.email) existingSet.add(data.email);
        });
      }

      const uniqueEmails = selectedEmails.filter((email) => !existingSet.has(email));
      if (uniqueEmails.length === 0) {
        alert('All selected emails already exist in campaignEmailListFinal.');
        return;
      }

      // Step 2: Save to emailLists
      if (mode === 'new') {
        await addDoc(collection(db, 'emailLists'), {
          listName: listTitle,
          emails: uniqueEmails,
          createdAt: serverTimestamp(),
        });
      } else {
        const listDoc = doc(db, 'emailLists', selectedListId);
        const existing = await getDocs(query(collection(db, 'emailLists'), where('__name__', '==', selectedListId)));
        const oldEmails = existing.docs[0]?.data()?.emails || [];
        const mergedEmails = Array.from(new Set([...oldEmails, ...uniqueEmails]));
        await updateDoc(listDoc, {
          emails: mergedEmails,
        });
      }

      // Step 3: Add to campaignEmailListFinal
      const batch = writeBatch(db);
      uniqueEmails.forEach((email) => {
        const ref = doc(collection(db, 'campaignEmailListFinal'));
        batch.set(ref, {
          email,
          source: 'manual',
          createdAt: serverTimestamp(),
        });
      });
      await batch.commit();

      alert(`✅ Saved ${uniqueEmails.length} new email(s) successfully.`);
      setListName('');
      setSelectedListId('');
    } catch (error) {
      console.error('Save failed:', error);
      alert('❌ Failed to save email list.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="flex items-center gap-3">
          <label className="font-medium text-sm">Save to:</label>
          <select
            value={mode}
            onChange={(e) => setMode(e.target.value as 'new' | 'existing')}
            className="border rounded px-3 py-2 text-sm"
          >
            <option value="new">🆕 Create New List</option>
            <option value="existing">📂 Add to Existing</option>
          </select>
        </div>

        {mode === 'new' && (
          <input
            type="text"
            value={listName}
            onChange={(e) => setListName(e.target.value)}
            className="border px-3 py-2 rounded w-full sm:w-auto"
            placeholder="Enter new list name"
          />
        )}

        {mode === 'existing' && (
          <select
            value={selectedListId}
            onChange={(e) => setSelectedListId(e.target.value)}
            className="border px-3 py-2 rounded text-sm w-full sm:w-auto"
          >
            <option value="">-- Select Existing List --</option>
            {existingLists.map((list) => (
              <option key={list.id} value={list.id}>
                {list.name}
              </option>
            ))}
          </select>
        )}

        <button
          onClick={handleSave}
          disabled={saving}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          {saving ? 'Saving...' : 'Save Emails to list'}
        </button>
      </div>
    </div>
  );
}
