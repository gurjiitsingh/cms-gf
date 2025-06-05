'use client';

import React, { useState } from 'react';

type FinalEmailListSectionProps = {
  finalEmailList: string[];
};

const FinalEmailListSection = ({ finalEmailList }: FinalEmailListSectionProps) => {
  const [showTextarea, setShowTextarea] = useState(false);

  return (
    <div className="mb-6">
      <h3 className="text-2xl mb-4 font-semibold text-gray-800">Final Email List</h3>
      <p className="text-sm text-gray-500 mb-1">
        Final list includes <strong>{finalEmailList.length}</strong> emails.
      </p>

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
          value={finalEmailList.join('\n')}
          rows={6}
          className="w-full mt-4 border rounded p-2 bg-gray-100 text-sm text-gray-700"
        />
      )}
    </div>
  );
};

export default FinalEmailListSection;
