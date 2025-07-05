'use client';

import { useEffect, useState } from "react";
import { Mail, Send, MoreHorizontal, Plus } from "lucide-react";
import Link from "next/link";

export default function RecentCampaignsPage() {
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [openMenuFor, setOpenMenuFor] = useState<string | null>(null);

  useEffect(() => {
    fetchCampaigns();
  }, []);

  const fetchCampaigns = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/zoho/recentCampaigns", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "all", sort: "desc", range: 10 }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Unknown error");
      setCampaigns(data.campaigns.recent_campaigns || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const formatDateTime = (input: string | number) => {
    if (!input) return "N/A";
    const timestamp = typeof input === "string" ? parseInt(input, 10) : input;
    const parsed = new Date(timestamp);
    return isNaN(parsed.getTime())
      ? "Invalid Date"
      : parsed.toLocaleString(undefined, {
          day: "2-digit",
          month: "short",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        });
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
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

      <div>
        {campaigns.length > 0 ? (
          <ul className="space-y-3">
            {campaigns.map((c, idx) => {
              const status = c.campaign_status;
              const isSent = status === "Sent";
              const statusColor = isSent ? "bg-green-500" : "bg-slate-400";
              const statusText = isSent
                ? `Sent: ${c.sent_date_string || formatDateTime(c.sent_time)}`
                : `Draft: ${
                    c.created_date_string || formatDateTime(c.created_time)
                  }`;

              return (
                <li
                  key={idx}
                  className="border rounded-md bg-gray-50 hover:bg-gray-100 p-4 flex justify-between items-start shadow-sm relative"
                >
                  {/* Left Icon */}
                  <div className="flex items-center mr-4">
                    <Mail className="w-8 h-8 text-orange-400" />
                  </div>

                  {/* Campaign Info */}
                  <div className="flex-1">
                    <div className="text-lg font-semibold text-gray-800">
                      {c.campaign_name || "Untitled Campaign"}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                      <span className={`w-3 h-3 rounded-sm ${statusColor}`} />
                      <span>{statusText}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center space-x-3 text-sm text-gray-500 relative">
                    {!isSent && (
                      <Link
                        href={`/campaigns/send-campaign?campaignkey=${c.campaign_key}`}
                        className="flex items-center gap-1 text-orange-600 hover:underline"
                      >
                        <Send className="w-4 h-4" /> Send
                      </Link>
                    )}

                    {/* 3-dot menu icon */}
                    <button
                      onClick={() =>
                        setOpenMenuFor((prev) =>
                          prev === c.campaign_key ? null : c.campaign_key
                        )
                      }
                      className="hover:text-gray-600"
                    >
                      <MoreHorizontal className="w-5 h-5 cursor-pointer" />
                    </button>

                    {/* Dropdown menu */}
                    {openMenuFor === c.campaign_key && (
                      <div className="absolute right-0 top-8 bg-white border rounded shadow p-2 space-y-1 z-10 w-32 text-left">
                        <Link
                          href={`/campaigns/detail?campaignkey=${c.campaign_key}`}
                          className="block text-sm text-gray-700 hover:text-orange-600"
                        >
                          Details
                        </Link>
                        <button className="block text-sm text-gray-700 hover:text-orange-600 w-full text-left">
                          Edit
                        </button>
                        <button className="block text-sm text-red-600 hover:text-red-700 w-full text-left">
                          Delete
                        </button>
                      </div>
                    )}
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
  );
}
