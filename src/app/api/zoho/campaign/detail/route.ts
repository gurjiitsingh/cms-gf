// File: app/api/zoho/campaign/detail/route.ts

import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';
import { getZohoAccessToken } from '@/lib/zohoToken';

export async function POST(req: NextRequest) {
  try {
    const { campaignkey } = await req.json();
console.log("cam detail-----------------")
    if (!campaignkey) {
      return NextResponse.json({ error: 'Missing campaignkey' }, { status: 400 });
    }

    const userId = 'test_user_123'; // Replace with real user ID
    const accessToken = await getZohoAccessToken(userId);

    const url = `https://campaigns.zoho.in/api/v1.1/getcampaigndetails?resfmt=JSON&campaignkey=${campaignkey}&campaigntype=normal`;

    const response = await axios.get(url, {
      headers: {
        Authorization: `Zoho-oauthtoken ${accessToken}`,
      },
    });
console.log("response.data----------------", response.data)
    return NextResponse.json(response.data);
  } catch (error: any) {
    console.error('❌ Campaign Detail Error:', error.response?.data || error.message);
    return NextResponse.json({ error: error.response?.data || error.message }, { status: 500 });
  }
}
