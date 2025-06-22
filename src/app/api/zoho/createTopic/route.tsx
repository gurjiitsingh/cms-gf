// File: app/api/zoho/createTopic/route.ts
import { NextRequest, NextResponse } from "next/server";
import { createZohoTopic } from "@/lib/zoho/createTopic";
import { getZohoAccessToken } from "@/lib/zohoToken";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { topic_name, topic_desc } = body;

    if (!topic_name || !topic_desc) {
      return NextResponse.json({ error: "Missing topic_name or topic_desc" }, { status: 400 });
    }

    const userId = "test_user_123"; // 🔁 Replace with actual session or auth logic
    const accessToken = await getZohoAccessToken(userId);

    if (!accessToken) {
      return NextResponse.json({ error: "OAuth token not found" }, { status: 401 });
    }

    const result = await createZohoTopic(accessToken, topic_name, topic_desc);
    return NextResponse.json({ success: true, result });
  } catch (error: any) {
    return NextResponse.json(
      { error: "Failed to create topic", details: error.message },
      { status: 500 }
    );
  }
}
