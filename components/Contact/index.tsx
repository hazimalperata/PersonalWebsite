"use client";

import clsx from "clsx";
import styles from "./index.module.scss";
import useOnScreen from "@/utils/useOnScreen";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Mail } from "lucide-react";

export default function CtaSection() {
  const t = useTranslations("HomePage.quickStart");

  const titleOnScreen = useOnScreen();
  const descriptionOnScreen = useOnScreen();
  const buttonOnScreen = useOnScreen();

  return (
    <section className="py-24">
      <div className="mx-auto max-w-7xl px-5 sm:px-10 md:px-12 lg:px-5">
        <div className="relative w-full rounded-2xl bg-gradient-to-tr from-gray-100 to-gray-200 px-6 py-8 md:px-8 md:py-10 dark:from-gray-900">
          <div className="absolute bottom-0 left-0 flex h-full w-full overflow-hidden">
            <div
              className={clsx(
                "relative flex h-28 w-28 overflow-hidden rounded-xl blur-2xl",
                styles.backgroundLight,
              )}
            >
              <span className="absolute -right-1 -top-1 h-16 w-16 rotate-45 rounded-md bg-blue-500" />
              <span className="absolute -bottom-1 -right-1 h-16 w-16 rotate-45 rounded-md bg-teal-500" />
              <span className="absolute -bottom-1 -left-1 h-16 w-16 rotate-45 rounded-md bg-indigo-300" />
            </div>
          </div>
          <div className="relative mx-auto max-w-xl space-y-8 text-center md:max-w-2xl">
            <h1
              ref={titleOnScreen.ref}
              className={clsx(
                "fromBlurAppear text-3xl/tight font-bold text-blue-950 sm:text-4xl/tight md:text-5xl/tight dark:text-white",
                {
                  atScreen: titleOnScreen.isIntersecting,
                },
              )}
            >
              {t.rich("title", {
                gradient: (chunks) => (
                  <span className="bg-gradient-to-br from-blue-600 from-20% via-indigo-400 via-30% to-teal-600 bg-clip-text text-transparent">
                    {chunks}
                  </span>
                ),
              })}
            </h1>
            <p
              ref={descriptionOnScreen.ref}
              className={clsx(
                "fromBlurAppear text-gray-700 dark:text-gray-300",
                {
                  atScreen: descriptionOnScreen.isIntersecting,
                },
              )}
            >
              {t("description")}
            </p>
            <div className="mx-auto flex max-w-md justify-center sm:max-w-xl">
              <Button
                asChild
                size="lg"
                variant="default"
                ref={buttonOnScreen.ref}
                className={clsx("fromBlurAppear", {
                  atScreen: buttonOnScreen.isIntersecting,
                })}
              >
                <a href="mailto:hazimalperata@gmail.com">
                  <Mail size={48} /> {t("getInTouch")}
                </a>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
