'use client';

import {  useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";

export default function SendCampaignPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const campaignKey = searchParams.get("campaignkey");

  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSend = async () => {
    if (!campaignKey) {
      setError("No campaign key found in URL");
      return;
    }

    setLoading(true);
    setError(null);
    setResponse(null);

    try {
      const res = await fetch("/api/zoho/sendCampaign", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ campaignkey: campaignKey }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to send");

      setResponse(data.result);
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
      <h1 className="text-2xl font-bold text-orange-600 mb-4">Send Zoho Campaign</h1>

      {!campaignKey ? (
        <p className="text-red-500">Campaign key not found in URL.</p>
      ) : (
        <>
          {!response && (
            <div className="flex gap-4 mb-4">
              <button
                onClick={handleSend}
                disabled={loading}
                className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600"
              >
                {loading ? "Sending..." : "Send Campaign"}
              </button>

              <button
                onClick={handleEdit}
                className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
              >
                Edit Campaign
              </button>
            </div>
          )}

          {response && (
            <div className="mt-4">
              <h2 className="text-xl font-semibold text-green-600 mb-2">Campaign Sent Successfully</h2>
              <pre className="bg-gray-100 p-3 rounded text-sm overflow-auto max-h-80">
                {JSON.stringify(response, null, 2)}
              </pre>
            </div>
          )}

          <Link
            href="/recent-campaigns"
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
