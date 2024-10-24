import {unstable_noStore as noStore} from 'next/cache';

import {NextResponse} from 'next/server';
import {promises as fs} from 'fs';
import path from 'path';

let cachedAccounts: string[] | null = null;
const separator = "=========== List By TheFry ==============";

export async function POST() {
  try {
    if (!cachedAccounts) {
      // Dosya yoksa oku ve cache'e al
      const jsonPath = path.join(process.cwd(), 'public', 'accounts.txt');
      const jsonContent = await fs.readFile(jsonPath, 'utf8');
      cachedAccounts = jsonContent.split(separator);
    }

    // Hazır olduğunda true döndür
    return NextResponse.json({ready: true});
  } catch (error) {
    return NextResponse.json({error: `Dosya okunamadı: ${error}`}, {status: 500});
  }
}

export const revalidate = 0; // Her istekte dosya yeniden okunmaz

export async function GET() {
  noStore();

  try {
    if (cachedAccounts) {
      const randomAccount = cachedAccounts[Math.floor(Math.random() * cachedAccounts.length)];
      return NextResponse.json({content: randomAccount});
    } else {
      return NextResponse.json({error: `Dosya okunamadı:`}, {status: 500});
    }
  } catch (error) {
    return NextResponse.json({error: `Dosya okunamadı: ${error}`}, {status: 500});
  }
}
