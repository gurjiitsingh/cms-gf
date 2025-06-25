'use client'

import { useState } from 'react'

export default function SplitEmailsToCsv() {
  const [emailsInput, setEmailsInput] = useState('')
  const [chunkSize, setChunkSize] = useState<number>(50)

  const handleDownload = () => {
    const rawEmails = emailsInput
      .split('\n')
      .map((e) => e.trim())
      .filter((e) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e))

    const uniqueEmails = Array.from(new Set(rawEmails))
    const chunks = []

    for (let i = 0; i < uniqueEmails.length; i += chunkSize) {
      chunks.push(uniqueEmails.slice(i, i + chunkSize))
    }

    chunks.forEach((chunk, index) => {
      const csvContent = 'Email\n' + chunk.join('\n')
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
      const url = URL.createObjectURL(blob)

      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', `list-${index + 1}.csv`)
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
    })
  }

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-4">
      <h2 className="text-2xl font-semibold">Split Emails into CSV Files</h2>

      <textarea
        className="w-full border p-3 rounded font-mono text-sm"
        rows={10}
        placeholder="Paste emails here (one per line)"
        value={emailsInput}
        onChange={(e) => setEmailsInput(e.target.value)}
      />

      <div className="flex items-center gap-4">
        <label htmlFor="count" className="font-medium">
          Emails per file:
        </label>
        <input
          id="count"
          type="number"
          min={1}
          className="border rounded px-3 py-1 w-24"
          value={chunkSize}
          onChange={(e) => setChunkSize(Number(e.target.value))}
        />
      </div>

      <button
        onClick={handleDownload}
        className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded"
      >
        Generate CSV Files
      </button>
    </div>
  )
}
