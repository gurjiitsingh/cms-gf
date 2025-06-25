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

import Link from 'next/link'
import { Plus } from 'lucide-react'
import { addressResT } from '@/lib/types/addressType'

export default function SearchAddress() {
  const [searchTerm, setSearchTerm] = useState('')
  const [searchBy, setSearchBy] = useState('email')
  const [results, setResults] = useState<addressResT[]>([])
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
          setResults([{ ...(docSnap.data() as addressResT) }])
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
          const data: addressResT[] = []
          querySnapshot.forEach(doc => {
            data.push(doc.data() as addressResT)
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
    <div className="max-w-4xl mx-auto p-6 bg-white rounded shadow space-y-6">
    
       <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-semibold">
          Search Address 
        </h1>
        <Link
          href="/users/address-search/advance"
          className="inline-flex items-center gap-2 text-sm px-3 py-1.5 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          <Plus className="w-4 h-4" />
         Advance
        </Link>
      </div>

      <div className="flex gap-4 items-end flex-wrap">
        <div className="flex flex-col">
          <label className="text-sm font-medium">Search By</label>
          <select
            value={searchBy}
            onChange={e => setSearchBy(e.target.value)}
            className="border p-2 rounded"
          >
            <option value="email">Email</option>
            <option value="firstName">First Name</option>
            <option value="lastName">Last Name</option>
            <option value="mobNo">Phone</option>
            <option value="addressLine1">Address Line 1</option>
            <option value="docId">Document ID</option>
          </select>
        </div>

        <div className="flex-1 flex flex-col">
          <label className="text-sm font-medium">Search Term</label>
          <input
            type="text"
            className="border p-2 rounded w-full"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="Enter value..."
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
      {notFound && <p className="text-red-600">No records found.</p>}

      {results.length > 0 && (
        <div className="overflow-x-auto border rounded mt-4">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-3 py-2 border">Email</th>
                <th className="px-3 py-2 border">First Name</th>
                <th className="px-3 py-2 border">Last Name</th>
                <th className="px-3 py-2 border">Phone</th>
                <th className="px-3 py-2 border">Address</th>
                <th className="px-3 py-2 border">City</th>
                <th className="px-3 py-2 border">State</th>
                <th className="px-3 py-2 border">Zip Code</th>
              </tr>
            </thead>
            <tbody>
              {results.map((item, idx) => (
                <tr key={idx} className="hover:bg-gray-50">
                  <td className="px-3 py-2 border">{item.email}</td>
                  <td className="px-3 py-2 border">{item.firstName}</td>
                  <td className="px-3 py-2 border">{item.lastName}</td>
                  <td className="px-3 py-2 border">{item.mobNo}</td>
                  <td className="px-3 py-2 border">
                    {item.addressLine1} {item.addressLine2}
                  </td>
                  <td className="px-3 py-2 border">{item.city}</td>
                  <td className="px-3 py-2 border">{item.state}</td>
                  <td className="px-3 py-2 border">{item.zipCode}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
