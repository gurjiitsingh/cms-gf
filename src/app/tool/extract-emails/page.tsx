'use client'

import { useState } from 'react'

export default function ExtractEmailsFromFile() {
  const [emails, setEmails] = useState<string[]>([])
  const [fileName, setFileName] = useState<string | null>(null)

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setFileName(file.name)
    const text = await file.text()

    // Extract all email addresses from the text
    const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g
    const found = text.match(emailRegex) || []

    // Remove duplicates
    const uniqueEmails = Array.from(new Set(found.map((e) => e.toLowerCase())))

    setEmails(uniqueEmails)
  }

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Extract Emails from File</h1>

      <input
        type="file"
        accept=".txt,.csv"
        onChange={handleFileChange}
        className="block mb-4"
      />

      {fileName && (
        <p className="text-sm text-gray-600">
          📄 File: <strong>{fileName}</strong> | ✉️ Emails found: {emails.length}
        </p>
      )}

      {emails.length > 0 && (
        <textarea
          rows={12}
          className="w-full border rounded p-3 text-sm font-mono"
          value={emails.join('\n')}
          readOnly
        />
      )}
    </div>
  )
}
