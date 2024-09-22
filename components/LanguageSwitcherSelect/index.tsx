'use client';

import clsx from 'clsx';
import {ChangeEvent, ReactNode, useTransition} from 'react';
import {Locale, usePathname, useRouter} from '@/i18n/routing';

type LanguageSwitcherSelectProps = {
  children: ReactNode;
  defaultValue: string;
  label: string;
};

export default function LanguageSwitcherSelect({children, defaultValue, label}: LanguageSwitcherSelectProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const pathname = usePathname();

  // TODO UNNECESSARY ???
  // const params = useParams();

  function onSelectChange(event: ChangeEvent<HTMLSelectElement>) {
    const nextLocale = event.target.value as Locale;
    startTransition(() => {
      router.replace(
        pathname,
        {locale: nextLocale}
      );
    });
  }

  return (
    <label
      className={clsx(
        'relative text-white dark:text-gray-700 rounded-full w-[105px] overflow-hidden',
        isPending && 'transition-opacity [&:disabled]:opacity-30'
      )}
    >
      <p className="sr-only">{label}</p>
      <select
        className="inline-flex appearance-none rounded-full py-2 pl-2 pr-5 outline-0 bg-gray-700 dark:bg-gray-200 truncate"
        defaultValue={defaultValue}
        disabled={isPending}
        onChange={onSelectChange}
      >
        {children}
      </select>
      <span className="pointer-events-none absolute right-2 top-1">⌄</span>
    </label>
  );
}
