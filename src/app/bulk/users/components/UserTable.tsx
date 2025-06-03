'use client'

import { useEffect, useState } from 'react'
import { userType } from '@/lib/types/userType'
import { fetchPaginatedUsers } from '@/lib/firebase/functions/userFunctions'

const PAGE_SIZE = 10

export default function CustomerTable() {
  const [customers, setCustomers] = useState<userType[]>([])
  const [lastVisible, setLastVisible] = useState<any>(null)
  const [page, setPage] = useState(1)
  const [hasNext, setHasNext] = useState(false)
  const [hasPrev, setHasPrev] = useState(false)
  const [prevStack, setPrevStack] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadCustomers()
  }, [])

  const loadCustomers = async (direction: 'next' | 'prev' | 'init' = 'init') => {
    setLoading(true)
    try {
      const { users, lastDoc, hasMore } = await fetchPaginatedUsers(PAGE_SIZE, direction === 'next' ? lastVisible : null, direction === 'prev' ? prevStack[prevStack.length - 2] : null)

      setCustomers(users)
      setHasNext(hasMore)
      setHasPrev(prevStack.length > 1)

      if (direction === 'next') {
        setPrevStack((prev) => [...prev, lastDoc])
        setPage((p) => p + 1)
      } else if (direction === 'prev') {
        setPrevStack((prev) => prev.slice(0, -1))
        setPage((p) => p - 1)
      } else {
        setPrevStack([lastDoc])
        setPage(1)
      }

      setLastVisible(lastDoc)
    } catch (error) {
      console.error('Error loading customers:', error)
    }
    setLoading(false)
  }

  return (
    <div className="p-4 max-w-6xl mx-auto bg-white shadow rounded-lg">
      <h1 className="text-xl font-semibold mb-4">Customer List</h1>

      {loading ? (
        <p>Loading customers...</p>
      ) : customers.length === 0 ? (
        <p>No customers found.</p>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm text-left border border-gray-300">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-2 border">Customer Name</th>
                  <th className="px-4 py-2 border">Email</th>
                  <th className="px-4 py-2 border">Created Time</th>
                </tr>
              </thead>
              <tbody>
                {customers.map((customer) => (
                  <tr key={customer.id} className="hover:bg-gray-50">
                    <td className="px-4 py-2 border">{customer.username}</td>
                    <td className="px-4 py-2 border">{customer.email}</td>
                    <td className="px-4 py-2 border">{customer.time ?? '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex justify-between items-center mt-4 text-sm">
            <span>Page {page}</span>
            <div className="space-x-2">
              <button
                onClick={() => loadCustomers('prev')}
                disabled={!hasPrev}
                className="px-3 py-1 border rounded disabled:opacity-50"
              >
                Previous
              </button>
              <button
                onClick={() => loadCustomers('next')}
                disabled={!hasNext}
                className="px-3 py-1 border rounded disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
