'use client'

import { useState } from 'react'
import { db } from '@/lib/firebaseConfig'
import {
  collection,
  getDocs,
  query,
  where,
  doc,
  getDoc,
} from 'firebase/firestore'
import { addressResT } from '@/lib/types/addressType'

export default function SearchAddressExtended() {
  const [searchTerm, setSearchTerm] = useState('')
  const [searchBy, setSearchBy] = useState('email')
  const [results, setResults] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [notFound, setNotFound] = useState(false)

  const handleSearch = async () => {
    setLoading(true)
    setNotFound(false)
    setResults([])

    try {
      if (searchBy === 'docId') {
        const docRef = doc(db, 'address', searchTerm.trim())
        const docSnap = await getDoc(docRef)
        if (docSnap.exists()) {
          setResults([{ id: docSnap.id, ...(docSnap.data() as addressResT) }])
        } else {
          setNotFound(true)
        }
      } else {
        const q = query(
          collection(db, 'address'),
          where(searchBy, '==', searchTerm.trim())
        )
        const querySnapshot = await getDocs(q)
        if (querySnapshot.empty) {
          setNotFound(true)
        } else {
          const data: any[] = []
          querySnapshot.forEach(doc => {
            data.push({ id: doc.id, ...(doc.data() as addressResT) })
          })
          setResults(data)
        }
      }
    } catch (error) {
      console.error('Search error:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-5xl mx-auto p-6 bg-white rounded shadow space-y-6">
      <h1 className="text-xl font-semibold">Search Address Records (Extended)</h1>

      <div className="flex flex-wrap gap-4 items-end">
        <div>
          <label className="block text-sm font-medium">Search By</label>
          <select
            value={searchBy}
            onChange={e => setSearchBy(e.target.value)}
            className="border p-2 rounded w-48"
          >
            <option value="email">Email</option>
            <option value="firstName">First Name</option>
            <option value="lastName">Last Name</option>
            <option value="userId">User ID</option>
            <option value="docId">Address Document ID</option>
            <option value="mobNo">Phone Number</option>
          </select>
        </div>

        <div className="flex-1">
          <label className="block text-sm font-medium">Search Term</label>
          <input
            type="text"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="border p-2 rounded w-full"
            placeholder="Enter search value"
          />
        </div>

        <button
          onClick={handleSearch}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Search
        </button>
      </div>

      {loading && <p>Searching...</p>}
      {notFound && <p className="text-red-600">No matching records found.</p>}

      {results.length > 0 && (
        <div className="overflow-x-auto border rounded mt-4">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-3 py-2 border">Email</th>
                <th className="px-3 py-2 border">First Name</th>
                <th className="px-3 py-2 border">Last Name</th>
                <th className="px-3 py-2 border">User ID</th>
                <th className="px-3 py-2 border">Address ID</th>
                <th className="px-3 py-2 border">Phone</th>
               
              </tr>
            </thead>
          
              {results.map((item, idx) => (
                <tr key={idx} className="hover:bg-gray-50">
                  <td className="px-3 py-2 border">{item.email}</td>
                  <td className="px-3 py-2 border">{item.firstName}</td>
                  <td className="px-3 py-2 border">{item.lastName}</td>
                  <td className="px-3 py-2 border">{item.userId ?? '-'}</td>
                  <td className="px-3 py-2 border">{item.id}</td>
                  <td className="px-3 py-2 border">{item.mobNo}</td>
                 </tr>
              ))}
           
          </table>
        </div>
      )}
    </div>
  )
}
