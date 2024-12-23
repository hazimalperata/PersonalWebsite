import clsx from "clsx";
import styles from "@/components/EntrySection/TextArea/index.module.scss";
import React from "react";
import {NameText} from "@/components/icons";
import ProfileImage from "@/public/assets/new_profile.jpg";
import Image from "next/image";
import {useTranslations} from "next-intl";


export default function TextArea() {
  const t = useTranslations('HomePage.heroSection');


  return (
    <div className="flex flex-col items-center justify-center">
      <Image src={ProfileImage} alt="profile_image" width={300} height={300} placeholder="blur" className={clsx("rounded-full h-[300px] w-[300px] object-cover", styles.profileImage)}/>
      <NameText className={clsx("stroke-2 stroke-darkGrey dark:stroke-white", styles.textFillAnimation)}/>
      <div className={clsx("inline-block text-6xl opacity-0 select-none", styles.textContainer)}>
        <span className={clsx("inline-block border-r-2 border-current w-full overflow-hidden whitespace-nowrap font-medium", styles.typingTextAnimation)}>
          {t('title')}
        </span>
      </div>
      <div className="relative flex justify-center border-2 border-gray-700 dark:border-gray-300 rounded-full h-10 w-7">
        <div className={clsx("absolute bg-gray-700 dark:bg-gray-300 w-1 h-2 rounded-full", styles.mouseWheel)}/>
      </div>
    </div>
  )
}
