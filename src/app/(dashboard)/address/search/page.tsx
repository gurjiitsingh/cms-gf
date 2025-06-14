'use client';

import { useState } from 'react';
import {
  collection,
  getDocs,
  query,
  where,
} from 'firebase/firestore';
import { db } from '@/lib/firebaseConfig';

type Address = {
  addressLine1?: string;
  addressLine2?: string;
  city?: string;
  email: string;
  firstName?: string;
  lastName?: string;
  mobNo?: string;
  state?: string;
  userId?: string;
  zipCode?: string;
};

export default function AddressSearchByEmail() {
  const [email, setEmail] = useState('');
  const [results, setResults] = useState<Address[]>([]);
  const [loading, setLoading] = useState(false);
  const [notFound, setNotFound] = useState(false);

  const handleSearch = async () => {
    if (!email.trim()) return;
    setLoading(true);
    setResults([]);
    setNotFound(false);

    try {
      const q = query(
        collection(db, 'address'),
        where('email', '==', email.trim())
      );

      const snapshot = await getDocs(q);

      if (snapshot.empty) {
        setNotFound(true);
      } else {
        const data: Address[] = snapshot.docs.map((doc) => ({
          ...doc.data(),
        })) as Address[];

        setResults(data);
      }
    } catch (err) {
      console.error('Error fetching address:', err);
    }

    setLoading(false);
  };

  return (
    <div className="p-6 max-w-3xl mx-auto bg-white rounded shadow border">
      <h2 className="text-xl font-semibold mb-4">🔍 Search Address by Email</h2>

      <div className="flex flex-col sm:flex-row gap-2 mb-4">
        <input
          type="email"
          placeholder="Enter email"
          className="border px-3 py-2 rounded flex-1"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <button
          onClick={handleSearch}
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          {loading ? 'Searching...' : 'Search'}
        </button>
      </div>

      {notFound && (
        <p className="text-red-600">❌ No address found for this email.</p>
      )}

      {results.length > 0 && (
        <div className="mt-4 space-y-4">
          {results.map((address, idx) => (
            <div
              key={idx}
              className="border rounded p-4 bg-gray-50 text-sm space-y-1"
            >
              <p><strong>Name:</strong> {address.firstName} {address.lastName}</p>
              <p><strong>Email:</strong> {address.email}</p>
              <p><strong>Mobile:</strong> {address.mobNo}</p>
              <p><strong>Address:</strong> {address.addressLine1} {address.addressLine2}</p>
              <p><strong>City/State/ZIP:</strong> {address.city || '-'} / {address.state || '-'} / {address.zipCode}</p>
              <p><strong>User ID:</strong> {address.userId}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
