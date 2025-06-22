'use client'

import { useEffect, useState } from 'react'
import { collection, getDocs, updateDoc, doc } from 'firebase/firestore'
import { db } from '@/lib/firebaseConfig'
import { userType } from '@/lib/types/userType'

export default function SyncMissingEmails() {
  const [updating, setUpdating] = useState(false)
  const [updatedCount, setUpdatedCount] = useState(0)
  const [errors, setErrors] = useState<string[]>([])

  const syncEmails = async () => {
    setUpdating(true)
    setUpdatedCount(0)
    setErrors([])

    try {
      const dummySnap = await getDocs(collection(db, 'orderMasterDummy'))
      const userSnap = await getDocs(collection(db, 'users'))

      const users: Record<string, string> = {} // username (without spaces) => email
      userSnap.docs.forEach((doc) => {
        const user = doc.data() as userType
        if (user.username && user.email) {
          users[user.username.replace(/\s+/g, '').toLowerCase()] = user.email
        }
      })

      let count = 0

      for (const d of dummySnap.docs) {
        const data = d.data()
        const customerName = data.customerName || ''
        const email = data.email || ''

        // Skip if email is not empty
        if (email && email.trim() !== '') continue

        const cleanedName = customerName.replace(/\s+/g, '').toLowerCase()
        const matchedEmail = users[cleanedName]

        if (matchedEmail) {
          try {
            await updateDoc(doc(db, 'orderMasterDummy', d.id), {
              email: matchedEmail,
            })
            count++
          } catch (e) {
            console.error(`Failed to update ${d.id}:`, e)
            setErrors((prev) => [...prev, `Failed to update ${d.id}`])
          }
        }
      }

      setUpdatedCount(count)
    } catch (err) {
      console.error('Sync failed:', err)
      setErrors(['Failed to load documents. Check console.'])
    }

    setUpdating(false)
  }

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow rounded">
      <h1 className="text-xl font-bold mb-4">Sync Missing Emails</h1>
      <button
        onClick={syncEmails}
        disabled={updating}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        {updating ? 'Syncing...' : 'Start Sync'}
      </button>
      <div className="mt-4 text-sm text-gray-800">
        {updatedCount > 0 && <p>✅ Updated {updatedCount} record(s).</p>}
        {errors.length > 0 && (
          <div className="text-red-600">
            <p>❌ Errors:</p>
            <ul className="list-disc ml-5">
              {errors.map((e, i) => (
                <li key={i}>{e}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  )
}
