"use client";

import { Moon, Sun } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useRef, type MouseEvent } from "react";
import { cn } from "@/lib/cn";
import type { Theme } from "@/lib/theme";
import { useTheme } from "./ThemeProvider";

const iconBase =
  "absolute inset-0 m-auto group-data-mounted:transition-[opacity,transform] group-data-mounted:duration-200 group-data-mounted:ease-out motion-reduce:transition-none";

export function ThemeToggle({ className }: { className?: string }) {
  const t = useTranslations("theme");
  const { theme, setTheme } = useTheme();
  const next: Theme = theme === "dark" ? "light" : "dark";
  const ref = useRef<HTMLButtonElement>(null);

  // enables the icon transition only after mount, so the first client render does not animate
  useEffect(() => {
    ref.current?.setAttribute("data-mounted", "");
  }, []);

  function onClick(e: MouseEvent<HTMLButtonElement>) {
    let x = e.clientX;
    let y = e.clientY;
    if (e.detail === 0 || (x === 0 && y === 0)) {
      const rect = e.currentTarget.getBoundingClientRect();
      x = rect.left + rect.width / 2;
      y = rect.top + rect.height / 2;
    }
    setTheme(next, { x, y });
  }

  return (
    <button
      ref={ref}
      type="button"
      onClick={onClick}
      aria-label={t("toggle", { theme: t(next) })}
      className={cn("group relative inline-flex size-10 items-center justify-center rounded-full text-fg", className)}
    >
      <Sun
        size={20}
        aria-hidden="true"
        className={cn(iconBase, theme === "dark" ? "rotate-0 opacity-100" : "-rotate-90 opacity-0")}
      />
      <Moon
        size={20}
        aria-hidden="true"
        className={cn(iconBase, theme === "light" ? "rotate-0 opacity-100" : "rotate-90 opacity-0")}
      />
    </button>
  );
}
