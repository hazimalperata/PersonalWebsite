"use client";

import useOnScreen from "@/utils/useOnScreen";
import clsx from "clsx";
import ServiceCard, { Service } from "@/components/Feature/ServiceCard";
import { useTranslations } from "next-intl";
import {
  MdAutoGraph,
  MdEnergySavingsLeaf,
  MdFitbit,
  MdFormatShapes,
  MdGroups,
  MdLockOpen,
} from "react-icons/md";

export default function Services() {
  const t = useTranslations("HomePage.offerArea");

  const services: Service[] = [
    {
      id: "1",
      title: t("areas.1.title"),
      description: t("areas.1.description"),
      icon: MdGroups,
      transformValues: "100% 100%",
    },
    {
      id: "2",
      title: t("areas.2.title"),
      description: t("areas.2.description"),
      icon: MdAutoGraph,
      transformValues: "50% 100%",
    },
    {
      id: "3",
      title: t("areas.3.title"),
      description: t("areas.3.description"),
      icon: MdFormatShapes,
      transformValues: "0% 100%",
    },
    {
      id: "4",
      title: t("areas.4.title"),
      description: t("areas.4.description"),
      icon: MdEnergySavingsLeaf,
      transformValues: "100% 0%",
    },
    {
      id: "5",
      title: t("areas.5.title"),
      description: t("areas.5.description"),
      icon: MdFitbit,
      transformValues: "50% 0%",
    },
    {
      id: "6",
      title: t("areas.6.title"),
      description: t("areas.6.description"),
      icon: MdLockOpen,
      transformValues: "0% 0%",
    },
  ];

  const titleOnScreen = useOnScreen();
  const descriptionOnScreen = useOnScreen();

  return (
    <section className="py-20">
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-10 px-5 sm:px-10 md:px-12 lg:px-5 xl:gap-14">
        <div className="z-1 mx-auto max-w-3xl space-y-4 text-center">
          <h1
            ref={titleOnScreen.ref}
            className={clsx(
              "fromBlurAppear text-4xl font-semibold text-gray-900 dark:text-white",
              {
                atScreen: titleOnScreen.isIntersecting,
              },
            )}
          >
            {t("title")}
          </h1>
          <p
            ref={descriptionOnScreen.ref}
            className={clsx("fromBlurAppear text-gray-700 dark:text-gray-300", {
              atScreen: descriptionOnScreen.isIntersecting,
            })}
          >
            {t("description")}
          </p>
        </div>
        <div className="relative z-1 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => (
            <ServiceCard key={service.id} service={service} />
          ))}
          <div
            className="absolute left-1/2 top-1/2 -z-1 h-3/5 w-[70%] -translate-x-1/2 -translate-y-1/2 rounded-2xl"
            style={{
              backgroundSize: "200% auto",
              backgroundImage: "linear-gradient(-45deg,red,blue)",
            }}
          />
        </div>
      </div>
    </section>
  );
}
