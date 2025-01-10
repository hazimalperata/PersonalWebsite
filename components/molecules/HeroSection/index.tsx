"use client";

import React, { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import clsx from "clsx";
import styles from "./index.module.scss";
import { NameText } from "@/components/icons";
import {MessageKeys, useTranslations} from "next-intl";

export default function HeroSection() {
  const t = useTranslations("HomePage.heroSection");

  const [titleNumber, setTitleNumber] = useState(0);
  const titles = useMemo(
    () => [...new Array(5)].map((_, index) => t(`titles.${index}` as MessageKeys<string, any>)),
    [t],
  );

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (titleNumber === titles.length - 1) {
        setTitleNumber(0);
      } else {
        setTitleNumber(titleNumber + 1);
      }
    }, 4000);
    return () => clearTimeout(timeoutId);
  }, [titleNumber, titles]);

  return (
    <div className="w-full">
      <div className="container mx-auto">
        <div className="flex gap-10 py-20 lg:py-40 items-center justify-center flex-col">
          <div className="flex gap-4 flex-col items-center">
            <h1 className="flex flex-col text-5xl md:text-7xl tracking-tighter text-center font-regular">
              <NameText
                className={clsx(
                  "stroke-gray-950 stroke-2 dark:stroke-white",
                  styles.textFillAnimation,
                )}
              />
              <span className="relative flex w-full justify-center overflow-hidden text-center md:pb-4 md:pt-1">
                &nbsp;
                {titles.map((title, index) => (
                  <motion.span
                    key={index}
                    className="absolute font-semibold"
                    initial={{ opacity: 0, y: "-100" }}
                    transition={{ type: "spring", stiffness: 50 }}
                    animate={
                      titleNumber === index
                        ? {
                            y: 0,
                            opacity: 1,
                          }
                        : {
                            y: titleNumber > index ? -150 : 150,
                            opacity: 0,
                          }
                    }
                  >
                    {title}
                  </motion.span>
                ))}
              </span>
            </h1>

            <p className="text-lg md:text-xl leading-relaxed tracking-tight text-muted-foreground max-w-4xl text-center">
              {t("bodyText")}
            </p>
          </div>
          <div className="relative flex h-10 w-7 justify-center rounded-full border-2 border-gray-700 dark:border-gray-300">
            <div
              className={clsx(
                "absolute h-2 w-1 rounded-full bg-gray-700 dark:bg-gray-300",
                styles.mouseWheel,
              )}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
