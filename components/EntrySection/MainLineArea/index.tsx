import clsx from "clsx";
import styles from "./index.module.scss";
import TextBox from "@/components/EntrySection/TextBox";
import {useTranslations} from "next-intl";

export default function MainLineArea() {
  const t = useTranslations('HomePage.experiences');


  return (
    <>
      <div className={clsx("max-w-screen-2xl w-full px-5", styles.container)}>
        <div className="flex flex-col">
          <div className="flex flex-row items-center justify-end gap-x-5 mt-[400px]">
            <TextBox text={t('inovathings')}/>
            <div className={clsx(styles.horizontalLine, styles.left)}/>
          </div>
          <div className="flex flex-row items-center justify-end gap-x-5 mt-[600px]">
            <TextBox text={t('birlikte')}/>
            <div className={clsx(styles.horizontalLine, styles.left)}/>
          </div>
        </div>

        <div className="flex flex-col">
          <div className={clsx(styles.verticalLine, styles.upper)}/>
          <div className={clsx(styles.verticalLine, styles.middle)}/>
          <div className={clsx(styles.verticalLine, styles.middle)}/>
          <div className={clsx(styles.verticalLine, styles.middle)}/>
          <div className={clsx(styles.verticalLine, styles.bottom)}/>
        </div>
        <div>
          <div className="flex flex-row items-center justify-start gap-x-5 mt-[750px]">
            <div className={clsx(styles.horizontalLine, styles.right)}/>
            <TextBox text={t('baykar')}/>
          </div>
        </div>
      </div>
      <div className="italic mt-2 mx-auto">{t('soon')}</div>
    </>
  )
}
