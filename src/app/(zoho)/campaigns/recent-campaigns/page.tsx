'use client';

import { useEffect, useState } from 'react';
import { Mail, Send, Copy, MoreHorizontal, Plus } from 'lucide-react';
import Link from 'next/link';

export default function RecentCampaignsPage() {
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchCampaigns();
  }, []);

  const fetchCampaigns = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/zoho/recentCampaigns', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'all', sort: 'desc', range: 10 }),
      });

      const data = await res.json();
   //   console.log("data--------------", data)
      if (!res.ok) throw new Error(data.error || 'Unknown error');
      setCampaigns(data.campaigns.recent_campaigns || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
console.log("campaigns---------------", campaigns)
  // const formatDateTime = (dateStr: string) => {
  //   if (!dateStr) return 'N/A';
  //   const parsed = new Date(dateStr);
  //   return parsed.toLocaleString(undefined, {
  //     day: '2-digit',
  //     month: 'short',
  //     year: 'numeric',
  //     hour: '2-digit',
  //     minute: '2-digit',
  //   });
  // };


  const formatDateTime = (input: string | number) => {
  if (!input) return 'N/A';

  // Convert to number if it's a string
  const timestamp = typeof input === 'string' ? parseInt(input, 10) : input;

  const parsed = new Date(timestamp);

  if (isNaN(parsed.getTime())) return 'Invalid Date';

  return parsed.toLocaleString(undefined, {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

  return (
    <div id="campaignListView" className="max-w-6xl mx-auto p-6">
      <div id="campaignAdvLstView" className="wlstcntr">
        {/* Header with Create Button */}
        <div className="mb-6 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-orange-600">Recent Campaigns</h1>
          <Link
            href="/campaigns/create-campaign"
            className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-semibold px-4 py-2 rounded"
          >
            <Plus className="w-4 h-4" />
            Create Campaign
          </Link>
        </div>

        {error && <div className="text-red-600 mb-4">{error}</div>}

        <div id="advcampaignListView">
          {campaigns.length > 0 ? (
            <ul className="space-y-3">
              {campaigns.map((c, idx) => {
                const status = c.campaign_status;
                const isSent = status === 'Sent';
                const statusColor = isSent ? 'bg-green-500' : 'bg-slate-400';
               const statusText = isSent
  ? `Sent: ${c.sent_date_string || formatDateTime(c.sent_time)}`
  : `Draft: ${c.created_date_string || formatDateTime(c.created_time)}`;

                return (
                  <li
                    key={idx}
                    className="border rounded-md bg-gray-50 hover:bg-gray-100 p-4 flex justify-between items-start shadow-sm"
                  >
                    {/* Left: Icon */}
                    <div className="flex items-center mr-4">
                      <Mail className="w-8 h-8 text-orange-400" />
                    </div>

                    {/* Middle: Campaign Info */}
                    <div className="flex-1">
                      <div className="text-lg font-semibold text-gray-800">
                        {c.campaign_name || 'Untitled Campaign'}
                      </div>

                      <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                        <span className={`w-3 h-3 rounded-sm ${statusColor}`} />
                        <span>{statusText}</span>
                      </div>
                    </div>

                    {/* Right: Actions */}
                    <div className="flex items-center space-x-3 text-sm text-gray-500">
                      <Link
                        href={`/campaigns/send-campaign?campaignkey=${c.campaign_key}`}
                        className="flex items-center gap-1 text-orange-600 hover:underline"
                      >
                        <Send className="w-4 h-4" /> Send
                      </Link>

                      <button className="flex items-center gap-1 text-orange-600 hover:underline">
                        <Copy className="w-4 h-4" /> Copy
                      </button>

                      <div className="relative group">
                        <MoreHorizontal className="w-5 h-5 cursor-pointer text-gray-400 hover:text-gray-600" />
                        <div className="hidden group-hover:block absolute right-0 mt-2 bg-white border rounded shadow p-2 space-y-1 z-10">
                          <button className="block text-sm hover:text-orange-500">Edit</button>
                          <button className="block text-sm hover:text-red-500">Delete</button>
                        </div>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          ) : (
            <p className="text-gray-500 text-sm">No campaigns found.</p>
          )}
        </div>
      </div>
    </div>
  );
}
