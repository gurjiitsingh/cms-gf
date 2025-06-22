'use client';
import { useState } from 'react';

export default function AddContactsPage() {
  const [emailInputMethod, setEmailInputMethod] = useState<'csv' | 'textarea'>('textarea');
  const [emailids, setEmailids] = useState('');
  const [listname, setListname] = useState('');
  const [listdescription, setListdescription] = useState('');
  const [loading, setLoading] = useState(false);

  const mode = 'newlist'; // default
  const signupform = 'private'; // default and hidden

  const handleCSVUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const text = await file.text();
    const lines = text.split(/\r?\n/);
    const validEmails = lines
      .map((line) => line.trim())
      .filter((line) => line && /\S+@\S+\.\S+/.test(line));

    setEmailids(validEmails.join(','));
  };

  const handleAddContacts = async () => {
    if (!emailids || !listname) {
      alert("Please provide email addresses and list name.");
      return;
    }

    setLoading(true);

    const body = {
      emailids,
      listname,
      signupform,
      mode,
      listdescription,
    };

    const res = await fetch('/api/zoho/addContacts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    const data = await res.json();
    setLoading(false);

    if (res.ok) {
      alert("✅ Contacts added successfully!");
      console.log("Success Response:", data);
    } else {
      alert("❌ Failed: " + data.error);
      console.error("Error Details:", data.details);
    }
  };

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-xl font-semibold mb-4">Add Contacts to Zoho (New List)</h1>

      {/* List Name */}
      <div className="mb-4">
        <label className="block mb-1 font-medium">List Name *</label>
        <input
          type="text"
          className="w-full p-2 border rounded"
          placeholder="My Subscriber List"
          value={listname}
          onChange={(e) => setListname(e.target.value)}
        />
      </div>

      {/* Email Input Method */}
      <div className="mb-4">
        <label className="block mb-1 font-medium">Email Input Method</label>
        <select
          className="w-full p-2 border rounded"
          value={emailInputMethod}
          onChange={(e) => setEmailInputMethod(e.target.value as 'csv' | 'textarea')}
        >
          <option value="textarea">Enter emails (one per line)</option>
          <option value="csv">Upload CSV file</option>
        </select>
      </div>

      {/* Email Input Field */}
      {emailInputMethod === 'textarea' ? (
        <div className="mb-4">
          <label className="block mb-1 font-medium">Email Addresses *</label>
          <textarea
            className="w-full p-2 border rounded"
            placeholder="email1@example.com&#10;email2@example.com"
            rows={5}
            value={emailids.split(',').join('\n')}
            onChange={(e) =>
              setEmailids(
                e.target.value
                  .split('\n')
                  .map((line) => line.trim())
                  .filter(Boolean)
                  .join(',')
              )
            }
          />
        </div>
      ) : (
        <div className="mb-4">
          <label className="block mb-1 font-medium">Upload CSV with one email per line</label>
          <input type="file" accept=".csv" onChange={handleCSVUpload} />
        </div>
      )}

      {/* List Description */}
      <div className="mb-4">
        <label className="block mb-1 font-medium">List Description</label>
        <textarea
          className="w-full p-2 border rounded"
          placeholder="Optional description of the list"
          rows={3}
          value={listdescription}
          onChange={(e) => setListdescription(e.target.value)}
        />
      </div>

      {/* Submit Button */}
      <button
        onClick={handleAddContacts}
        disabled={loading}
        className="bg-green-600 text-white px-4 py-2 rounded"
      >
        {loading ? "Adding..." : "Add Contacts"}
      </button>
    </div>
  );
}
