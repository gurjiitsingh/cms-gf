// File: app/api/zoho/lists/delete/route.ts

import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';
import { getZohoAccessToken } from "@/lib/zohoToken";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { listkey, deletecontacts = 'off' } = body;

    if (!listkey) {
      return NextResponse.json(
        { error: 'Missing listkey in request body' },
        { status: 400 }
      );
    }

    const userId = 'test_user_123'; // Replace with actual logic
    const accessToken = await getZohoAccessToken(userId) as string;

    const url = `https://campaigns.zoho.in/api/v1.1/deletemailinglist?resfmt=JSON&listkey=${listkey}&deletecontacts=${deletecontacts}`;

    const response = await axios.get(url, {
      headers: {
        Authorization: `Zoho-oauthtoken ${accessToken}`,
      },
    });



    console.log("✅ response.data:", response.data);

    return NextResponse.json(response.data);
  } catch (error: any) {
    console.error('❌ Zoho Delete Error:', error.response?.data || error.message);
    return NextResponse.json(
      { error: error.response?.data || error.message },
      { status: 500 }
    );
  }
}
