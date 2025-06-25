'use client';

import { useState } from 'react';

export default function CreateCampaignPage() {
  const [name, setName] = useState('');
  const [subject, setSubject] = useState('');
  const [senderId, setSenderId] = useState('');
  const [recipientsListId, setRecipientsListId] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleCreate = async () => {
    setLoading(true);
    setResult(null);

    try {
      const res = await fetch('/api/brevo/campaigns/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          subject,
          sender: { id: parseInt(senderId) }, // Must be a verified sender
          recipients: { listIds: [parseInt(recipientsListId)] },
          type: 'classic',
        }),
      });

      const data = await res.json();
      setResult(data);
    } catch (error) {
      setResult({ error: 'Something went wrong.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4 text-green-700">Create Email Campaign</h1>

      <div className="space-y-4">
        <input
          type="text"
          placeholder="Campaign Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full border px-3 py-2 rounded"
        />

        <input
          type="text"
          placeholder="Subject"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          className="w-full border px-3 py-2 rounded"
        />

        <input
          type="number"
          placeholder="Sender ID"
          value={senderId}
          onChange={(e) => setSenderId(e.target.value)}
          className="w-full border px-3 py-2 rounded"
        />

        <input
          type="number"
          placeholder="List ID"
          value={recipientsListId}
          onChange={(e) => setRecipientsListId(e.target.value)}
          className="w-full border px-3 py-2 rounded"
        />

        <button
          onClick={handleCreate}
          disabled={loading}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:opacity-50"
        >
          {loading ? 'Creating...' : 'Create Campaign'}
        </button>
      </div>

      {result && (
        <pre className="mt-6 bg-gray-100 p-4 rounded text-sm overflow-auto max-h-64">
          {JSON.stringify(result, null, 2)}
        </pre>
      )}
    </div>
  );
}
