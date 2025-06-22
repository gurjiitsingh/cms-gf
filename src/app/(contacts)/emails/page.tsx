'use client'

import { useEffect, useState } from 'react'
import { userType } from '@/lib/types/userType'
import { getTotalUsersCount, fetchAllUsers, fetchAllEmails } from '@/lib/firebase/functions/userFunctions'

export default function CustomerEmailList() {
  const [customers, setCustomers] = useState<userType[]>([])
  const [loading, setLoading] = useState(true)
  const [totalUsers, setTotalUsers] = useState<number | null>(null)
  const [countLoading, setCountLoading] = useState(false)

  useEffect(() => {
    loadAllCustomers()
  }, [])

  const loadAllCustomers = async () => {
    setLoading(true)
    try {
      const users = await fetchAllEmails() // Fetch all users from Firestore
      setCustomers(users)
    } catch (error) {
      console.error('Error loading all customers:', error)
    }
    setLoading(false)
  }

  const handleShowTotalUsers = async () => {
    setCountLoading(true)
    try {
      const count = await getTotalUsersCount()
      setTotalUsers(count)
    } catch (error) {
      console.error('Error fetching total users:', error)
    }
    setCountLoading(false)
  }

  const downloadEmails = () => {
    const emails = [...customers].reverse().map((c) => c.email).join('\n')
    const blob = new Blob([emails], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)

    const a = document.createElement('a')
    a.href = url
    a.download = 'customer-emails.txt'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <div className="p-4 max-w-4xl mx-auto bg-white shadow rounded-lg">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-semibold">All Customer Emails</h1>
        {totalUsers !== null ? (
          <span className="text-sm text-gray-600">Total Users: {totalUsers}</span>
        ) : (
          <button
            onClick={handleShowTotalUsers}
            disabled={countLoading}
            className="text-sm px-3 py-1 border rounded bg-gray-100 hover:bg-gray-200 disabled:opacity-50"
          >
            {countLoading ? 'Loading...' : 'Show Total Users'}
          </button>
        )}
      </div>

      {loading ? (
        <p>Loading all customer emails...</p>
      ) : customers.length === 0 ? (
        <p>No customers found.</p>
      ) : (
        <div className="mt-4">
          <label className="block mb-2 font-medium">Emails (oldest at top):</label>
          <textarea
            rows={15}
            className="w-full p-2 border border-gray-300 rounded resize-none"
            readOnly
            value={[...customers].reverse().map((c) => c.email).join('\n')}
          />

          <button
            onClick={downloadEmails}
            className="mt-3 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded"
          >
            Download Emails as .txt
          </button>
        </div>
      )}
    </div>
  )
}
