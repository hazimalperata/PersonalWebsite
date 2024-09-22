import clsx from "clsx";
import styles from "@/components/EntrySection/TextArea/index.module.scss";

export default function TextArea(){
  return (
    <div className="flex flex-col max-w-screen-2xl mb-[200px]">
      <h3 className={clsx("text-2xl", styles.leftToRightAnimation, styles.enterAnimation)}>Welcome,</h3>
      <h1 className={clsx("text-7xl ml-10 font-semibold", styles.rightToLeftAnimation)}>Hazim Alper ATA</h1>
      <h2 className={clsx("text-4xl ml-6 font-medium", styles.leftToRightAnimation)}>Frontend Web Developer</h2>
    </div>
  )
}
