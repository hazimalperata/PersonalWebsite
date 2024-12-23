'use client'

import clsx from "clsx";
import React from "react";
import useOnScreen from "@/utils/useOnScreen";
import {useTranslations} from "next-intl";
import styles from "./index.module.scss";

export default function Expertises() {
  const t = useTranslations('HomePage');

  const {ref, isIntersecting} = useOnScreen();
  const listOnScreen = useOnScreen(undefined, {threshold: 0.6});

  const expertises = [
    "RestAPI",
    "Server/Client-Side Rendering (SSR/CSR)",
    "Static Site Generation (SSG)",
    "Authentication",
    "NodeJS",
    "Axios",
    "Redux",
    "Tanstack Query",
    "Functional Components",
    "Pixel Perfect",
    "Internationalization",
    "Env Variables",
    "Docker",
    "Postman",
    "Virtualization",
    "SEO",
    "First Contentful Paint (FCP)",
    "Largest Contentful Paint (LCP)",
    "Framer Motion",
    "Caching",
  ];

  return (
    <section className="py-20">
      <div className="flex flex-col items-center max-w-7xl mx-auto px-5 sm:px-10 md:px-12 lg:px-5 space-y-10">
        <div className="text-center space-y-6 max-w-2xl mx-auto">
          <h1 ref={ref} className={clsx("fromBlurAppear text-3xl font-bold text-gray-900 dark:text-white capitalize", {
            "atScreen": isIntersecting
          })}>{t('expertises')}</h1>
        </div>
        <ul ref={listOnScreen.ref} className="columns-2 gap-40 list-disc">
          {expertises.map((x, index) => {
            const animationTime = 0.3;
            const totalItems = expertises.length;
            const isFirstHalf = index < totalItems / 2;

            const animationDelay = isFirstHalf
              ? `${index * animationTime}s`
              : `${(index - totalItems / 2) * animationTime}s`;

            return (
              <li
                key={x}
                className={clsx("my-2 font-medium text-lg", styles.animatedItem, {
                  [styles.onScreen]: listOnScreen.isIntersecting,
                })}
                style={{animationDelay: animationDelay}}
              >
                {x}
              </li>
            )
          })}
        </ul>
      </div>
    </section>
  )
}
