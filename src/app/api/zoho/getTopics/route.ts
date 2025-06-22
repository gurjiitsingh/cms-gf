// app/api/zoho/getTopics/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getZohoTopics } from '@/lib/zoho/getTopics';
import { getZohoAccessToken } from '@/lib/zohoToken';

export async function POST(req: NextRequest) {
  try {
    const { from_index = 1, range = 50 } = await req.json();

    const userId = "test_user_123"; // Replace with actual session/user ID
    const accessToken = await getZohoAccessToken(userId);

    if (!accessToken) {
      return NextResponse.json({ error: 'OAuth token not found' }, { status: 401 });
    }

    const data = await getZohoTopics(accessToken, from_index, range);
    return NextResponse.json({ success: true, topics: data.topics || [] });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
