import { NextRequest, NextResponse } from "next/server";
import { sendZohoCampaign } from "@/lib/zoho/sendCampaign";
import { getZohoAccessToken } from "@/lib/zohoToken";

export async function POST(req: NextRequest) {
  try {
    const { campaignkey, userId = "test_user_123" } = await req.json();

    if (!campaignkey) {
      return NextResponse.json({ error: "Missing campaign key" }, { status: 400 });
    }

    const accessToken = await getZohoAccessToken(userId);
    if (!accessToken) {
      return NextResponse.json({ error: "Missing OAuth token" }, { status: 401 });
    }

    const result = await sendZohoCampaign(accessToken, campaignkey);

    return NextResponse.json({ success: true, result });
  } catch (error: any) {
    return NextResponse.json(
      { error: "Failed to send campaign", details: error.message },
      { status: 500 }
    );
  }
}
