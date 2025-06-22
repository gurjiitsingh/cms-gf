'use client';

import { useState } from 'react';

export default function ZohoTopicsPage() {
  const [topics, setTopics] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTopics = async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/zoho/getTopics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ from_index: 1, range: 50 }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Unknown error');
      } else {
        setTopics(data.topics || []);
      }
    } catch (err: any) {
      setError(err.message || 'Network error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4 text-orange-600">Zoho Topics</h1>

      <button
        onClick={fetchTopics}
        disabled={loading}
        className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded mb-6"
      >
        {loading ? 'Loading...' : 'Fetch Topics'}
      </button>

      {error && <p className="text-red-600 mb-4">{error}</p>}

      <ul className="space-y-3">
        {topics.map((topic, index) => (
          <li key={index} className="border p-4 rounded bg-gray-50 text-sm">
            <p><strong>Topic Name:</strong> {topic.topicname}</p>
            <p><strong>Topic ID:</strong> {topic.topicid}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
