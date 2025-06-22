'use client'

import { useState } from 'react'
import { db } from '@/lib/firebaseConfig'
import {
  collection,
  getDocs,
  doc,
  getDoc,
  updateDoc,
} from 'firebase/firestore'

type AddressData = {
  email?: string
  firstName?: string
  lastName?: string
}

type OrderData = {
  id: string
  email?: string
  addressId?: string
}

export default function FilteredAddressList() {
  const [filteredAddresses, setFilteredAddresses] = useState<AddressData[]>([])
  const [loading, setLoading] = useState(false)

  const handleStart = async () => {
    setLoading(true)

    const orderSnap = await getDocs(collection(db, 'orderMaster'))

    const allOrders: OrderData[] = orderSnap.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as OrderData[]

    const filteredOrders = allOrders.filter(
      (order) =>
        order.email === undefined ||
        order.email === null ||
        order.email === ''
    )

    const results: AddressData[] = []

    for (const order of filteredOrders) {
      const addressId = order.addressId
      if (!addressId) continue

      const addressRef = doc(db, 'address', addressId)
      const addressSnap = await getDoc(addressRef)

      if (addressSnap.exists()) {
        const data = addressSnap.data()
        const addressEmail = data?.email?.trim()

        // Add to result list
        results.push({
          email: addressEmail || '',
          firstName: data?.firstName || '',
          lastName: data?.lastName || '',
        })

        // ✅ Update orderMaster doc
        if (addressEmail && addressEmail.toLowerCase() !== '') {
          const orderRef = doc(db, 'orderMaster', order.id)
          await updateDoc(orderRef, {
            email: addressEmail,
          })
        }
      }
    }

    setFilteredAddresses(results)
    setLoading(false)
  }

  return (
    <div className="p-4">
      <button
        onClick={handleStart}
        className="mb-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded"
        disabled={loading}
      >
        {loading ? 'Updating...' : 'Start'}
      </button>

      {filteredAddresses.length > 0 && (
        <>
          <h2 className="text-xl font-bold mb-4">
            Updated Orders With Missing Email
          </h2>
          <table className="w-full border border-gray-300 text-sm">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-2 border">Email</th>
                <th className="p-2 border">First Name</th>
                <th className="p-2 border">Last Name</th>
              </tr>
            </thead>
            <tbody>
              {filteredAddresses.map((a, i) => (
                <tr key={i}>
                  <td className="p-2 border">{a.email || 'Missing'}</td>
                  <td className="p-2 border">{a.firstName}</td>
                  <td className="p-2 border">{a.lastName}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </div>
  )
}
