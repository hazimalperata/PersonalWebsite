import clsx from "clsx";
import styles from "./index.module.scss";
import TextBox from "@/components/EntrySection/TextBox";

export default function MainLineArea() {
  return (
    <div className={clsx("max-w-screen-2xl w-full px-5", styles.container)}>
      <div className="flex flex-col">
        <div className="flex flex-row items-center justify-end gap-x-5 mt-[300px]">
          <TextBox/>
          <div className={clsx(styles.horizontalLine, styles.left)}/>
        </div>
        <div className="flex flex-row items-center justify-end gap-x-5 mt-[300px]">
          <TextBox/>
          <div className={clsx(styles.horizontalLine, styles.left)}/>
        </div>
      </div>

      <div className="flex flex-col">
        <div className={clsx(styles.verticalLine, styles.upper)}/>
        <div className={clsx(styles.verticalLine, styles.middle)}/>
        <div className={clsx(styles.verticalLine, styles.middle)}/>
        <div className={clsx(styles.verticalLine, styles.middle)}/>
        <div className={clsx(styles.verticalLine, styles.bottom)}/>
        <div className="relative italic mt-10" style={{left: -20}}>Soon...</div>
      </div>

      <div>
        <div className="flex flex-row items-center justify-start gap-x-5 mt-[500px]">
          <div className={clsx(styles.horizontalLine, styles.right)}/>
          <TextBox/>
        </div>
      </div>
    </div>
  )
}
