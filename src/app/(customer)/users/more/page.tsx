'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Plus } from 'lucide-react' // icon
import { userType } from '@/lib/types/userType'
import { fetchAllUsers } from '@/lib/firebase/functions/userFunctions'

export default function CustomerTable() {
  const [customers, setCustomers] = useState<userType[]>([])
  const [filteredCustomers, setFilteredCustomers] = useState<userType[]>([])
  const [loading, setLoading] = useState(false)
  const [search, setSearch] = useState('')
  const [searchBy, setSearchBy] = useState<'name' | 'email'>('email')

  useEffect(() => {
    if (search.trim() === '') {
      setFilteredCustomers([])
      return
    }

    const searchCustomers = async () => {
      setLoading(true)
      try {
        const users = customers.length ? customers : await fetchAllUsers()
        if (customers.length === 0) setCustomers(users)

        const lowerSearch = search.toLowerCase()

        const filtered = users.filter((c) => {
          if (searchBy === 'name') return c.username?.toLowerCase().includes(lowerSearch)
          if (searchBy === 'email') return c.email?.toLowerCase().includes(lowerSearch)
          return false
        })

        setFilteredCustomers(filtered)
      } catch (error) {
        console.error('Failed to search users:', error)
      }
      setLoading(false)
    }

    searchCustomers()
  }, [search, searchBy])

  return (
    <div className="p-4 max-w-6xl mx-auto bg-white shadow rounded-lg">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-semibold">
          Customers 
        </h1>
        <Link
          href="/users/duplicate"
          className="inline-flex items-center gap-2 text-sm px-3 py-1.5 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          <Plus className="w-4 h-4" />
          Duplicate
        </Link>
         <Link
          href="/users/full-list"
          className="inline-flex items-center gap-2 text-sm px-3 py-1.5 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          <Plus className="w-4 h-4" />
          Full List
        </Link>
          <Link
          href="/users/by-id"
          className="inline-flex items-center gap-2 text-sm px-3 py-1.5 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          <Plus className="w-4 h-4" />
          Seach by id
        </Link>
      </div>

      
    </div>
  )
}
