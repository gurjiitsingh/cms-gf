// src/app/api/brevo/campaigns/route.ts
import { NextRequest, NextResponse } from 'next/server';

const BREVO_API_KEY = process.env.BREVO_API_KEY;

export async function GET(req: NextRequest) {
  try {
    const res = await fetch('https://api.brevo.com/v3/emailCampaigns?limit=50&offset=0&sort=desc', {
      method: 'GET',
      headers: {
        accept: 'application/json',
        'api-key': BREVO_API_KEY ?? '',
      },
    });

    if (!res.ok) {
      return NextResponse.json({ error: 'Failed to fetch campaigns' }, { status: res.status });
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching campaigns:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
