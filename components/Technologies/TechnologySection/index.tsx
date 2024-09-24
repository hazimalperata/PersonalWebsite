"use client"

import clsx from "clsx";
import styles from "@/components/Technologies/index.module.scss";
import useOnScreen from "@/utils/useOnScreen";
import React, {SVGProps} from "react";

export type Tech = {
  icon: (props: SVGProps<SVGSVGElement>) => React.JSX.Element;
  name: string;
}

type TechnologyProps = {
  tech: Tech;
}

export default function Technology({tech}: TechnologyProps) {
  const {ref, isIntersecting} = useOnScreen(false);

  return (
    <div ref={ref} title={tech.name} className={clsx("py-4 px-6 rounded-lg group transition-all", styles.technology, {
      [styles.atScreen]: isIntersecting
    })}>
      {tech.icon({className: "h-7 sm:h-10 w-auto ease-linear duration-300", width: 800, height: 250})}
    </div>
  )
}
