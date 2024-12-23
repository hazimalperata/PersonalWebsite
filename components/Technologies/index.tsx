"use client";

import styles from "./index.module.scss";
import clsx from "clsx";
import Technology, { Tech } from "@/components/Technologies/TechnologySection";
import React from "react";
import {
  CssIcon,
  HtmlIcon,
  NextJsIcon,
  ReactIcon,
  TailwindIcon,
} from "@/components/icons";
import useOnScreen from "@/utils/useOnScreen";
import { useTranslations } from "next-intl";

export default function Technologies() {
  const technologies: Tech[] = [
    { icon: HtmlIcon, name: "HTML" },
    { icon: TailwindIcon, name: "TailwindCSS" },
    { icon: NextJsIcon, name: "NextJs" },
    { icon: ReactIcon, name: "React" },
    { icon: CssIcon, name: "CSS" },
  ];

  const t = useTranslations("HomePage");

  const { ref, isIntersecting } = useOnScreen();

  return (
    <section className="py-20">
      <div className="mx-auto flex max-w-7xl flex-col items-center space-y-10 px-5 sm:px-10 md:px-12 lg:px-5">
        <div className="mx-auto max-w-2xl space-y-6 text-center">
          <h1
            ref={ref}
            className={clsx(
              "fromBlurAppear text-3xl font-bold capitalize text-gray-900 dark:text-white",
              {
                atScreen: isIntersecting,
              },
            )}
          >
            {t("technologies")}
          </h1>
        </div>
        <div
          className={clsx(
            "flex w-fit flex-wrap justify-center",
            styles.technologies,
          )}
        >
          {technologies.map((tech) => (
            <Technology key={tech.name} tech={tech} />
          ))}
        </div>
      </div>
    </section>
  );
}
