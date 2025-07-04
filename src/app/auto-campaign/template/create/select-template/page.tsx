'use client';

import React, { useState } from 'react';
import { useAppContext } from '@/context/AppContext';

import { getTemplateHtml } from '@/components/templates/emailTemplates';
import CreateEmailTemplate from '../coponents/CreateEmailTemplate';

export default function TemplateSelector() {
  const [selectedTemplateId, setSelectedTemplateId] = useState<number | null>(null);
  const { setTemplateMarketing, couponsMarketing } = useAppContext();
 
  const recipient = 'gurjiitsingh@gmal.com';

  const handleTemplateChange = (id: number) => {
    setSelectedTemplateId(id);

    const html = getTemplateHtml(id, couponsMarketing || [], recipient);
    setTemplateMarketing({
      templateId: id.toString(),
      content: html,
    });
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-center">Choose an Email Template</h1>

      {/* Show save component only if template is selected */}
      {selectedTemplateId && (
        <>
          <CreateEmailTemplate />
        </>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-1 gap-6">
        {[1, 2, 3].map((id) => (
          <div
            key={id}
            className={`border-2 rounded-lg p-4 shadow-md ${
              selectedTemplateId === id ? 'border-green-500' : 'border-gray-300'
            }`}
          >
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="radio"
                name="template"
                value={id}
                checked={selectedTemplateId === id}
                onChange={() => handleTemplateChange(id)}
              />
              <h2 className="text-lg font-semibold">Template {id}</h2>
            </label>
            <div className="h-48 overflow-auto bg-gray-50 text-sm p-2 mt-2 rounded">
              <div
                dangerouslySetInnerHTML={{
                  __html: getTemplateHtml(id, couponsMarketing || [], recipient),
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
