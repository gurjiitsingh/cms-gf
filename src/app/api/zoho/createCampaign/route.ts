import { NextRequest, NextResponse } from "next/server";
import { createZohoCampaign } from "@/lib/zoho/createCampaign";
import { getZohoAccessToken } from "@/lib/zohoToken"; // assumes you have this from earlier

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const userId = "test_user_123"; // Replace with actual user context
    const oauthToken = await getZohoAccessToken(userId);

    if (!oauthToken) {
      return NextResponse.json({ error: "Access token not found" }, { status: 401 });
    }

    const result = await createZohoCampaign(oauthToken, body);

    return NextResponse.json({ success: true, result });
  } catch (error: any) {
    return NextResponse.json(
      { error: "Failed to create campaign", details: error.message },
      { status: 500 }
    );
  }
}
