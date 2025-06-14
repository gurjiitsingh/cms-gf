// app/api/mailgun/sent-list/route.ts

import { NextRequest, NextResponse } from 'next/server';

const API_KEY = process.env.MAILGUN_API_KEY!;
const DOMAIN = process.env.MAILGUN_DOMAIN!;
const API_BASE = "https://api.eu.mailgun.net"; // use your region

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const pageUrl = searchParams.get("pageUrl");

  const url = pageUrl || `${API_BASE}/v3/${DOMAIN}/events?event=delivered&limit=100`;

  const res = await fetch(url, {
    headers: {
      Authorization: `Basic ${Buffer.from(`api:${API_KEY}`).toString('base64')}`,
    },
  });

  if (!res.ok) {
    return NextResponse.json({ error: "Failed to fetch emails" }, { status: res.status });
  }

  const data = await res.json();
  const emails = data.items.map((item: any) => item.recipient);
  const nextPageUrl = data.paging?.next || null;

  return NextResponse.json({
    emails,
    count: emails.length,
    nextPageUrl,
  });
}
