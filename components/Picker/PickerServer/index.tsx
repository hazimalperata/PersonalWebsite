'use server'

import {promises as fs} from 'fs';

export async function getFile() {
  const file = await fs.readFile(process.cwd() + '/public/accounts.txt', 'utf8');
  return file;
}
