// app/zoho/page.tsx or any component
'use client';

export default function ZohoConnectPage() {
  const handleConnect = () => {
    const authUrl = new URL("https://accounts.zoho.in/oauth/v2/auth");
    authUrl.searchParams.set("scope", "ZohoCampaigns.campaign.CREATE ZohoCampaigns.contact.ALL");
    authUrl.searchParams.set("client_id", process.env.NEXT_PUBLIC_ZOHO_CLIENT_ID!);
    authUrl.searchParams.set("response_type", "code");
    authUrl.searchParams.set("access_type", "offline");
    authUrl.searchParams.set("redirect_uri", process.env.NEXT_PUBLIC_ZOHO_REDIRECT_URI!);

    window.location.href = authUrl.toString();
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl mb-4">Connect Zoho</h1>
      <button
        onClick={handleConnect}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Connect to Zoho
      </button>
    </div>
  );
}
