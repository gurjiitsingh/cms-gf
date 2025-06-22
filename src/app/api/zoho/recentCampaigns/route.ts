// src/app/api/zoho/recentCampaigns/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getRecentCampaigns } from "@/lib/zoho/getRecentCampaigns";
import { getZohoAccessToken } from "@/lib/zohoToken";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const userId = "test_user_123"; // Replace with actual user ID from session
    const accessToken = await getZohoAccessToken(userId);

    if (!accessToken) {
      return NextResponse.json({ error: "No OAuth token found" }, { status: 401 });
    }

    const campaigns = await getRecentCampaigns(accessToken, body);
    console.log("campaigns--------------", campaigns)
    return NextResponse.json({ campaigns });
  } catch (error: any) {
    return NextResponse.json(
      { error: "Failed to fetch campaigns", details: error.message },
      { status: 500 }
    );
  }
}
