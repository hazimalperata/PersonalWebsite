import TextArea from "@/components/EntrySection/TextArea";
import MainLineArea from "@/components/EntrySection/MainLineArea";

export default function EntrySection() {
  return (
    <section
      className="flex flex-col items-center bg-lightPrimary dark:bg-darkPrimary py-[200px]"
    >
      <TextArea/>
      <MainLineArea/>
    </section>
  )
}
