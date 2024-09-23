"use client"

import clsx from "clsx";
import styles from "@/components/Technologies/index.module.scss";
import Image from "next/image";
import useOnScreen from "@/utils/useOnScreen";
import {useRef} from "react";

export default function Technology() {
  const ref = useRef<HTMLDivElement | null>(null);

  const onScreen = useOnScreen(ref, true);

  return (
    <div ref={ref} className={clsx("py-4 px-5 sm:p-5 rounded-lg group transition-all", styles.technology, {
      [styles.atScreen]: onScreen
    })}>
      <Image src="/spotify.png" alt="spotify" width={100} height={60} className="h-7 sm:h-10 w-auto ease-linear duration-300"/>
    </div>
  )
}
