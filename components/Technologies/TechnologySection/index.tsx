"use client";

import clsx from "clsx";
import styles from "@/components/Technologies/index.module.scss";
import useOnScreen from "@/utils/useOnScreen";
import React, { SVGProps } from "react";

export type Tech = {
  icon: (props: SVGProps<SVGSVGElement>) => React.JSX.Element;
  name: string;
};

type TechnologyProps = {
  tech: Tech;
  style?: React.CSSProperties;
};

export default function Technology({ tech, style }: TechnologyProps) {
  const { ref, isIntersecting } = useOnScreen(false);

  return (
    <div
      ref={ref}
      title={tech.name}
      style={style}
      className={clsx("px-6 py-4 transition-all", styles.technology, {
        [styles.atScreen]: isIntersecting,
      })}
    >
      {tech.icon({
        className: "h-10 w-auto ease-linear duration-300",
        width: 800,
        height: 250,
      })}
    </div>
  );
}
