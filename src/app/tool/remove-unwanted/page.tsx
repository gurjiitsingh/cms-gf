'use client'

import { useState } from 'react'

export default function EmailDifference() {
  const [list1, setList1] = useState('')
  const [list2, setList2] = useState('')
  const [result, setResult] = useState('')
  const [count, setCount] = useState(0)

  const handleSubtract = () => {
    const emails1 = list1
      .split('\n')
      .map(email => email.trim().toLowerCase())
      .filter(email => email)

    const emails2Set = new Set(
      list2
        .split('\n')
        .map(email => email.trim().toLowerCase())
        .filter(email => email)
    )

    const difference = emails1.filter(email => !emails2Set.has(email))

    setCount(difference.length)
    setResult(difference.join('\n'))
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Email Subtraction Tool</h1>

      <div>
        <label className="block mb-1 font-semibold">List 1 (Full Email List):</label>
        <textarea
          rows={8}
          className="w-full border rounded p-2"
          placeholder="Paste full email list here..."
          value={list1}
          onChange={e => setList1(e.target.value)}
        />
      </div>

      <div>
        <label className="block mb-1 font-semibold">List 2 (Emails to Subtract):</label>
        <textarea
          rows={8}
          className="w-full border rounded p-2"
          placeholder="Paste emails to subtract here..."
          value={list2}
          onChange={e => setList2(e.target.value)}
        />
      </div>

      <button
        onClick={handleSubtract}
        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
      >
        Calculate Difference
      </button>

      {result && (
        <div>
          <label className="block mt-4 mb-1 font-semibold">
            Result: {count} unique email(s)
          </label>
          <textarea
            rows={10}
            className="w-full border rounded p-2"
            value={result}
            readOnly
          />
        </div>
      )}
    </div>
  )
}
