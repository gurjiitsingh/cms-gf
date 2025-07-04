import { NextRequest, NextResponse } from "next/server";
import { getZohoAccessToken } from "@/lib/zohoToken";
import { addListAndContactsZoho } from "@/lib/zoho/addListAndContacts";

export async function POST(req: NextRequest) {
  const body = await req.json(); // Expects structured body

  const userId = "test_user_123"; // Replace with real user ID
  const accessToken = await getZohoAccessToken(userId);

  if (!accessToken) {
    return NextResponse.json(
      { error: "Zoho access token not available" },
      { status: 401 }
    );
  }

  try {
    const response = await addListAndContactsZoho(accessToken,body);

    console.log("✅ Zoho Response:", response);

    if(response.status==='error'){
return NextResponse.json({ success: false, data: response });
    }else{
return NextResponse.json({ success: true, data: response });
    }

    
  } catch (err: any) {
    console.error("Zoho API Error:", err?.response?.data || err.message);

    return NextResponse.json(
      {
        error: "Failed to add list and contacts",
        details: err?.response?.data || err.message,
      },
      { status: 500 }
    );
  }
}
