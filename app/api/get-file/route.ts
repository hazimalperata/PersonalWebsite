import {NextResponse} from 'next/server';
import {promises as fs} from 'fs';

export const revalidate = 0;

export async function GET() {
  const separator = "=========== List By TheFry =============="

  try {
    const file = await fs.readFile(process.cwd() + '/public/accounts.txt', 'utf8');
    const accountList = file.split(separator);
    const randomAccount = accountList[Math.floor(Math.random() * accountList.length)];
    return NextResponse.json({content: randomAccount});
  } catch (error) {
    return NextResponse.json({error: 'Dosya okunamadı'}, {status: 500});
  }
}
