'use client'

import { useState } from 'react'

export default function RemoveDuplicateEmails() {
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [duplicates, setDuplicates] = useState('')
  const [uniqueCount, setUniqueCount] = useState(0)
  const [totalCount, setTotalCount] = useState(0)
  const [duplicateCount, setDuplicateCount] = useState(0)

  const handleRemoveDuplicates = () => {
    const emails = input
      .split('\n')
      .map(email => email.trim().toLowerCase())
      .filter(email => email !== '')

    const emailMap: Record<string, number> = {}
    emails.forEach(email => {
      emailMap[email] = (emailMap[email] || 0) + 1
    })

    const uniqueEmails = Object.keys(emailMap)
    const duplicateEmails = Object.keys(emailMap).filter(email => emailMap[email] > 1)

    setTotalCount(emails.length)
    setUniqueCount(uniqueEmails.length)
    setDuplicateCount(duplicateEmails.length)

    setOutput(uniqueEmails.join('\n'))
    setDuplicates(duplicateEmails.join('\n'))
  }

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-4">
      <h1 className="text-2xl font-bold">Remove Duplicate Emails</h1>

      <div>
        <label className="block mb-2 font-medium">Paste your emails (one per line):</label>
        <textarea
          rows={10}
          className="w-full border rounded p-2"
          value={input}
          onChange={e => setInput(e.target.value)}
        />
      </div>

      <button
        onClick={handleRemoveDuplicates}
        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
      >
        Remove Duplicates
      </button>

      {output && (
        <div className="space-y-2">
          <div className="text-sm text-gray-600">
            Total: {totalCount} | Unique: {uniqueCount} | Duplicates: {duplicateCount}
          </div>

          <label className="block font-medium">Cleaned Emails:</label>
          <textarea
            rows={10}
            className="w-full border rounded p-2"
            value={output}
            readOnly
          />

          {duplicates && (
            <>
              <label className="block font-medium mt-4">Duplicate Emails:</label>
              <textarea
                rows={5}
                className="w-full border rounded p-2 text-red-600"
                value={duplicates}
                readOnly
              />
            </>
          )}
        </div>
      )}
    </div>
  )
}
