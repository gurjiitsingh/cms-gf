'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

type Campaign = {
  id: number;
  name: string;
  subject: string;
  scheduledAt: string;
  status: string;
};

export default function CampaignsPage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        const res = await fetch('/api/brevo/campaigns');
        const data = await res.json();
        setCampaigns(data.campaigns || []);
      } catch (error) {
        console.error('Error loading campaigns:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCampaigns();
  }, []);

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold text-green-700 mb-6">📬 Email Campaigns</h1>

      {loading ? (
        <p className="text-gray-600">Loading campaigns...</p>
      ) : campaigns.length === 0 ? (
        <p className="text-red-600">No campaigns found.</p>
      ) : (
        <div className="overflow-x-auto shadow border border-gray-200 rounded-lg">
          <table className="min-w-full table-auto text-sm text-left">
            <thead className="bg-green-50 border-b">
              <tr>
                <th className="px-4 py-3">ID</th>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Subject</th>
                <th className="px-4 py-3">Scheduled At</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-center">View</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {campaigns.map((c) => (
                <tr key={c.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-2">{c.id}</td>
                  <td className="px-4 py-2">{c.name}</td>
                  <td className="px-4 py-2">{c.subject}</td>
                  <td className="px-4 py-2">{c.scheduledAt || '-'}</td>
                  <td className="px-4 py-2 capitalize">{c.status}</td>
                  <td className="px-4 py-2 text-center">
                    <Link
                      href={`/campaigns-sent/${c.id}`}
                      className="text-green-700 underline hover:text-green-900 transition"
                    >
                      Stats →
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
