// File: app/api/zoho/create-campaign/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebaseConfig';
import { doc, getDoc } from 'firebase/firestore';
import axios from 'axios';

export async function POST(req: NextRequest) {
  const userId = 'test_user_123'; // Replace with dynamic auth UID if needed
  const body = await req.json();

  const {
    campaignname,
    from_email,
    subject,
    content_url, // e.g. public URL of email content
    list_key // e.g. "1234567890"
  } = body;

  if (!campaignname || !from_email || !subject || !content_url || !list_key) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  try {
    // Fetch access_token from Firestore
    const docRef = doc(db, 'zoho_tokens', userId);
    const tokenSnap = await getDoc(docRef);

    if (!tokenSnap.exists()) {
      return NextResponse.json({ error: 'No Zoho token found for user' }, { status: 401 });
    }

    const { access_token } = tokenSnap.data();

    // Prepare form data for URL-encoded body
    const formData = new URLSearchParams();
    formData.append('resfmt', 'json');
    formData.append('campaignname', campaignname);
    formData.append('from_email', from_email);
    formData.append('subject', subject);
    formData.append('content_url', content_url);
    formData.append('list_details', JSON.stringify({ [list_key]: [] }));

    // Make request to Zoho API
    const response = await axios.post(
      'https://campaigns.zoho.in/api/v1.1/createCampaign',
      formData.toString(),
      {
        headers: {
          Authorization: `Zoho-oauthtoken ${access_token}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    );

    return NextResponse.json({ success: true, data: response.data });
  } catch (error: any) {
    console.error('Zoho API Error:', error.response?.data || error.message);
    return NextResponse.json(
      { error: 'Failed to create campaign', details: error.response?.data || error.message },
      { status: 500 }
    );
  }
}
