import axios from "axios";
import qs from "qs";

export async function createZohoCampaign(
  oauthToken: string,
  payload: {
    campaignname: string;
    from_email: string;
    subject: string;
    content_url: string;
    list_details: Record<string, string[]>; // { listkey: [segmentID] }
    topicId?: string;
  }
) {

  console.log("payload.list_details----------", payload)
  try {
    const formData = qs.stringify({
      resfmt: "JSON",
      campaignname: payload.campaignname,
      from_email: payload.from_email,
      subject: payload.subject,
      content_url: "payload.content_url",
      list_details: JSON.stringify(payload.list_details),
      topicId: payload.topicId,
    });

    const response = await axios.post(
      "https://campaigns.zoho.in/api/v1.1/createCampaign",
      formData,
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: `Zoho-oauthtoken ${oauthToken}`,
        },
      }
    );
console.log("respondata----------", response.data)
    return response.data;
  } catch (error: any) {
    console.error("❌ Zoho API Error:", error.response?.data || error.message);
    throw error;
  }
}
