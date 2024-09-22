'use client'

import {useTheme} from 'next-themes'
import {useCallback, useEffect, useState} from 'react'
import {flushSync} from 'react-dom'
import {useTranslations} from "next-intl";
import ThemeChangerLoading from "@/components/ThemeChanger/loading";
import {MdDarkMode, MdLightMode, MdMonitor} from 'react-icons/md';
import clsx from 'clsx';
import {IconType} from "react-icons";

export default function ThemeChanger() {
  const [mounted, setMounted] = useState(false)
  const {theme, setTheme} = useTheme();

  const t = useTranslations('ThemeChanger');

  const themeOptions: { icon: IconType, value: "system" | "dark" | "light" }[] = [
    {icon: MdDarkMode, value: 'dark'},
    {icon: MdMonitor, value: 'system'},
    {icon: MdLightMode, value: 'light'},
  ]

  const onThemeChange = useCallback((theme: string) => {
    if (!!document.startViewTransition) {
      document.startViewTransition(() => {
        flushSync(() => {
          setTheme(theme);
        });
      });
    } else {
      setTheme(theme);
    }
  }, [setTheme]);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <ThemeChangerLoading/>
  }

  return (
    <div className="flex flex-row rounded-full border border-transparent hover:border-gray-500 dark:hover:border-gray-300 gap-x-1 group transition-all relative h-[42px] w-[42px] hover:w-[118px] overflow-hidden">
      {themeOptions.map((option, index) => (
        <button
          key={option.value}
          onClick={() => onThemeChange(option.value)}
          disabled={theme === option.value}
          title={t(option.value)}
          className={clsx("p-2 rounded-full transition-all absolute m-1 left-0", {
            "bg-gray-700 dark:bg-gray-200 text-white dark:text-gray-700 z-1": theme === option.value,
            "hover:bg-gray-500 dark:hover:bg-gray-200 hover:text-gray-200 dark:hover:text-black opacity-0 group-hover:opacity-100": theme !== option.value,
            "group-hover:left-[38px]": index === 1,
            "group-hover:left-[76px]": index === 2,
          })}
        >
          {option.icon({fontSize: 18})}
        </button>
      ))}
    </div>
  )
}
