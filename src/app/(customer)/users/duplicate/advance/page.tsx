'use client'

import { useEffect, useState } from 'react'
import { userType } from '@/lib/types/userType'
import { fetchAllUsers } from '@/lib/firebase/functions/userFunctions' // You need to implement this if not yet.

export default function DuplicateUsersTable() {
  const [duplicateUsers, setDuplicateUsers] = useState<userType[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadDuplicates = async () => {
      setLoading(true)
      try {
        const allUsers = await fetchAllUsers()
        const emailMap: Record<string, userType[]> = {}

        // Group users by email
        allUsers.forEach(user => {
          const email = user.email?.toLowerCase().trim()
          if (!email) return
          if (!emailMap[email]) emailMap[email] = []
          emailMap[email].push(user)
        })

        // Filter out emails used more than once
        const duplicates = Object.values(emailMap)
          .filter(group => group.length > 1)
          .flat()

        setDuplicateUsers(duplicates)
      } catch (error) {
        console.error('Failed to load users:', error)
      }
      setLoading(false)
    }

    loadDuplicates()
  }, [])

  return (
    <div className="p-4 max-w-7xl mx-auto bg-white shadow rounded-lg">
      <h1 className="text-xl font-semibold mb-4">Duplicate Email Users</h1>

      {loading ? (
        <p>Loading...</p>
      ) : duplicateUsers.length === 0 ? (
        <p>No duplicate emails found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm text-left border border-gray-300">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2 border">Username</th>
                <th className="px-4 py-2 border">Email</th>
                 <th className="px-4 py-2 border">Doc ID</th>
                <th className="px-4 py-2 border">Created Time</th>
              </tr>
            </thead>
            <tbody>
              {duplicateUsers.map(user => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-4 py-2 border">{user.username}</td>
                  <td className="px-4 py-2 border">{user.email}</td>
                  <td className="px-4 py-2 border">{user.id}</td>
                  <td className="px-4 py-2 border">{user.time ?? '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
