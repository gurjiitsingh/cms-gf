'use client';

import React, { useState } from 'react';

type ManualEmailEntryProps = {
  value: string;
  onChange: (val: string) => void;
  visible: boolean;
};

const ManualEmailEntry = ({ value, onChange, visible }: ManualEmailEntryProps) => {
  const [showTextarea, setShowTextarea] = useState(false);

  if (!visible) return null;

  return (
    <div className="my-8">
      <h4 className="text-xl mb-2 font-semibold text-gray-800">Add Emails Manually</h4>

      <button
        onClick={() => setShowTextarea((prev) => !prev)}
        className={`px-5 py-2 rounded text-white transition font-medium ${
          showTextarea
            ? 'bg-orange-500 hover:bg-orange-600'
            : 'bg-gray-400 hover:bg-gray-500'
        }`}
      >
        {showTextarea ? 'Hide Input Box' : 'Show Input Box'}
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

export default ManualEmailEntry;
