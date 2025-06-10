import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

const client_id = process.env.ZOHO_CLIENT_ID!;
const client_secret = process.env.ZOHO_CLIENT_SECRET!;
const redirect_uri = 'http://localhost:3000/api/zoho/callback';

// ✅ Use the correct Zoho region (.in for India)
const tokenUrl = 'https://accounts.zoho.in/oauth/v2/token';

export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get('code');

  if (!code) {
    return NextResponse.json({ error: 'No code provided' }, { status: 400 });
  }

  const params = new URLSearchParams({
    grant_type: 'authorization_code',
    client_id,
    client_secret,
    redirect_uri,
    code,
  });

  try {
    const tokenResponse = await axios.post(tokenUrl, params, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });

    const { access_token, refresh_token, ...rest } = tokenResponse.data;

    console.log('✅ Access Token:', access_token);
    console.log('✅ Refresh Token:', refresh_token);

    return NextResponse.json({
      access_token,
      refresh_token,
      ...rest,
      message: '✅ Save this refresh_token securely in .env.local',
    });
  } catch (err: any) {
    console.error('❌ Zoho token error:', err.response?.data || err.message);
    return NextResponse.json(
      { error: 'invalid_code', message: 'Save this refresh_token securely in .env.local' },
      { status: 500 }
    );
  }
}
