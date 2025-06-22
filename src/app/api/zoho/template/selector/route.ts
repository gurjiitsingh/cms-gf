import fs from 'fs';
import path from 'path';
import { NextResponse } from 'next/server';

export async function GET() {
  const dirPath = path.join(process.cwd(), 'public/templates/store');
  const files = fs.readdirSync(dirPath).filter(f => f.endsWith('.html'));

  const templates = files.map(filename => {
    const fullPath = path.join(dirPath, filename);
    const content = fs.readFileSync(fullPath, 'utf-8');
    return { filename, content };
  });

  return NextResponse.json({ templates });
}
