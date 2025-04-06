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
    <div className="w-full px-5">
      <div className="mx-auto py-5 md:py-12 lg:py-14 flex max-w-screen-2xl min-w-0 flex-col items-center space-y-10">
        <div className="mx-auto max-w-2xl space-y-6 text-center">
          <h1
            ref={ref}
            className={clsx(
              "fromBlurAppear md:text-xl lg:text-3xl font-bold capitalize text-gray-900 dark:text-white",
              {
                atScreen: isIntersecting,
              },
            )}
          >
            {t("title")}
          </h1>
        </div>
        {/*<TreeAnimation step={current} className="w-full" />*/}
        <div className="flex flex-row gap-10 w-full">
          <Carousel setApi={setApi} className="w-full">
            <CarouselContent className="flex">
              {keys.map((pair) => (
                <CarouselItem
                  className="basis-[90%] first:pl-5 last:pr-5"
                  key={pair.key}
                >
                  <div className="bg-accent rounded-md h-full p-3 md:p-6 flex justify-between flex-row gap-x-2 md:gap-x-6">
                    <Image
                      src={pair.logo}
                      alt={t(
                        `list.${pair.key}.title` as MessageKeys<string, any>,
                      )}
                      placeholder="blur"
                      width={150}
                      height={150}
                      quality={100}
                      className="rounded-full flex-shrink-0 h-fit w-12 md:w-24 lg:w-32 lg:h-32"
                    />
                    <div className="flex flex-col justify-between gap-2 md:gap-4">
                      <div className="flex flex-col">
                        <h3 className="text-lg lg:text-xl tracking-tight">
                          {t(
                            `list.${pair.key}.title` as MessageKeys<
                              string,
                              any
                            >,
                          )}
                        </h3>
                        <p className="text-muted-foreground text-sm lg:text-base">
                          {t(
                            `list.${pair.key}.description` as MessageKeys<
                              string,
                              any
                            >,
                          )}
                        </p>
                      </div>
                      <p className="text-muted-foreground text-sm lg:text-base">
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
        <span className="text-lg md:text-xl">{t("soon")}</span>
      </div>
    </div>
  );
}
