'use client';

import { useEffect, useState } from 'react';
import {
  collection,
  getDocs,
  Timestamp,
} from 'firebase/firestore';
import { db } from '@/lib/firebaseConfig';

type OrderDummyEntry = {
  id: string;
  customerName: string;
  cleanedName: string;
  email: string;
  createdAt: Timestamp | string;
};

export default function FixMissingEmailsInOrderMasterDummy() {
  const [data, setData] = useState<OrderDummyEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrderMasterDummy = async () => {
      try {
        const snapshot = await getDocs(collection(db, 'orderMasterDummy'));
        const filtered = snapshot.docs
          .map((doc) => {
            const d = doc.data();
            const email = d.email ?? '';
            const customerName = d.customerName ?? '';
            const cleanedName = customerName.replace(/\s+/g, '');

            return {
              id: doc.id,
              email,
              customerName,
              cleanedName,
              createdAt: d.createdAt,
            };
          })
          .filter(
            (entry) =>
              !entry.email || entry.email === 'N/A' || entry.email === 'n/a'
          );

        setData(filtered);
      } catch (err) {
        console.error('Error fetching orderMasterDummy:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrderMasterDummy();
  }, []);

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-2xl font-bold text-blue-700 mb-4">
        Missing Email Entries from orderMasterDummy
      </h1>
      <p className="mb-4 text-sm text-gray-600">
        Total entries with missing email: <strong>{data.length}</strong>
      </p>

      {loading ? (
        <p>Loading...</p>
      ) : data.length === 0 ? (
        <p>No missing email entries found.</p>
      ) : (
        <table className="min-w-full table-auto text-sm text-left border border-gray-300">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 border">Customer Name</th>
              <th className="px-4 py-2 border">Cleaned Name</th>
              <th className="px-4 py-2 border">Email</th>
              <th className="px-4 py-2 border">Created At</th>
            </tr>
          </thead>
          <tbody>
            {data.map((entry) => (
              <tr key={entry.id} className="hover:bg-gray-50 border-t">
                <td className="px-4 py-2 border">{entry.customerName}</td>
                <td className="px-4 py-2 border">{entry.cleanedName}</td>
                <td className="px-4 py-2 border">{entry.email}</td>
                <td className="px-4 py-2 border">
                  {entry.createdAt instanceof Timestamp
                    ? entry.createdAt.toDate().toLocaleString('en-IN')
                    : entry.createdAt ?? '-'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
