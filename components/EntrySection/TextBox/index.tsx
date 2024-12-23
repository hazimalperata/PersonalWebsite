import styles from "./index.module.scss";
import clsx from "clsx";

export default function TextBox({ text }: { text: string }) {
  return (
    <div
      className={clsx(
        "max-w-[150px] rounded-lg bg-lightThird p-2 text-white md:max-w-[400px] dark:bg-darkThird",
        styles.textBoxEntry,
      )}
    >
      {text}
    </div>
  );
}
