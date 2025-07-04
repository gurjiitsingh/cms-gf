'use client';

import Link from 'next/link';
import React from 'react';

export default function Page() {
  return (
    <div className="max-w-md mx-auto mt-10 flex flex-col gap-4">
      <Link
        href="/lists/create-list/from-app"
        className="inline-block text-center bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg shadow transition"
      >
        📥 Add Raw Email List (Auto)
      </Link>

      <Link
        href="/lists/create-list/external"
        className="inline-block text-center bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg shadow transition"
      >
        ✍️ Add Email Manually
      </Link>
    </div>
  );
}
