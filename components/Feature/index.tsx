"use client"

import useOnScreen from "@/utils/useOnScreen";
import clsx from "clsx";
import ServiceCard, {Service} from "@/components/Feature/ServiceCard";
import {useTranslations} from "next-intl";
import {MdAutoGraph, MdEnergySavingsLeaf, MdFitbit, MdFormatShapes, MdGroups, MdLockOpen} from "react-icons/md";


export default function Services() {
  const t = useTranslations('HomePage.offerArea');

  const services: Service[] = [
    {
      id: "1",
      title: t('areas.1.title'),
      description: t('areas.1.description'),
      icon: MdGroups,
      transformValues: "100% 100%"
    },
    {
      id: "2",
      title: t('areas.2.title'),
      description: t('areas.2.description'),
      icon: MdAutoGraph,
      transformValues: "50% 100%"
    },
    {
      id: "3",
      title: t('areas.3.title'),
      description: t('areas.3.description'),
      icon: MdFormatShapes,
      transformValues: "0% 100%"
    },
    {
      id: "4",
      title: t('areas.4.title'),
      description: t('areas.4.description'),
      icon: MdEnergySavingsLeaf,
      transformValues: "100% 0%"
    },
    {
      id: "5",
      title: t('areas.5.title'),
      description: t('areas.5.description'),
      icon: MdFitbit,
      transformValues: "50% 0%"
    },
    {
      id: "6",
      title: t('areas.6.title'),
      description: t('areas.6.description'),
      icon: MdLockOpen,
      transformValues: "0% 0%"
    },
  ]

  const titleOnScreen = useOnScreen();
  const descriptionOnScreen = useOnScreen();

  return (
    <section className="py-20">
      <div className="max-w-7xl mx-auto px-5 sm:px-10 md:px-12 lg:px-5 flex flex-col items-center gap-10 xl:gap-14">
        <div className="text-center max-w-3xl mx-auto space-y-4 z-1">
          <h1 ref={titleOnScreen.ref} className={clsx("fromBlurAppear text-gray-900 dark:text-white font-semibold text-4xl", {
            "atScreen": titleOnScreen.isIntersecting
          })}>
            {t('title')}
          </h1>
          <p ref={descriptionOnScreen.ref} className={clsx("fromBlurAppear text-gray-700 dark:text-gray-300", {
            "atScreen": descriptionOnScreen.isIntersecting
          })}>
            {t('description')}
          </p>
        </div>
        <div className="relative grid sm:grid-cols-2 lg:grid-cols-3 gap-6 z-1">
          {services.map(service => (
            <ServiceCard key={service.id} service={service}/>
          ))}
          <div className="absolute w-[70%] h-[300px] rounded-2xl -z-1 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" style={{backgroundSize: "200% auto", backgroundImage: "linear-gradient(-45deg,red,blue)"}}/>
        </div>
      </div>
    </section>
  )
}
