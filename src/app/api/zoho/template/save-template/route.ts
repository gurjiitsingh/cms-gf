// /app/api/save-template/route.ts
import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { db } from '@/lib/firebaseConfig'; // adjust path if needed
import { collection, addDoc } from 'firebase/firestore';

export async function POST(req: Request) {
  try {
    const { templateName, htmlContent } = await req.json();

    if (!templateName || !htmlContent) {
      return NextResponse.json({ success: false, error: 'Missing fields' }, { status: 400 });
    }

    const now = new Date();
    const folderName = now.toLocaleString('default', {
      month: 'short',
      year: 'numeric',
    }).replace(' ', '-');

    const filename = `${templateName.replace(/\s+/g, '-')}.html`;
    const dirPath = path.join(process.cwd(), 'public', 'templates', folderName);
    const filePath = path.join(dirPath, filename);

    fs.mkdirSync(dirPath, { recursive: true });
    fs.writeFileSync(filePath, htmlContent, 'utf8');

    const publicUrl = `/templates/${folderName}/${filename}`;

    // 🔥 Save to Firestore
   await addDoc(collection(db, 'emailTemplates'), {
  name: templateName,
  fileUrl: publicUrl,
  createdAt: new Date().toISOString(),
});

    return NextResponse.json({ success: true, url: publicUrl });
  } catch (error) {
    console.error('Error saving template:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
