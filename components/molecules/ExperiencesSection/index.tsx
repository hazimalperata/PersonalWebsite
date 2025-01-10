"use client";

import React, { useEffect, useState } from "react";
import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import TreeAnimation from "@/components/molecules/TreeAnimation";
import clsx from "clsx";
import useOnScreen from "@/utils/useOnScreen";
import { MessageKeys, useTranslations } from "next-intl";
import BaykarLogo from "@/public/assets/company_logos/baykar.jpeg";
import InovathingsLogo from "@/public/assets/company_logos/inovathings.jpeg";
import BirlikteLogo from "@/public/assets/company_logos/1likte.jpeg";
import Image from "next/image";

export default function ExperiencesSection() {
  const t = useTranslations("HomePage.experiences");
  const keys = [
    { key: "inovathings", logo: InovathingsLogo },
    { key: "baykar", logo: BaykarLogo },
    { key: "1likte", logo: BirlikteLogo },
  ];

  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);

  const { ref, isIntersecting } = useOnScreen();

  useEffect(() => {
    if (api) {
      api.on("slidesInView", (event) => {
        setCurrent(event.selectedScrollSnap());
      });
      const interval = setInterval(() => {
        setCurrent(api.selectedScrollSnap());
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [api]);

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
            {t("title")}
          </h1>
        </div>
        <TreeAnimation step={current} />
        <div className="flex flex-row gap-10">
          <Carousel setApi={setApi} className="w-full">
            <CarouselContent className="flex ml-5">
              {keys.map((pair) => (
                <CarouselItem className="basis-[90%] pl-5" key={pair.key}>
                  <div className="bg-accent rounded-md h-full lg:col-span-2 p-6 flex justify-between flex-row gap-x-6 min-w-0">
                    <Image
                      src={pair.logo}
                      alt={t(
                        `list.${pair.key}.title` as MessageKeys<string, any>,
                      )}
                      placeholder="blur"
                      width={150}
                      height={150}
                      quality={100}
                      className="rounded-full flex-shrink-0 h-fit"
                    />
                    <div className="flex flex-col justify-between gap-4">
                      <div className="flex flex-col">
                        <h3 className="text-xl tracking-tight">
                          {t(
                            `list.${pair.key}.title` as MessageKeys<
                              string,
                              any
                            >,
                          )}
                        </h3>
                        <p className="text-muted-foreground text-base">
                          {t(
                            `list.${pair.key}.description` as MessageKeys<
                              string,
                              any
                            >,
                          )}
                        </p>
                      </div>
                      <p className="text-muted-foreground text-base">
                        {t(
                          `list.${pair.key}.period` as MessageKeys<string, any>,
                        )}
                      </p>
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        </div>
        <span className="text-xl">{t("soon")}</span>
      </div>
    </section>
  );
}
