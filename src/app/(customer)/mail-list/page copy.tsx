'use client';

import React, { useState } from 'react';
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  doc
} from 'firebase/firestore';
import { db } from '@/lib/firebaseConfig';

export default function UploadEmails() {
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [textareaValue, setTextareaValue] = useState('');
  const [unsubscribeFile, setUnsubscribeFile] = useState<File | null>(null);
  const [unsubscribeTextarea, setUnsubscribeTextarea] = useState('');
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');
  const [unsubscribeStatus, setUnsubscribeStatus] = useState('');

  const extractEmails = (text: string): string[] => {
    return text
      .split(/[\s,;\n]+/)
      .map((e) => e.trim().toLowerCase())
      .filter((e) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e));
  };

  const parseCSV = (file: File): Promise<string[]> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        const emails = extractEmails(content);
        resolve(emails);
      };
      reader.onerror = reject;
      reader.readAsText(file);
    });

  const handleUpload = async () => {
    setLoading(true);
    setStatusMessage('');

    try {
      const emailsFromCSV = csvFile ? await parseCSV(csvFile) : [];
      const emailsFromTextarea = extractEmails(textareaValue);

      const csvSource = csvFile?.name || '';
      const allEmailsWithSource = [
        ...emailsFromCSV.map((email) => ({ email, source: csvSource })),
        ...emailsFromTextarea.map((email) => ({ email, source: 'manual' })),
      ];

      if (allEmailsWithSource.length === 0) {
        setStatusMessage('⚠️ No valid emails found.');
        setLoading(false);
        return;
      }

      const deduped = new Map<string, { email: string; source: string }>();
      allEmailsWithSource.forEach(({ email, source }) => {
        if (!deduped.has(email)) deduped.set(email, { email, source });
      });

      const snapshot = await getDocs(collection(db, 'campaignEmailListFinal'));
      const existingEmails = new Set(
        snapshot.docs.map((doc) => doc.data().email?.toLowerCase())
      );

      const newEntries = Array.from(deduped.values()).filter(
        ({ email }) => !existingEmails.has(email)
      );

      for (const entry of newEntries) {
        await addDoc(collection(db, 'campaignEmailListFinal'), {
          email: entry.email,
          source: entry.source,
          createdAt: new Date(),
        });
      }

      setStatusMessage(`✅ Added ${newEntries.length} new email(s).`);
      setCsvFile(null);
      setTextareaValue('');
    } catch (err) {
      console.error('Upload failed:', err);
      setStatusMessage('❌ Failed to upload emails.');
    } finally {
      setLoading(false);
    }
  };

  const handleUnsubscribeUpload = async () => {
    setLoading(true);
    setUnsubscribeStatus('');

    try {
      const unsubFromFile = unsubscribeFile ? await parseCSV(unsubscribeFile) : [];
      const unsubFromText = extractEmails(unsubscribeTextarea);

      const unsubEmails = Array.from(new Set([...unsubFromFile, ...unsubFromText]));

      if (unsubEmails.length === 0) {
        setUnsubscribeStatus('⚠️ No valid unsubscribed emails found.');
        setLoading(false);
        return;
      }

      const snapshot = await getDocs(collection(db, 'campaignEmailListFinal'));
      const existingMap = new Map<string, { id: string; unsubscribed: boolean }>();
      snapshot.docs.forEach((docSnap) => {
        const email = docSnap.data().email?.toLowerCase();
        if (email) {
          existingMap.set(email, { id: docSnap.id, unsubscribed: !!docSnap.data().unsubscribed });
        }
      });

      let added = 0;
      let updated = 0;

      for (const email of unsubEmails) {
        const lower = email.toLowerCase();
        if (existingMap.has(lower)) {
          const { id, unsubscribed } = existingMap.get(lower)!;
          if (!unsubscribed) {
            await updateDoc(doc(db, 'campaignEmailListFinal', id), {
              unsubscribed: true,
            });
            updated++;
          }
        } else {
          await addDoc(collection(db, 'campaignEmailListFinal'), {
            email: lower,
            unsubscribed: true,
            source: 'unsubscribed',
            createdAt: new Date(),
          });
          added++;
        }
      }

      setUnsubscribeStatus(`✅ ${added} added, ${updated} updated as unsubscribed.`);
      setUnsubscribeFile(null);
      setUnsubscribeTextarea('');
    } catch (err) {
      console.error('Unsubscribe failed:', err);
      setUnsubscribeStatus('❌ Failed to update unsubscribed emails.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded shadow space-y-10">
      {/* Section 1: Upload Valid Emails */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Upload Emails to Final List</h2>

        <div className="mb-4">
          <label className="block mb-2 font-medium">CSV File:</label>
          <input
            type="file"
            accept=".csv"
            onChange={(e) => setCsvFile(e.target.files?.[0] || null)}
            className="w-full text-sm border px-3 py-2"
          />
        </div>

        <div className="mb-4">
          <label className="block mb-2 font-medium">Or Paste Emails (manual):</label>
          <textarea
            value={textareaValue}
            onChange={(e) => setTextareaValue(e.target.value)}
            rows={5}
            className="w-full border px-3 py-2 text-sm"
            placeholder="e.g. one@example.com, two@example.com"
          />
        </div>

        <button
          onClick={handleUpload}
          disabled={loading}
          className="bg-blue-600 text-white px-5 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? 'Uploading...' : 'Upload Emails'}
        </button>

        {statusMessage && <p className="mt-4 text-sm text-gray-700">{statusMessage}</p>}
      </div>

      {/* Section 2: Upload Unsubscribed */}
      <div className="border-t pt-6">
        <h2 className="text-xl font-semibold mb-4">Upload Unsubscribed Emails</h2>

        <div className="mb-4">
          <label className="block mb-2 font-medium">CSV File (Unsubscribed):</label>
          <input
            type="file"
            accept=".csv"
            onChange={(e) => setUnsubscribeFile(e.target.files?.[0] || null)}
            className="w-full text-sm border px-3 py-2"
          />
        </div>

        <div className="mb-4">
          <label className="block mb-2 font-medium">Or Paste Emails (manual):</label>
          <textarea
            value={unsubscribeTextarea}
            onChange={(e) => setUnsubscribeTextarea(e.target.value)}
            rows={5}
            className="w-full border px-3 py-2 text-sm"
            placeholder="e.g. unsub1@example.com, unsub2@example.com"
          />
        </div>

        <button
          onClick={handleUnsubscribeUpload}
          disabled={loading}
          className="bg-red-600 text-white px-5 py-2 rounded hover:bg-red-700 disabled:opacity-50"
        >
          {loading ? 'Processing...' : 'Upload Unsubscribed Emails'}
        </button>

        {unsubscribeStatus && (
          <p className="mt-4 text-sm text-gray-700">{unsubscribeStatus}</p>
        )}
      </div>
    </div>
  );
}
