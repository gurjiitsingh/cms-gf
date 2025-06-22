'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import fs from 'fs';
import path from 'path';

export default function CreateEmailTemplate() {
  const [templateName, setTemplateName] = useState('');
  const [htmlContent, setHtmlContent] = useState('');
  const [saving, setSaving] = useState(false);
  const [url, setUrl] = useState('');
  const router = useRouter();

  const handleSaveTemplate = async () => {
    if (!templateName || !htmlContent) {
      alert('Please provide both a template name and HTML content.');
      return;
    }

    setSaving(true);

    const res = await fetch('/api/zoho/template/save-template', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        templateName,
        htmlContent,
      }),
    });

    const data = await res.json();
    setSaving(false);

    if (data.success) {
      setUrl(data.url);
    } else {
      alert('Error saving template.');
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold text-orange-600">Create Email Template</h1>

      <input
        type="text"
        placeholder="Template Name (no spaces)"
        value={templateName}
        onChange={(e) => setTemplateName(e.target.value)}
        className="w-full p-2 border rounded"
      />

      <textarea
        rows={15}
        placeholder="Enter HTML content here"
        value={htmlContent}
        onChange={(e) => setHtmlContent(e.target.value)}
        className="w-full p-2 border rounded font-mono text-sm"
      />

      <button
        onClick={handleSaveTemplate}
        disabled={saving}
        className="bg-orange-500 text-white px-6 py-2 rounded hover:bg-orange-600"
      >
        {saving ? 'Saving...' : 'Save Template'}
      </button>

      {url && (
        <p className="text-green-600">Template saved! URL: <a href={url} className="underline" target="_blank">{url}</a></p>
      )}
    </div>
  );
}
