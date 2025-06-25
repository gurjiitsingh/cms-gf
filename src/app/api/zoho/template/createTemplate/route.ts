import { NextRequest, NextResponse } from 'next/server';
import { db } from "@/lib/firebaseConfig";
import { collection, addDoc, Timestamp } from "firebase/firestore";

export async function POST(req: NextRequest) {
  try {
    const { content, campaignName } = await req.json();

    if (!campaignName || !content) {
      return NextResponse.json({ error: "Missing campaignName or content" }, { status: 400 });
    }

    const now = new Date();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const year = String(now.getFullYear());
    const seconds = String(now.getSeconds()).padStart(2, '0');

    const folderName = `${month}_${year}`;
    const safeCampaignName = campaignName.replace(/[^a-z0-9_\-]/gi, '_').toLowerCase();
    const fileName = `${safeCampaignName}_${seconds}.html`;

    // Prepare the HTML content as a Blob and upload using fetch + FormData
    const blob = new Blob([content], { type: 'text/html' });
    const formData = new FormData();
    formData.append('file', blob, fileName);

    // Upload to external Express server
    const response = await fetch('https://uploads.gstadeveloper.com/uploader/upload', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Upload failed:', errorText);
      return NextResponse.json({ error: 'Upload to server failed' }, { status: 500 });
    }

    const { url: publicUrl } = await response.json();

    // Save metadata to Firestore
    await addDoc(collection(db, "emailTemplates"), {
      name: campaignName,
      url: publicUrl,
      createdAt: Timestamp.now(),
    });

    console.log("Template uploaded and saved at:", publicUrl);

    return NextResponse.json({ success: true, url: publicUrl });

  } catch (error) {
    console.error('Error uploading template:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
