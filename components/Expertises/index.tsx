"use client";

import clsx from "clsx";
import React from "react";
import useOnScreen from "@/utils/useOnScreen";
import {MessageKeys, useTranslations} from "next-intl";
import styles from "./index.module.scss";

export default function Expertises() {
  const t = useTranslations("HomePage");

  const { ref, isIntersecting } = useOnScreen();
  const listOnScreen = useOnScreen(undefined, { threshold: 0.6 });

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
            {t("expertises" as MessageKeys<string, any>)}
          </h1>
        </div>
        <ul ref={listOnScreen.ref} className="list-disc columns-2 gap-40">
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
                className={clsx(
                  "my-2 text-lg font-medium",
                  styles.animatedItem,
                  {
                    [styles.onScreen]: listOnScreen.isIntersecting,
                  },
                )}
                style={{ animationDelay: animationDelay }}
              >
                {x}
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
