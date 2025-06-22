// app/api/zoho/auth/callback/route.ts

import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';
import { db } from '@/lib/firebaseConfig';
import { doc, setDoc } from 'firebase/firestore';

// 🔐 Set your redirect URI and Zoho region
const client_id = process.env.ZOHO_CLIENT_ID!;
const client_secret = process.env.ZOHO_CLIENT_SECRET!;
const redirect_uri = 'http://localhost:3000/api/zoho/auth/callback';
const tokenUrl = 'https://accounts.zoho.in/oauth/v2/token'; // 🇮🇳 Zoho India

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
    const response = await axios.post(tokenUrl, params, {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    });

    const {
      access_token,
      refresh_token,
      api_domain,
      expires_in,
      scope,
      token_type,
    } = response.data;

    if (!access_token || !refresh_token) {
      return NextResponse.json({
        error: 'Missing token in Zoho response',
        raw: response.data,
      }, { status: 500 });
    }

    // 🔒 You can use Firebase Auth UID or hardcoded value for now
    const userId = 'test_user_123'; // TODO: replace with real userId/email

    // Save tokens securely in Firestore
    await setDoc(doc(db, 'zoho_tokens', userId), {
      access_token,
      refresh_token,
      api_domain,
      scope,
      token_type,
      expires_at: Date.now() + expires_in * 1000, // milliseconds
      created_at: Date.now(),
    });

    return NextResponse.redirect(new URL('/auth/success', req.url));
  } catch (err: any) {
    console.error('❌ Zoho token error:', err.response?.data || err.message);
    return NextResponse.json({
      error: 'Token exchange failed',
      details: err.response?.data || err.message,
    }, { status: 500 });
  }
}
