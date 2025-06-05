'use client';

import React, { useState } from 'react';

type UnsubscribedEmailsSectionProps = {
  emails: string[];
};

const UnsubscribedEmailsSection = ({ emails }: UnsubscribedEmailsSectionProps) => {
  const [showTextarea, setShowTextarea] = useState(false);

  return (
    <div className="mb-6">
      <h4 className="text-xl mb-2 font-semibold text-gray-800">Unsubscribed Customers</h4>

      <button
        onClick={() => setShowTextarea(prev => !prev)}
        className={`px-5 py-2 rounded text-white transition font-medium ${
          showTextarea
            ? 'bg-orange-500 hover:bg-orange-600'
            : 'bg-gray-400 hover:bg-gray-500'
        }`}
      >
        {showTextarea ? 'Hide List' : 'Show List'}
      </button>

      {showTextarea && (
        <textarea
          readOnly
          value={emails.join('\n')}
          rows={6}
          className="w-full mt-4 border rounded p-2 bg-red-100 text-sm text-red-700"
        />
      )}
    </div>
  );
};

export default UnsubscribedEmailsSection;
