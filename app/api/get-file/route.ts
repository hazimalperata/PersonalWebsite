import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';

export async function GET() {
  try {
    const file = await fs.readFile(process.cwd() + '/public/accounts.txt', 'utf8');
    return NextResponse.json({ content: file });
  } catch (error) {
    return NextResponse.json({ error: 'Dosya okunamadı' }, { status: 500 });
  }
}
