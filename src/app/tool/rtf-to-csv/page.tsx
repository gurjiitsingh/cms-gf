'use client';

import { useState } from 'react';

export default function RtfToCsvPage() {
  const [csvContent, setCsvContent] = useState('');
  const [loading, setLoading] = useState(false);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    setLoading(true);
    const res = await fetch('/api/rtf-to-csv', {
      method: 'POST',
      body: formData,
    });

    const data = await res.json();
    setLoading(false);

    if (res.ok) {
      setCsvContent(data.csv);
    } else {
      alert('Error: ' + data.error);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6">
      <h1 className="text-xl font-bold mb-4">Convert RTF to CSV</h1>
      <input type="file" accept=".rtf" onChange={handleUpload} className="mb-4" />
      {loading && <p>Converting...</p>}
      {csvContent && (
        <div className="mt-4">
          <h2 className="text-lg font-semibold mb-2">CSV Output:</h2>
          <pre className="bg-gray-100 p-3 rounded overflow-auto max-h-96 text-sm">{csvContent}</pre>
        </div>
      )}
    </div>
  );
}
