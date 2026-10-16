"use client";

import { AnimatePresence } from "motion/react";
import { useLocale, useTranslations } from "next-intl";
import Image from "next/image";
import { useCallback, useMemo, useRef, useState } from "react";
import { useMotionEnabled } from "@/components/signal";
import { gallery } from "@/data/gallery";
import type { AppLocale } from "@/i18n/routing";
import { cn } from "@/lib/cn";
import { Lightbox } from "./Lightbox";

export function Gallery() {
  const t = useTranslations("gallery");
  const motion = useMotionEnabled();
  const locale = useLocale() as AppLocale;
  const [open, setOpen] = useState<number | null>(null);
  const thumbs = useRef<Array<HTMLButtonElement | null>>([]);
  const lastOpened = useRef(0);

  const items = useMemo(
    () => gallery.map(({ src, width, height, alt }) => ({ src, width, height, alt: alt[locale] })),
    [locale],
  );

  const show = useCallback((i: number) => {
    lastOpened.current = i;
    setOpen(i);
  }, []);

  const close = useCallback(() => {
    setOpen(null);
    thumbs.current[lastOpened.current]?.focus();
  }, []);

  return (
    <>
      <ul className="columns-2 gap-4 md:columns-3 xl:columns-4">
        {items.map((item, i) => (
          <li key={item.src} className="mb-4 break-inside-avoid">
            <button
              type="button"
              ref={(el) => {
                thumbs.current[i] = el;
              }}
              aria-label={`${t("open")}: ${item.alt}`}
              onClick={() => show(i)}
              className="group block w-full overflow-hidden rounded-lg bg-bg-2 ring-1 ring-white/10 focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-accent"
            >
              <Image
                src={item.src}
                alt=""
                width={item.width}
                height={item.height}
                sizes="(min-width:1280px) 25vw, (min-width:768px) 33vw, 50vw"
                loading="lazy"
                className={cn(
                  "h-auto w-full",
                  motion && "transition-transform duration-300 ease-out [@media(hover:hover)]:group-hover:scale-[1.02]",
                )}
              />
            </button>
          </li>
        ))}
      </ul>
      <AnimatePresence>
        {open !== null && <Lightbox key="lightbox" items={items} index={open} onClose={close} onIndex={show} />}
      </AnimatePresence>
    </>
  );
}
