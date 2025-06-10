import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

const client_id = process.env.ZOHO_CLIENT_ID!;
const client_secret = process.env.ZOHO_CLIENT_SECRET!;
const refresh_token = process.env.ZOHO_REFRESH_TOKEN!;
const api_domain = process.env.ZOHO_API_DOMAIN!;

async function getAccessToken() {
  const tokenUrl = 'https://accounts.zoho.in/oauth/v2/token';

  const params = new URLSearchParams({
    refresh_token,
    client_id,
    client_secret,
    grant_type: 'refresh_token',
  });

  const { data } = await axios.post(tokenUrl, params);
  return data.access_token;
}

async function getAccountId(access_token: string) {
  const res = await axios.get(`${api_domain}/mail/accounts`, {
    headers: {
      Authorization: `Zoho-oauthtoken ${access_token}`,
    },
  });

  const accountId = res.data.data?.[0]?.accountId;
  if (!accountId) throw new Error('No Zoho Mail account found');
  return accountId;
}

export async function POST(req: NextRequest) {
  try {
    const { to, subject, content } = await req.json();

    const access_token = await getAccessToken();
    const accountId = await getAccountId(access_token);

    const res = await axios.post(
      `https://mail.zoho.in/api/accounts/${accountId}/messages`,
      {
        fromAddress: "info@masala-gf.de", // must match your Zoho verified sender
        toAddress: ["gurjiitsingh2@gmail.com"],
        subject,
        content,
      },
      {
        headers: {
          Authorization: `Zoho-oauthtoken ${access_token}`,
          'Content-Type': 'application/json',
        },
      }
    );

    return NextResponse.json({ success: true, data: res.data });
  } catch (err: any) {
    console.error('Email send error:', err.response?.data || err.message);
    return NextResponse.json({ error: 'Failed to send email' }, { status: 500 });
  }
}
