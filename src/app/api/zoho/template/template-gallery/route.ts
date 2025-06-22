import { NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs/promises';

export async function GET() {
    console.log("inside api------------")
  try {
    const templatesDir = path.join(process.cwd(), 'public', 'templates', 'store');
    const files = await fs.readdir(templatesDir);
    
    // Filter only HTML files
    const htmlFiles = files.filter((file) => file.endsWith('.html'));
console.log("test------------",htmlFiles)
    return NextResponse.json({ templates: htmlFiles });
  } catch (error) {
    console.error('Error reading templates:', error);
    return NextResponse.json(
      { error: 'Failed to read templates' },
      { status: 500 }
    );
  }
}
