'use client';

import { useEffect, useState } from 'react';
import { collection, getDocs, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebaseConfig';

type GoogleVisitor = {
  id: string;
  utm_source: string;
  utm_medium: string;
  utm_campaign: string;
  utm_content: string;
  createdAt: Timestamp | string;
};

export default function GoogleAdsVisitorsTable() {
  const [visitors, setVisitors] = useState<GoogleVisitor[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGoogleVisitors = async () => {
      try {
        const snapshot = await getDocs(collection(db, 'googleVisitors'));

        const filtered = snapshot.docs
          .map((doc) => {
            const d = doc.data();
            return {
              id: doc.id,
              utm_source: d.utm_source ?? '',
              utm_medium: d.utm_medium ?? '',
              utm_campaign: d.utm_campaign ?? '',
              utm_content: d.utm_content ?? '',
              createdAt: d.createdAt ?? '',
            };
          })
          .filter((entry) => entry.utm_source?.toLowerCase() === 'google');

        setVisitors(filtered);
      } catch (error) {
        console.error('Error fetching google visitors:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchGoogleVisitors();
  }, []);

  const formatDate = (val: Timestamp | string) => {
    if (val instanceof Timestamp) {
      return val.toDate().toLocaleString('en-IN');
    }
    if (typeof val === 'string' && !isNaN(Date.parse(val))) {
      return new Date(val).toLocaleString('en-IN');
    }
    return 'Invalid date';
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-2xl font-bold text-blue-700 mb-4">Google Ads Visitors</h1>

      {loading ? (
        <p>Loading...</p>
      ) : visitors.length === 0 ? (
        <p>No Google Ads visitors found.</p>
      ) : (
        <div className="overflow-auto border rounded">
          <table className="min-w-full table-auto text-sm text-left border-collapse border border-gray-300">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2 border">UTM Source</th>
                <th className="px-4 py-2 border">UTM Medium</th>
                <th className="px-4 py-2 border">UTM Campaign</th>
                <th className="px-4 py-2 border">UTM Content</th>
                <th className="px-4 py-2 border">Created At</th>
              </tr>
            </thead>
            <tbody>
              {visitors.map((visitor) => (
                <tr key={visitor.id} className="hover:bg-gray-50">
                  <td className="px-4 py-2 border">{visitor.utm_source}</td>
                  <td className="px-4 py-2 border">{visitor.utm_medium}</td>
                  <td className="px-4 py-2 border">{visitor.utm_campaign}</td>
                  <td className="px-4 py-2 border">{visitor.utm_content}</td>
                  <td className="px-4 py-2 border">{formatDate(visitor.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
