'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';

type CampaignStats = {
  id: number;
  name: string;
  subject: string;
  status: string;
  scheduledAt?: string;
  sentDate?: string;
  statistics?: {
    delivered: number;
    uniqueViews: number;
    clickers: number;
    complaints: number;
    hardBounces: number;
    softBounces: number;
    unsubscriptions: number;
  };
};

export default function CampaignStatsPage() {
  const { id } = useParams(); // Read campaign ID from the URL
  const [campaign, setCampaign] = useState<CampaignStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCampaign = async () => {
      if (!id) return;
      setError(null);
      setLoading(true);
console.log("id----------", id)
      try {
        const res = await fetch(`/api/brevo/campaigns/${id}`);
        if (!res.ok) throw new Error('Failed to fetch campaign');

        const data = await res.json();
        console.log("data--------",data)
        setCampaign(data);
      } catch (err: any) {
        setError(err.message || 'Something went wrong');
      } finally {
        setLoading(false);
      }
    };

    fetchCampaign();
  }, [id]);

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold text-green-700 mb-4">📊 Campaign Details</h1>

      {loading && <p className="text-gray-600">Loading campaign...</p>}
      {error && <p className="text-red-600 mb-4">Error: {error}</p>}

      {campaign && (
        <div className="bg-white border border-gray-200 rounded p-6 shadow space-y-2">
          <p><strong>ID:</strong> {campaign.id}</p>
          <p><strong>Name:</strong> {campaign.name}</p>
          <p><strong>Subject:</strong> {campaign.subject}</p>
          <p><strong>Status:</strong> {campaign.status}</p>
          {campaign.sentDate && <p><strong>Sent:</strong> {campaign.sentDate}</p>}
          {campaign.scheduledAt && <p><strong>Scheduled:</strong> {campaign.scheduledAt}</p>}

          {campaign.statistics && (
            <div className="mt-4">
              <h2 className="text-lg font-semibold text-green-800 mb-2">Statistics</h2>
              <div className="grid grid-cols-2 gap-4 text-sm text-gray-800">
                <p>✅ Delivered: {campaign.statistics.delivered}</p>
                <p>👁️ Unique Views: {campaign.statistics.uniqueViews}</p>
                <p>🖱️ Clickers: {campaign.statistics.clickers}</p>
                <p>📤 Unsubscribed: {campaign.statistics.unsubscriptions}</p>
                <p>⚠️ Complaints: {campaign.statistics.complaints}</p>
                <p>❌ Hard Bounces: {campaign.statistics.hardBounces}</p>
                <p>⚠️ Soft Bounces: {campaign.statistics.softBounces}</p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
