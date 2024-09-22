import styles from "./index.module.scss";
import clsx from "clsx";

export default function TextBox() {
  return (
    <div className={clsx("bg-lightThird dark:bg-darkThird rounded-lg p-2 text-white md:max-w-[400px] max-w-[150px]", styles.textBoxEntry)}>
      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent laoreet mauris velit, finibus tincidunt est fringilla eget.
    </div>
  )
}
