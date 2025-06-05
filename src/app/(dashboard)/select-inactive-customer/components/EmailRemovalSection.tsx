'use client';

import React, { useState } from 'react';

type EmailRemovalSectionProps = {
  value: string;
  onChange: (val: string) => void;
};

const EmailRemovalSection = ({ value, onChange }: EmailRemovalSectionProps) => {
  const [showTextarea, setShowTextarea] = useState(false);

  return (
    <div className="mb-6">
      <h4 className="text-xl mb-2 font-semibold text-gray-800">Manually Remove Emails</h4>

      <button
        onClick={() => setShowTextarea(prev => !prev)}
        className={`px-5 py-2 rounded text-white transition font-medium ${
          showTextarea
            ? 'bg-orange-500 hover:bg-orange-600'
            : 'bg-gray-400 hover:bg-gray-500'
        }`}
      >
        {showTextarea ? 'Hide Removal Box' : 'Show Removal Box'}
      </button>

      {showTextarea && (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          rows={4}
          className="w-full mt-4 border rounded p-2"
        />
      )}
    </div>
  );
};

export default EmailRemovalSection;
