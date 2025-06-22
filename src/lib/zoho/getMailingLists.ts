import axios from "axios";

export async function getZohoMailingLists(oauthToken: string) {
  try {
    const response = await axios.get(
      'https://campaigns.zoho.in/api/v1.1/getmailinglists?resfmt=JSON',
      {
        headers: {
          Authorization: `Zoho-oauthtoken ${oauthToken}`,
        },
      }
    );



   // console.log("✅ Zoho Lists Response:", response.data);
    return response.data;
  } catch (error: any) {
    console.error("❌ Zoho API Error:", error.response?.data || error.message);
    throw new Error(error.response?.data?.message || 'Zoho API failed');
  }
}
