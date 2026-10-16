"use client";

import { useTranslations } from "next-intl";
import { useSyncExternalStore } from "react";
import { cn } from "@/lib/cn";
import { Link, usePathname } from "@/i18n/navigation";
import { Container } from "@/components/ui/Container";
import { LocaleSwitch } from "./LocaleSwitch";
import { ThemeToggle } from "./ThemeToggle";

const links = ["work", "about", "gallery", "contact"] as const;
const THRESHOLD = 8;

function subscribe(onChange: () => void): () => void {
  window.addEventListener("scroll", onChange, { passive: true });
  return () => window.removeEventListener("scroll", onChange);
}
const getSnapshot = () => window.scrollY > THRESHOLD;
const getServerSnapshot = () => false;

const linkClass =
  "shrink-0 rounded-full px-2 py-3.5 text-xs md:px-3 text-fg-2 transition-colors duration-200 ease-out hover:text-fg motion-reduce:transition-none";

export function Header() {
  const t = useTranslations();
  const pathname = usePathname();
  const onHome = pathname === "/";
  const scrolled = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-40 h-16 transition-[background-color,backdrop-filter] duration-300 ease-out motion-reduce:transition-none",
        scrolled && "bg-bg/70 backdrop-blur-md",
      )}
    >
      <Container className="flex h-full items-center gap-2 md:gap-6">
        <Link href="/" className="inline-flex shrink-0 items-center gap-1.5 font-display font-bold text-fg">
          <span aria-hidden="true" className="size-1.5 rounded-[1px] bg-amber" />
          <span>hazim</span>
        </Link>

        <nav
          aria-label={t("a11y.mainNav")}
          className="-my-1.5 flex min-w-0 flex-1 items-center overflow-x-auto p-1.5 pr-8 [mask-image:linear-gradient(to_right,black_85%,transparent)] [scrollbar-width:none] md:justify-center md:pr-1.5 md:[mask-image:none] [&::-webkit-scrollbar]:hidden"
        >
          {links.map((key) =>
            onHome ? (
              <a key={key} href={`#${key}`} className={linkClass}>
                {t(`nav.${key}`)}
              </a>
            ) : (
              <Link key={key} href={`/#${key}`} className={linkClass}>
                {t(`nav.${key}`)}
              </Link>
            ),
          )}
        </nav>

        <div className="ml-3 flex shrink-0 items-center gap-1 md:ml-0 md:gap-3">
          <LocaleSwitch />
          <ThemeToggle />
        </div>
      </Container>
    </header>
  );
}
