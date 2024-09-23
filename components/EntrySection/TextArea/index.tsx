import clsx from "clsx";
import styles from "@/components/EntrySection/TextArea/index.module.scss";
import React from "react";
import BackgroundMask from "@/components/BackgroundMask";

export default function TextArea() {
  return (
    <div className="relative flex flex-col items-center w-3/4 py-[300px]">
      <h3 className={clsx("text-2xl", styles.leftToRightAnimation, styles.enterAnimation)}>Welcome,</h3>
      <h1 className={clsx("text-7xl ml-10 font-semibold", styles.rightToLeftAnimation, styles.gradientText)}>Hazim Alper ATA</h1>
      <h2 className={clsx("text-4xl ml-6 font-medium", styles.leftToRightAnimation)}>Frontend Web Developer</h2>
      <BackgroundMask/>
    </div>
  )
}
