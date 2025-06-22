import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const brevoRes = await fetch('https://api.brevo.com/v3/emailCampaigns', {
      method: 'POST',
      headers: {
        accept: 'application/json',
        'content-type': 'application/json',
        'api-key': process.env.BREVO_API_KEY || '',
      },
      body: JSON.stringify({
    name: 'Masala test',
    subject: 'Get 30% off this week only!',
    sender: {
      name: 'Masala',
      email: 'info@masalabs.store'  // Must be verified in Brevo
    },
    recipients: {
      listIds: [2] // example list ID
    },
    type: 'classic',
    htmlContent: '<html><body><h1>Hot Offers 🔥</h1><p>Shop now!</p></body></html>',
    inlineImageActivation: false,
    sendAtBestTime: false,
    abTesting: false,
    ipWarmupEnable: false
  }),
    });

    const data = await brevoRes.json();

    if (!brevoRes.ok) {
      return NextResponse.json({ error: data.message || 'Failed to create campaign' }, { status: brevoRes.status });
    }

    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 });
  }
}
