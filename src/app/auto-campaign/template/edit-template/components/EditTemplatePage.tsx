'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function EditTemplatePage() {
  const searchParams = useSearchParams();
  const [templateHtml, setTemplateHtml] = useState('');

  useEffect(() => {
    const content = decodeURIComponent(searchParams.get('content') || '');
    setTemplateHtml(content);
  }, [searchParams]);

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Modify Selected Template</h1>
      <div
        className="border p-4 rounded shadow"
        dangerouslySetInnerHTML={{ __html: templateHtml }}
      />
      {/* You can later add a form or WYSIWYG editor to edit the template */}
    </div>
  );
}
