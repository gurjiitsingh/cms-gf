'use client';

import { useState } from 'react';
import { useAppContext } from '@/context/AppContext';
import { useRouter } from 'next/navigation';

export default function SaveTemplateToFileAndUrlToCampaign() {
  const { templateMarketing, setTemplateUrl } = useAppContext();
  const [loading, setLoading] = useState(false);
  const router = useRouter();


  console.log("templateForUrl-------", templateMarketing)

  const handleSubmit = async () => {
    if (!templateMarketing) {
      alert('No template selected');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/zoho/template/save-to-file', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(templateMarketing),
      });

      if (!res.ok) throw new Error('Failed to save template');

      const { url } = await res.json();
     setTemplateUrl(url)
     router.push('/create-campaign');
    // setSavedUrl(url);
    } catch (error) {
      console.error(error);
      alert('Error saving template');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 border rounded space-y-4">
      <h2 className="text-xl font-semibold">Generate Public Template URL</h2>

      <button
        onClick={handleSubmit}
        disabled={loading}
        className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded w-full"
      >
        {loading ? 'Saving...' : 'Save Template & Generate URL'}
      </button>

      {/* {savedUrl && (
        <div className="text-green-600 text-sm">
          ✅ Template saved:{" "}
          <a
            href={savedUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="underline text-blue-600"
          >
            {savedUrl}
          </a>
        </div>
      )} */}
    </div>
  );
}
