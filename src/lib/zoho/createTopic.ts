// lib/zoho/createTopic.ts
import axios from "axios";
import qs from "qs";

export async function createZohoTopic(oauthToken: string, topic_name: string, topic_desc: string) {
  const formData = qs.stringify({
    resfmt: "JSON",
    topic_name,
    topic_desc,
  });
console.log("oauthToken----------", oauthToken)
  const response = await axios.post(
    "https://campaigns.zoho.in/api/v1.1/topics",
    formData,
    {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Zoho-oauthtoken ${oauthToken}`,
      },
    }
  );

  return response.data;
}
