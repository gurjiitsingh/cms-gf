'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';

export default function SendCampaignPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const campaignKey = searchParams.get('campaignkey');
  const campaignName = searchParams.get('name');
  const campaignSubject = searchParams.get('subject');
  const campaignStatus = searchParams.get('status');
  const createdDate = searchParams.get('date');

  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  // Load from localStorage (optional)
  useEffect(() => {
    const stored = localStorage.getItem('campaign_result');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (parsed?.campaignKey === campaignKey) {
          setResponse(parsed);
        }
      } catch (err) {
        console.error('Failed to parse stored campaign_result:', err);
      }
    }
  }, [campaignKey]);

  const handleSend = async () => {
    if (!campaignKey) {
      setError('No campaign key found in URL');
      return;
    }

    setLoading(true);
    setError(null);
    setResponse(null);

    try {
      const res = await fetch('/api/zoho/sendCampaign', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ campaignkey: campaignKey }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to send');

      setResponse(data.result);
      localStorage.setItem('campaign_result', JSON.stringify(data.result));
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => {
    if (campaignKey) {
      router.push(`/zoho/edit-campaign/${campaignKey}`);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6">
      <h1 className="text-2xl font-bold text-orange-600 mb-4">Send Campaign</h1>

      {!campaignKey ? (
        <p className="text-red-500">Campaign key not found in URL.</p>
      ) : (
        <>
          {/* Show prefilled info from URL */}
       <div className="mb-4 bg-white p-4 border rounded-md text-sm space-y-2 text-gray-700">
  <h2 className="text-base font-semibold mb-2">Campaign Info</h2>
  {campaignName && (
    <div className="flex justify-between">
      <span className="font-medium">Name:</span>
      <span>{campaignName}</span>
    </div>
  )}
  {campaignSubject && (
    <div className="flex justify-between">
      <span className="font-medium">Subject:</span>
      <span>{campaignSubject}</span>
    </div>
  )}
  {campaignStatus && (
    <div className="flex justify-between">
      <span className="font-medium">Status:</span>
      <span>{campaignStatus}</span>
    </div>
  )}
  {createdDate && (
    <div className="flex justify-between">
      <span className="font-medium">Created:</span>
      <span>{new Date(createdDate).toLocaleString()}</span>
    </div>
  )}
</div>


          {!response && (
            <div className="flex gap-4 mb-4">
              <button
                onClick={handleSend}
                disabled={loading}
                className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600"
              >
                {loading ? 'Sending...' : 'Send Campaign'}
              </button>

              {/* <button
                onClick={handleEdit}
                className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
              >
                Edit Campaign
              </button> */}
            </div>
          )}

          {response && (
            <div className="mt-4 bg-green-50 border border-green-200 p-4 rounded text-sm space-y-2">
              <h2 className="text-lg font-semibold text-green-700">✅ Full Campaign Response</h2>
              {Object.entries(response).map(([key, value]) => (
                <p key={key}>
                  <strong className="capitalize">{key.replace(/_/g, ' ')}:</strong>{' '}
                  {typeof value === 'string' && value.match(/^\d{4}-\d{2}-\d{2}T/)
                    ? new Date(value).toLocaleString()
                    : String(value)}
                </p>
              ))}
            </div>
          )}

          <Link
            href="/campaigns/recent-campaigns"
            className="inline-block mt-6 text-orange-500 hover:underline"
          >
            ← Back to Recent Campaigns
          </Link>
        </>
      )}

      {error && <p className="text-red-600 mt-3">{error}</p>}
    </div>
  );
}
