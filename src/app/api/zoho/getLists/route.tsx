import { NextRequest, NextResponse } from "next/server";
import { getZohoMailingLists } from "@/lib/zoho/getMailingLists";
import { getZohoAccessToken } from "@/lib/zohoToken";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // 1. Get token - you can extract it from session, Firestore, or body
  

const userId = "test_user_123"; // Replace with real user ID
  const accessToken = await getZohoAccessToken(userId) as string;

    if (!accessToken) {
      return NextResponse.json({ error: "OAuth token not found" }, { status: 401 });
    }

    // 2. Fetch mailing lists
    const data = await getZohoMailingLists(accessToken);
console.log("list_of_details----------", data.list_of_details[0])
    return NextResponse.json({ mailingLists: data.list_of_details || [] });
  } catch (error: any) {
    return NextResponse.json(
      { error: "Failed to fetch mailing lists", details: error.message },
      { status: 500 }
    );
  }
}
