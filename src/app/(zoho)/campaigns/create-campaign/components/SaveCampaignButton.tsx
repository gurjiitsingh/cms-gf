import { useState } from "react";
import { useAppContext } from "@/context/AppContext";
import { useRouter } from "next/navigation";

export default function SaveCampaignButton() {
  const { contactListForCampaign, templateUrl, campaignInfo } = useAppContext();
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<any>(null);
  const router = useRouter();

  const handleSubmit = async () => {
    const campaignname = campaignInfo?.campaignName;
    const subject = campaignInfo?.campaignSubject;
    const content_url = templateUrl;
    const topicId = "264060000000019017";

    if (!campaignname || !subject || !content_url) {
      alert("Missing campaign details. Please complete the setup.");
      return;
    }

    const list_details: Record<string, string[]> = {};
    contactListForCampaign.forEach(item => {
      list_details[item.list_key] = [];
    });

    const payload = {
      campaignname,
      from_email: "info@athenasgrill.de",
      subject,
      content_url,
      list_details,
      topicId,
    };

    try {
      setLoading(true);
      const res = await fetch("/api/zoho/createCampaign", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
   //   setResponse(data.result);
    //  alert("✅ Campaign created successfully.");

      // 👇 Redirect to send-campaign page with campaign key
      if (data.success && data.result?.campaignKey) {
   //     router.push(`/campaigns/send-campaign?campaignkey=${data.result.campaignKey}`);
const { campaignKey, campaign_name, campaign_subject, campaign_status, created_date } = data.result;

router.push(
  `/campaigns/create-campaign/send-campaign?campaignkey=${encodeURIComponent(campaignKey)}&name=${encodeURIComponent(campaign_name)}&subject=${encodeURIComponent(campaign_subject)}&status=${encodeURIComponent(campaign_status)}&date=${encodeURIComponent(created_date)}`
);
      }

    } catch (err) {
      console.error("Error:", err);
      alert("❌ Failed to create campaign.");
    }
  };

  return (
    <div className="my-4">
      <button
        onClick={handleSubmit}
        disabled={loading}
        className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded w-full"
      >
        {loading ? "Saving..." : "Save Campaign"}
      </button>

      {response && (
        <div className="mt-4 bg-gray-100 p-4 rounded text-sm space-y-1 text-gray-800">
          <p><strong>✅ Message:</strong> {response.message || 'Success'}</p>
          <p><strong> Campaign Name:</strong> {response.campaign_name}</p>
          <p><strong> Subject:</strong> {response.campaign_subject}</p>
          <p><strong> Status:</strong> {response.campaign_status}</p>
          <p><strong>📅 Created:</strong> {new Date(response.created_date).toLocaleString()}</p>
        </div>
      )}
    </div>
  );
}
