// app/api/zoho/auth/callback/route.ts
import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';
import { db } from '@/lib/firebaseConfig';
import { doc, setDoc } from 'firebase/firestore';

export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get('code');

  if (!code) return NextResponse.json({ error: 'Missing code' }, { status: 400 });

  const params = new URLSearchParams({
    grant_type: 'authorization_code',
    client_id: process.env.ZOHO_CLIENT_ID!,
    client_secret: process.env.ZOHO_CLIENT_SECRET!,
    redirect_uri: process.env.ZOHO_REDIRECT_URI!,
    code,
  });

  try {
    const res = await axios.post('https://accounts.zoho.in/oauth/v2/token', params, {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    });

    const { access_token, refresh_token, expires_in, api_domain } = res.data;
    const userId = 'test_user_123'; // Replace with real user ID/email from session

    await setDoc(doc(db, 'zoho_tokens', userId), {
      access_token,
      refresh_token,
      expires_at: Date.now() + expires_in * 1000,
      created_at: Date.now(),
      api_domain,
    });

    return NextResponse.redirect('http://localhost:3000/zoho-connected'); // Redirect to your frontend page
  } catch (err: any) {
    console.error('Token exchange error:', err.response?.data || err.message);
    return NextResponse.json({ error: 'Token exchange failed' }, { status: 500 });
  }
}
