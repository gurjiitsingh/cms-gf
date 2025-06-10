// lib/zoho.ts
import axios from 'axios';

export async function getZohoAccessToken(): Promise<string> {
  const tokenUrl = 'https://accounts.zoho.in/oauth/v2/token';

  const params = new URLSearchParams({
    refresh_token: process.env.ZOHO_REFRESH_TOKEN!,
    client_id: process.env.ZOHO_CLIENT_ID!,
    client_secret: process.env.ZOHO_CLIENT_SECRET!,
    grant_type: 'refresh_token',
  });

  const response = await axios.post(tokenUrl, params);
  return response.data.access_token;
}
