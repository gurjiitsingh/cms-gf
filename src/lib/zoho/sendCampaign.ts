// File: src/lib/zoho/sendCampaign.ts

import axios from "axios";
import qs from "qs";

export async function sendZohoCampaign(oauthToken: string, campaignKey: string) {
  try {
    const formData = qs.stringify({
      resfmt: "JSON",
      campaignkey: campaignKey,
    });

    const response = await axios.post(
      "https://campaigns.zoho.in/api/v1.1/sendcampaign",
      formData,
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: `Zoho-oauthtoken ${oauthToken}`,
        },
      }
    );

    return response.data;
  } catch (error: any) {
    console.error("❌ Zoho Send Campaign Error:", error.response?.data || error.message);
    throw error;
  }
}
