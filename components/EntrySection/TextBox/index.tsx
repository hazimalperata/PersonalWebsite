import styles from "./index.module.scss";
import clsx from "clsx";

export default function TextBox({text}:{text:string}) {
  return (
    <div className={clsx("bg-lightThird dark:bg-darkThird rounded-lg p-2 text-white md:max-w-[400px] max-w-[150px]", styles.textBoxEntry)}>
      {text}
    </div>
  )
}
