'use client';

import React, { useState } from 'react';
import { useAppContext } from '@/context/AppContext';
import { useRouter } from 'next/navigation';
import { getTemplateHtml } from '@/components/templates/emailTemplates';

export default function TemplateSelector() {
  const [selectedTemplateId, setSelectedTemplateId] = useState<number | null>(null);
  const { setTemplate, coupons } = useAppContext();
  const router = useRouter();

  const handleSelect = (id: number) => {
    setSelectedTemplateId(id);

    const html = getTemplateHtml(id, coupons || []);

    // Save the full template in context: templateId + rendered HTML
    setTemplate({
      templateId: id.toString(),
      content: html,
    });

    router.push('/campaigns');
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-center mb-6">📧 Choose an Email Template</h1>
      <div className="grid grid-cols-1 lg:grid-cols-1 gap-6">
        {[1, 2, 3].map((id) => (
          <div
            key={id}
            className={`border-2 rounded-lg p-4 shadow-md cursor-pointer ${
              selectedTemplateId === id ? 'border-green-500' : 'border-gray-300'
            }`}
            onClick={() => handleSelect(id)}
          >
            <h2 className="text-lg font-semibold mb-2">Template {id}</h2>
            <div className="h-48 overflow-auto bg-gray-50 text-sm p-2 rounded">
              <div dangerouslySetInnerHTML={{ __html: getTemplateHtml(id, coupons || []) }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
