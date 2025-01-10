"use client";

import { useTheme } from "next-themes";
import { useCallback, useEffect, useState } from "react";
import { flushSync } from "react-dom";
import { useTranslations } from "next-intl";
import ThemeChangerLoading from "@/components/ThemeChanger/loading";
import { MdDarkMode, MdLightMode, MdMonitor } from "react-icons/md";
import clsx from "clsx";
import { IconType } from "react-icons";

export default function ThemeChanger() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  const t = useTranslations("ThemeChanger");

  const themeOptions: { icon: IconType; value: "system" | "dark" | "light" }[] =
    [
      { icon: MdDarkMode, value: "dark" },
      { icon: MdMonitor, value: "system" },
      { icon: MdLightMode, value: "light" },
    ];

  const onThemeChange = useCallback(
    (theme: string) => {
      if (document.startViewTransition) {
        document.startViewTransition(() => {
          flushSync(() => {
            setTheme(theme);
          });
        });
      } else {
        setTheme(theme);
      }
    },
    [setTheme],
  );

  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return <ThemeChangerLoading />;
  }

  return (
    <div className="group/theme relative ml-auto flex h-[42px] w-[42px] flex-row gap-x-1 overflow-hidden rounded-full border border-transparent transition-all hover:w-[118px] hover:border-gray-500 dark:hover:border-gray-300">
      {themeOptions.map((option, index) => (
        <button
          key={option.value}
          onClick={() => onThemeChange(option.value)}
          disabled={theme === option.value}
          title={t(option.value)}
          className={clsx(
            "absolute left-0 m-1 rounded-full p-2 transition-all",
            {
              "z-1 bg-gray-700 text-white dark:bg-gray-200 dark:text-gray-700":
                theme === option.value,
              "opacity-0 hover:bg-gray-500 hover:text-gray-200 group-hover:opacity-100 dark:hover:bg-gray-200 dark:hover:text-gray-900":
                theme !== option.value,
              "group-hover/theme:left-[38px]": index === 1,
              "group-hover/theme:left-[76px]": index === 2,
            },
          )}
        >
          {option.icon({ size: 18 })}
        </button>
      ))}
    </div>
  );
}
