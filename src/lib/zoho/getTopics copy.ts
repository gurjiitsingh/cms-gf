// lib/zoho/getTopics.ts
import axios from "axios";

interface GetTopicsResponse {
  success: boolean;
  topics?: any[];
  error?: any;
}

export async function getZohoTopics(
  oauthToken: string,
  from_index: number = 1,
  range: number = 50
): Promise<GetTopicsResponse> {
  try {
    const url = `https://campaigns.zoho.com/api/v1.1/topics?resfmt=json&from_index=${from_index}&range=${range}`;

    const response = await axios.get(url, {
      headers: {
        Authorization: `Zoho-oauthtoken ${oauthToken}`,
      },
    });

    return {
      success: true,
      topics: response.data.topics || [],
    };
  } catch (error: any) {
    console.error("❌ Zoho Topics API Error:", error.response?.data || error.message);
    return {
      success: false,
      error: error.response?.data || error.message,
    };
  }
}
