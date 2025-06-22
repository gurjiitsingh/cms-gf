'use client';

import React from 'react';

const ZOHO_CLIENT_ID = process.env.NEXT_PUBLIC_ZOHO_CLIENT_ID!;
const REDIRECT_URI = 'http://localhost:3000/api/zoho/auth/callback'; // must match the one in Zoho console
const ZOHO_OAUTH_URL = 'https://accounts.zoho.in/oauth/v2/auth';

const ZohoLoginButton = () => {
  const handleLogin = () => {
    const params = new URLSearchParams({
      scope: 'ZohoCampaigns.campaign.ALL,ZohoCampaigns.contact.ALL',
      client_id: ZOHO_CLIENT_ID,
      response_type: 'code',
      access_type: 'offline',
      redirect_uri: REDIRECT_URI,
      prompt: 'consent', // ensures refresh_token is returned
    });

    const authUrl = `${ZOHO_OAUTH_URL}?${params.toString()}`;
    window.location.href = authUrl;
  };

  return (
    <button
      onClick={handleLogin}
      className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
    >
      Connect with Zoho
    </button>
  );
};

export default ZohoLoginButton;
