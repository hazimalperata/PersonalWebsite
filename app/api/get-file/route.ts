import { unstable_noStore as noStore } from 'next/cache';

import {NextResponse} from 'next/server';
import {promises as fs} from 'fs';
import path from 'path';


export const revalidate = 1;

export async function GET() {
  noStore();

  const separator = "=========== List By TheFry =============="

  try {
    const jsonPath = path.join(process.cwd(), 'public', 'accounts.txt');
    const jsonContent = await fs.readFile(jsonPath, 'utf8');
    // const file = await fs.readFile(process.cwd() + '/public/accounts.txt', 'utf8');
    const accountList = jsonContent.split(separator);
    const randomAccount = accountList[Math.floor(Math.random() * accountList.length)];
    return NextResponse.json({content: randomAccount});
  } catch (error) {
    return NextResponse.json({error: `Dosya okunamadı:${error}`}, {status: 500});
  }
}
