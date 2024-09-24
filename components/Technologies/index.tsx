"use client"

import styles from "./index.module.scss";
import clsx from "clsx";
import Technology, {Tech} from "@/components/Technologies/TechnologySection";
import React from "react";
import {CssIcon, HtmlIcon, NextJsIcon, ReactIcon, TailwindIcon} from "@/components/icons";
import useOnScreen from "@/utils/useOnScreen";

export default function Technologies() {
  const technologies: Tech[] = [
    {icon: HtmlIcon, name: "HTML"},
    {icon: TailwindIcon, name: "TailwindCSS"},
    {icon: NextJsIcon, name: "NextJs"},
    {icon: ReactIcon, name: "React"},
    {icon: CssIcon, name: "CSS"},
  ]

  const {ref, isIntersecting} = useOnScreen();

  return (
    <section className="py-20">
      <div className="flex flex-col items-center max-w-7xl mx-auto px-5 sm:px-10 md:px-12 lg:px-5 space-y-10">
        <div className="text-center space-y-6 max-w-2xl mx-auto">
          <h1 ref={ref} className={clsx("fromBlurAppear text-3xl font-bold text-gray-900 dark:text-white capitalize", {
            "atScreen": isIntersecting
          })}>Technologies</h1>
        </div>
        <div className={clsx("flex justify-center flex-wrap w-fit", styles.technologies)}>
          {technologies.map(tech => (
            <Technology key={tech.name} tech={tech}/>
          ))}
        </div>
      </div>
    </section>
  )
}
