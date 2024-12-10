import clsx from "clsx";
import styles from "@/components/EntrySection/TextArea/index.module.scss";
import React from "react";
import {NameText} from "@/components/icons";
import BackgroundLineAnimation from "@/components/atoms/BackgroundLineAnimation";


export default function TextArea() {
  return (
    <div className="relative w-full flex flex-col items-center justify-center h-screen">
      <BackgroundLineAnimation/>
      <NameText className={clsx("z-1 stroke-2 stroke-darkGrey dark:stroke-white", styles.textFillAnimation)}/>
      <div className={clsx("inline-block z-1 text-6xl opacity-0 select-none", styles.textContainer)}>
        <span className={clsx("inline-block border-r-2 border-current w-full overflow-hidden whitespace-nowrap font-medium", styles.typingTextAnimation)}>
          Frontend Developer
      </span>
      </div>
    </div>
  )
}
