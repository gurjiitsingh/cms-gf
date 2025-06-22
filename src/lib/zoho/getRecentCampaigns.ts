// lib/zoho/getRecentCampaigns.ts

import axios from "axios";

/**
 * Fetch recent campaigns from Zoho Campaigns
 * @param oauthToken Zoho OAuth access token
 * @param options Optional filters for sorting, pagination, status etc.
 */
export async function getRecentCampaigns(
  oauthToken: string,
  options: {
    sort?: "asc" | "desc";
    fromindex?: number;
    range?: number;
    status?:
      | "all"
      | "all campaigns"
      | "drafts"
      | "scheduled"
      | "inprogress"
      | "sent"
      | "stopped"
      | "canceled"
      | "tobereviewed"
      | "reviewed"
      | "paused"
      | "intesting";
  } = {}
) {
  try {
    const res = await axios.get(
      "https://campaigns.zoho.in/api/v1.1/recentcampaigns",
      {
        headers: {
          Authorization: `Zoho-oauthtoken ${oauthToken}`,
        },
        params: {
          resfmt: "JSON",
          sort: options.sort || "desc",
          fromindex: options.fromindex || 1,
          range: options.range || 50,
          status: options.status || "all",
        },
      }
    );

   // console.log("✅ Recent Campaigns Response:", res.data);
    return res.data;
  } catch (error: any) {
    console.error("❌ Zoho API Error (Recent Campaigns):", error.response?.data || error.message);
    throw error;
  }
}
