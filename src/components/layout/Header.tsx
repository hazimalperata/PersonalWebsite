"use client";

import { useTranslations } from "next-intl";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { cn } from "@/lib/cn";
import { Link, usePathname } from "@/i18n/navigation";
import { Container } from "@/components/ui/Container";
import { useMotionEnabled } from "@/components/signal";
import { LocaleSwitch } from "./LocaleSwitch";

const sections = ["work", "about", "ai", "contact"] as const;
const THRESHOLD = 8;

function subscribe(onChange: () => void): () => void {
  window.addEventListener("scroll", onChange, { passive: true });
  return () => window.removeEventListener("scroll", onChange);
}
const getSnapshot = () => window.scrollY > THRESHOLD;
const getServerSnapshot = () => false;

const linkClass =
  "shrink-0 rounded-full px-3 py-2 text-xs text-fg-2 transition-colors duration-200 ease-out hover:text-fg motion-reduce:transition-none";
const buttonClass =
  "shrink-0 items-center rounded-full bg-fg px-4 py-2 text-xs font-semibold text-bg transition-opacity duration-200 ease-out hover:opacity-85 motion-reduce:transition-none";

export function Header() {
  const t = useTranslations("nav");
  const a11y = useTranslations("a11y");
  const pathname = usePathname();
  const onHome = pathname === "/";
  const motion = useMotionEnabled();
  const scrolled = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const [open, setOpen] = useState(false);
  const toggle = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        toggle.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const close = () => setOpen(false);
  const sectionLink = (key: (typeof sections)[number], className: string) =>
    onHome ? (
      <a key={key} href={`#${key}`} className={className} onClick={close}>
        {t(key)}
      </a>
    ) : (
      <Link key={key} href={`/#${key}`} className={className} onClick={close}>
        {t(key)}
      </Link>
    );

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-40 transition-[background-color,height,backdrop-filter] duration-300 ease-out motion-reduce:transition-none",
        scrolled && motion ? "h-14" : "h-16",
        (scrolled || open) && "bg-bg/80 backdrop-blur-md",
      )}
    >
      <Container className="flex h-full items-center gap-3 md:gap-6">
        <Link href="/" className="shrink-0 font-display text-sm font-semibold text-fg" onClick={close}>
          {t("name")}
        </Link>

        <nav aria-label={a11y("mainNav")} className="hidden min-w-0 flex-1 items-center justify-center md:flex">
          {sections.filter((key) => key !== "contact").map((key) => sectionLink(key, linkClass))}
          <Link href="/gallery" className={linkClass}>
            {t("gallery")}
          </Link>
        </nav>

        <div className="ml-auto flex shrink-0 items-center gap-2 md:ml-0 md:gap-4">
          <LocaleSwitch />
          {onHome ? (
            <a href="#contact" className={cn(buttonClass, "hidden md:inline-flex")}>
              {t("cta")}
            </a>
          ) : (
            <Link href="/#contact" className={cn(buttonClass, "hidden md:inline-flex")}>
              {t("cta")}
            </Link>
          )}
          <button
            ref={toggle}
            type="button"
            className="inline-flex size-10 items-center justify-center rounded-full text-fg md:hidden"
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? t("closeMenu") : t("menu")}
            onClick={() => setOpen((v) => !v)}
          >
            <span aria-hidden="true" className="flex w-5 flex-col gap-1.5">
              <span className={cn("h-px bg-current transition-transform duration-200 motion-reduce:transition-none", open && "translate-y-[3.5px] rotate-45")} />
              <span className={cn("h-px bg-current transition-transform duration-200 motion-reduce:transition-none", open && "-translate-y-[3.5px] -rotate-45")} />
            </span>
          </button>
        </div>
      </Container>

      <nav
        id="mobile-menu"
        aria-label={a11y("mainNav")}
        hidden={!open}
        className="absolute inset-x-0 top-full border-t border-fg-2/15 bg-bg/95 backdrop-blur-md md:hidden"
      >
        <Container className="flex flex-col py-2">
          {sections.map((key) => sectionLink(key, "py-3 text-base text-fg"))}
          <Link href="/gallery" className="py-3 text-base text-fg" onClick={close}>
            {t("gallery")}
          </Link>
        </Container>
      </nav>
    </header>
  );
}
