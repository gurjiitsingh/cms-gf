import { NextRequest, NextResponse } from "next/server";
import { getZohoAccessToken } from "@/lib/zohoToken";
import axios from "axios";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const userId = "test_user_123"; // Replace with real user ID

  const accessToken = await getZohoAccessToken(userId);

  if (!accessToken) {
    return NextResponse.json({ error: "Zoho access token not available" }, { status: 401 });
  }

  try {
    const zohoApiUrl = `https://campaigns.zoho.in/api/v1.1/addlistandcontacts`;

    const formData = new URLSearchParams();
    formData.append("input", JSON.stringify(body));

    const response = await axios.post(zohoApiUrl, formData, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Zoho-oauthtoken ${accessToken}`,
      },
    });
console.log("response-------------", response)
    return NextResponse.json({ success: true, data: response.data });
  } catch (err: any) {
    console.error("Zoho API Error:", err.response?.data || err.message);
    return NextResponse.json(
      {
        error: "Failed to add list and contacts",
        details: err.response?.data || err.message,
      },
      { status: 500 }
    );
  }
}
