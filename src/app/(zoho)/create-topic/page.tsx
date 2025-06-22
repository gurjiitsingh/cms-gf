'use client';

import { useState } from "react";

export default function CreateZohoTopicPage() {
  const [topicName, setTopicName] = useState('');
  const [topicDesc, setTopicDesc] = useState('');
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<any>(null);

  const handleSubmit = async () => {
    if (!topicName || !topicDesc) {
      alert("Please fill in all fields.");
      return;
    }

    setLoading(true);
    setResponse(null);

    try {
      const res = await fetch('/api/zoho/createTopic', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic_name: topicName,
          topic_desc: topicDesc,
        }),
      });

      const data = await res.json();
      setResponse(data);
    } catch (error) {
      setResponse({ error: "Network or server error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-white shadow rounded">
      <h1 className="text-2xl font-bold text-orange-600 mb-4">Create Zoho Campaign Topic</h1>

      <div className="space-y-4">
        <input
          type="text"
          placeholder="Topic Name"
          value={topicName}
          onChange={(e) => setTopicName(e.target.value)}
          className="w-full p-2 border rounded text-sm"
        />

        <textarea
          placeholder="Topic Description"
          value={topicDesc}
          onChange={(e) => setTopicDesc(e.target.value)}
          className="w-full p-2 border rounded text-sm"
          rows={4}
        />

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded"
        >
          {loading ? 'Creating...' : 'Create Topic'}
        </button>

        {response && (
          <pre className="bg-gray-100 p-3 mt-4 text-sm overflow-auto max-h-80 rounded">
            {JSON.stringify(response, null, 2)}
          </pre>
        )}
      </div>
    </div>
  );
}
