import clsx from "clsx";
import styles from "./index.module.scss";
import TextBox from "@/components/EntrySection/TextBox";
import { useTranslations } from "next-intl";

export default function MainLineArea() {
  const t = useTranslations("HomePage.experiences");

  return (
    <>
      <div className={clsx("w-full max-w-screen-2xl px-5", styles.container)}>
        <div className="flex flex-col">
          <div className="mt-[400px] flex flex-row items-center justify-end gap-x-5">
            <TextBox text={t("inovathings")} />
            <div className={clsx(styles.horizontalLine, styles.left)} />
          </div>
          <div className="mt-[600px] flex flex-row items-center justify-end gap-x-5">
            <TextBox text={t("birlikte")} />
            <div className={clsx(styles.horizontalLine, styles.left)} />
          </div>
        </div>

        <div className="flex flex-col">
          <div className={clsx(styles.verticalLine, styles.upper)} />
          <div className={clsx(styles.verticalLine, styles.middle)} />
          <div className={clsx(styles.verticalLine, styles.middle)} />
          <div className={clsx(styles.verticalLine, styles.middle)} />
          <div className={clsx(styles.verticalLine, styles.bottom)} />
        </div>
        <div>
          <div className="mt-[750px] flex flex-row items-center justify-start gap-x-5">
            <div className={clsx(styles.horizontalLine, styles.right)} />
            <TextBox text={t("baykar")} />
          </div>
        </div>
      </div>
      <div className="mx-auto mt-2 italic">{t("soon")}</div>
    </>
  );
}
