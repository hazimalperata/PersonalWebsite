import {useTranslations} from "next-intl";

export default function ThemeChangerLoading() {
  const t = useTranslations('Common');

  return (
    <div role="status" className="animate-pulse">
      <div className="h-[42px] bg-gray-300 rounded-full dark:bg-gray-600 w-[42px]"></div>
      <span className="sr-only">{t('loading')}</span>
    </div>
  )
}
