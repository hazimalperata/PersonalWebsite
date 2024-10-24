import AccountPicker from "@/components/Picker";
import {promises as fs} from "fs";

export default async function Picker() {

  const file = await fs.readFile(process.cwd() + '/public/accounts.txt', 'utf8');

  return (
    <section className="flex flex-col justify-center items-center min-h-screen">
      <AccountPicker file={file}/>
    </section>
  )
}
