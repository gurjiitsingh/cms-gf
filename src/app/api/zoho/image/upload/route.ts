import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebaseConfig';
import { collection, addDoc, Timestamp } from 'firebase/firestore';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    const now = new Date();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const year = String(now.getFullYear());
    const seconds = String(now.getSeconds()).padStart(2, '0');

    const fileName = `image_${month}_${year}_${seconds}.${file.name.split('.').pop()}`;
    const blob = new Blob([await file.arrayBuffer()], { type: file.type });

    const formUpload = new FormData();
    formUpload.append('file', blob, fileName);

    // Upload to external image upload server
    const uploadRes = await fetch('https://uploads.gstadeveloper.com/uploader/upload', {
      method: 'POST',
      body: formUpload,
    });

    if (!uploadRes.ok) {
      const errText = await uploadRes.text();
      console.error('Image upload failed:', errText);
      return NextResponse.json({ error: 'Upload to image server failed' }, { status: 500 });
    }

    const { url: imageUrl } = await uploadRes.json();

    // Save image URL to Firestore
    await addDoc(collection(db, 'templateImages'), {
      url: imageUrl,
      uploadedAt: Timestamp.now(),
    });

    console.log('Image uploaded successfully:', imageUrl);

    return NextResponse.json({ url: imageUrl });
  } catch (error) {
    console.error('Image upload error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
