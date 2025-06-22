import { NextRequest, NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs/promises';

export async function POST(req: NextRequest) {
  try {
    const { templateId, content } = await req.json();

    if (!templateId || !content) {
      return NextResponse.json({ error: 'Missing templateId or content' }, { status: 400 });
    }

    const filePath = path.join(process.cwd(), 'public', 'templates', 'store', `${templateId}.html`);
    await fs.writeFile(filePath, content, 'utf-8');

    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
    const publicUrl = `https://${baseUrl}/templates/store/${templateId}.html`;

    return NextResponse.json({ success: true, url: publicUrl });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to write file' }, { status: 500 });
  }
}
