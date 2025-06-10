import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';
import { getZohoAccessToken } from '@/lib/zoho';

export async function POST(req: NextRequest) {
  const { to, name, subject, content } = await req.json();

  try {
    const accessToken = await getZohoAccessToken();

    // STEP 1: Add or update contact
    await axios.post(
      'https://marketingautomation.zoho.com/api/v1/contact',
      {
        contact: {
          email: to,
          first_name: name || 'Subscriber',
          listkey: process.env.ZOHO_LIST_KEY!,
        },
      },
      {
        headers: {
          Authorization: `Zoho-oauthtoken ${accessToken}`,
          'Content-Type': 'application/json',
        },
      }
    );

    // STEP 2: Create Campaign
    const campaignRes = await axios.post(
      'https://marketingautomation.zoho.com/api/v1/emailcampaign',
      {
        campaign: {
          name: subject || 'Campaign',
          subject: subject || 'Subject here',
          content: content || '<p>Hello from our brand!</p>',
          listkey: process.env.ZOHO_LIST_KEY!,
          from_email: process.env.ZOHO_FROM_ADDRESS!,
          from_name: process.env.ZOHO_FROM_NAME || 'Your Brand',
        },
      },
      {
        headers: {
          Authorization: `Zoho-oauthtoken ${accessToken}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const campaignKey = campaignRes.data?.campaign?.campaignkey;
    if (!campaignKey) throw new Error('Failed to retrieve campaign key');

    // STEP 3: Schedule Campaign for immediate send
    await axios.post(
      'https://marketingautomation.zoho.com/api/v1/emailcampaign/schedule',
      {
        campaignkey: campaignKey,
        schedule: {
          schedule_type: 'immediate',
        },
      },
      {
        headers: {
          Authorization: `Zoho-oauthtoken ${accessToken}`,
          'Content-Type': 'application/json',
        },
      }
    );

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Zoho Error:', error.response?.data || error.message);
    return NextResponse.json(
      { error: 'Failed to send campaign' },
      { status: 500 }
    );
  }
}
