import { NextRequest, NextResponse } from 'next/server';
import path, { dirname } from 'path';
import fs from 'fs/promises';
import { fileURLToPath } from 'url';

import { db } from "@/lib/firebaseConfig";
import { collection, addDoc, Timestamp } from "firebase/firestore";

export async function POST(req: NextRequest) {
  try {
    const { content, campaignName } = await req.json();

    if (!campaignName || !content) {
      return NextResponse.json({ error: "Missing campaignName or content" }, { status: 400 });
    }

    // Prepare folder structure: MM_YYYY
    const now = new Date();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const year = String(now.getFullYear());
    const folderName = `${month}_${year}`;

    // Unique filename with seconds
    const seconds = String(now.getSeconds()).padStart(2, '0');
    const safeCampaignName = campaignName.replace(/[^a-z0-9_\-]/gi, '_').toLowerCase();
    const fileName = `${safeCampaignName}_${seconds}.html`;

    // Resolve directories safely
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = dirname(__filename);
    const publicPath = path.join(__dirname, '../../../../../../public');
    const templatesRoot = path.join(publicPath, 'templates');
    const targetFolder = path.join(templatesRoot, folderName);
    const filePath = path.join(targetFolder, fileName);

    // Ensure all necessary directories exist
    await fs.mkdir(targetFolder, { recursive: true }); // This creates templates/ and MM_YYYY if not exist

    // Write the HTML file
    await fs.writeFile(filePath, content, 'utf-8');

    // Generate the public URL
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'localhost:3000';
    const publicUrl = `https://${baseUrl}/templates/${folderName}/${fileName}`;

    // Save metadata to Firestore
    await addDoc(collection(db, "templates"), {
      name: campaignName,
      url: publicUrl,
      createdAt: Timestamp.now(),
    });

    console.log("Template saved at:", publicUrl);

    return NextResponse.json({ success: true, url: publicUrl });

  } catch (error) {
    console.error('Error saving template:', error);
    return NextResponse.json({ error: 'Failed to save template' }, { status: 500 });
  }
}
