// lib/zoho/getTopics.ts
import axios from 'axios';

export async function getZohoTopics(oauthToken: string, from_index = 1, range = 50) {
  try {
    
    const response = await axios.get(
      `https://campaigns.zoho.in/api/v1.1/topics?resfmt=JSON&from_index=${from_index}&range=${range}`,
      {
        headers: {
          Authorization: `Zoho-oauthtoken ${oauthToken}`,
        },
      }
    );

    //  const response = await axios.get(
    //   'https://campaigns.zoho.in/api/v1.1/getmailinglists?resfmt=JSON',
    //   {
    //     headers: {
    //       Authorization: `Zoho-oauthtoken ${oauthToken}`,
    //     },
    //   }
    // );

    console.log("✅ Topics Response:---", response.data);
    return response.data;
  } catch (error: any) {
    console.error("❌ Zoho Topics API Error:", error.response?.data || error.message);
    throw error;
  }
}
