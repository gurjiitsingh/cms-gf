import { NextRequest, NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs/promises';

export async function POST(req: NextRequest) {
  console.log("tins-------------")
  try {
    const { content, campaignName } = await req.json();

    if (!campaignName || !content) {
      return NextResponse.json(
        { error: 'Missing campaignName or content' },
        { status: 400 }
      );
    }

    const now = new Date();

    // 👇 Folder format: MM_YYYY (e.g., 06_2025)
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const year = String(now.getFullYear());
    const folderName = `${month}_${year}`;

    // 👇 Seconds added for uniqueness
    const seconds = String(now.getSeconds()).padStart(2, '0');

    // 👇 Clean campaign name for safe filenames
    const safeCampaignName = campaignName.replace(/[^a-z0-9_\-]/gi, '_').toLowerCase();

    // 👇 Build filename and full path
    const fileName = `${safeCampaignName}_${seconds}.html`;
    const folderPath = path.join(process.cwd(), 'public', 'templates', 'store', folderName);
    const filePath = path.join(folderPath, fileName);

    await fs.mkdir(folderPath, { recursive: true });
    await fs.writeFile(filePath, content, 'utf-8');

    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'localhost:3000';
    const publicUrl = `https://${baseUrl}/templates/store/${folderName}/${fileName}`;

    return NextResponse.json({ success: true, url: publicUrl });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to write file' }, { status: 500 });
  }
}
