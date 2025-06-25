'use client';

import React, { useState } from 'react';

export default function EmailDeduplicator() {
  const [mainEmails, setMainEmails] = useState<string[]>([]);
  const [removeEmails, setRemoveEmails] = useState<string[]>([]);
  const [resultEmails, setResultEmails] = useState<string[]>([]);
  const [status, setStatus] = useState<string>('');

  const parseCSV = async (file: File): Promise<string[]> => {
    const text = await file.text();
    return text
      .split('\n')
      .map((line) => line.trim())
      .filter((email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email));
  };

  const handleMainUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const emails = await parseCSV(file);
    setMainEmails(emails);
    setStatus(`Main list loaded: ${emails.length} emails`);
  };

  const handleRemoveUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const emails = await parseCSV(file);
    setRemoveEmails(emails);
    setStatus((prev) => prev + ` | Remove list loaded: ${emails.length} emails`);
  };

  const handleRemoveDuplicates = () => {
    const removeSet = new Set(removeEmails);
    const filtered = mainEmails.filter((email) => !removeSet.has(email));
    setResultEmails(filtered);
    setStatus(`✅ Removed ${mainEmails.length - filtered.length} duplicates. Final list: ${filtered.length}`);
  };

  const downloadCSV = () => {
    const blob = new Blob([resultEmails.join('\n')], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'refined-main-list.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white border rounded-lg shadow mt-6 space-y-4">
      <h2 className="text-xl font-bold text-gray-700">📤 Email Deduplicator</h2>

      <div className="space-y-2">
        <label className="block font-medium text-gray-600">Upload Main CSV (List to Keep)</label>
        <input type="file" accept=".csv" onChange={handleMainUpload} />
      </div>

      <div className="space-y-2">
        <label className="block font-medium text-gray-600">Upload Remove CSV (Emails to Exclude)</label>
        <input type="file" accept=".csv" onChange={handleRemoveUpload} />
      </div>

      <button
        onClick={handleRemoveDuplicates}
        disabled={mainEmails.length === 0 || removeEmails.length === 0}
        className="bg-orange-500 hover:bg-orange-600 text-white font-medium px-4 py-2 rounded"
      >
        Remove Duplicates
      </button>

      {resultEmails.length > 0 && (
        <button
          onClick={downloadCSV}
          className="ml-4 bg-green-600 hover:bg-green-700 text-white font-medium px-4 py-2 rounded"
        >
          Download Refined CSV
        </button>
      )}

      {status && <p className="text-sm text-gray-600 mt-4">{status}</p>}

      {resultEmails.length > 0 && (
        <div className="mt-4 text-sm bg-gray-100 p-3 rounded max-h-60 overflow-auto">
          <h3 className="font-medium mb-2">Preview:</h3>
          {resultEmails.slice(0, 10).map((email, idx) => (
            <div key={idx}>{email}</div>
          ))}
          {resultEmails.length > 10 && <p className="mt-2 text-gray-500">...and {resultEmails.length - 10} more</p>}
        </div>
      )}
    </div>
  );
}
