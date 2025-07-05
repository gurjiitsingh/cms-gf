'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';

export default function CampaignDetailPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const campaignkey = searchParams.get('campaignkey');

  const [campaign, setCampaign] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!campaignkey) return;

    const fetchCampaignDetail = async () => {
      setLoading(true);
      try {
        const res = await fetch('/api/zoho/campaign/detail', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ campaignkey }),
        });

        const data = await res.json();
        if (res.ok) setCampaign(data);
        else setError(data.error || 'Failed to fetch campaign detail');
      } catch (err: any) {
        setError('Network error');
      } finally {
        setLoading(false);
      }
    };

    fetchCampaignDetail();
  }, [campaignkey]);

  const formatDate = (ts: string) => {
    const date = new Date(Number(ts));
    return isNaN(date.getTime()) ? 'N/A' : date.toLocaleString();
  };

  const details = campaign?.['campaign-details']?.[0];

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Campaign Details</h1>
        <button
          onClick={() => router.push('/campaigns/recent-campaigns')}
          className="text-orange-600 hover:underline text-sm"
        >
          ← Back to Campaigns
        </button>
      </div>

      {loading && <p>Loading campaign details...</p>}
      {error && <p className="text-red-600">{error}</p>}

      {details && (
        <div className="bg-white p-6 rounded-lg shadow space-y-4">
          <div className="text-lg font-semibold text-gray-700">
            {details.campaign_name}
          </div>

          <div className="text-sm text-gray-600">
            <p><strong>Status:</strong> {campaign.campaign_status}</p>
            <p><strong>Subject:</strong> {details.email_subject}</p>
            <p><strong>From Email:</strong> {details.email_from}</p>
            <p><strong>Sender Name:</strong> {details.sender_name}</p>
            <p><strong>Created On:</strong> {details.created_date_string || formatDate(details.created_time)}</p>
          </div>

          {details.campaign_preview && (
            <div className="mt-4">
              <a
                href={`https://${details.campaign_preview}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-orange-500 hover:underline"
              >
                🔍 View Campaign Preview
              </a>
            </div>
          )}
        </div>
      )}

      {campaign?.associated_mailing_lists?.length > 0 && (
        <div className="bg-white p-6 rounded-lg shadow space-y-4">
          <h2 className="text-lg font-semibold text-gray-700">Associated Lists</h2>
          <table className="w-full text-sm text-left border mt-2">
            <thead className="bg-gray-100 text-gray-600">
              <tr>
                <th className="py-2 px-3 border-b">List Name</th>
                <th className="py-2 px-3 border-b">Contacts</th>
                <th className="py-2 px-3 border-b">Unsubscribed</th>
                <th className="py-2 px-3 border-b">Bounced</th>
              </tr>
            </thead>
            <tbody>
              {campaign.associated_mailing_lists.map((list: any, idx: number) => (
                <tr key={idx} className="border-t">
                  <td className="py-2 px-3">{list.listname}</td>
                  <td className="py-2 px-3">{list.contactscount}</td>
                  <td className="py-2 px-3">{list.no_of_unsubcontacts}</td>
                  <td className="py-2 px-3">{list.no_of_bounce}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
