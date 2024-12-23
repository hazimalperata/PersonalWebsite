'use client';

import clsx from 'clsx';
import {ChangeEvent, ReactNode, useTransition} from 'react';
import {Locale, usePathname, useRouter} from '@/i18n/routing';
import {useParams} from "next/navigation";

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
  const params = useParams();

  function onSelectChange(event: ChangeEvent<HTMLSelectElement>) {
    const nextLocale = event.target.value as Locale;
    startTransition(() => {
      router.replace(
        // @ts-expect-error -- TypeScript will validate that only known `params`
        // are used in combination with a given `pathname`.
        // Since the two will always match for the current route, we can skip runtime checks.
        {pathname, params},
        {locale: nextLocale}
      );
    });
  }

  return (
    <label
      className={clsx('relative bg-background h-fit my-auto rounded-full mr-auto overflow-hidden', {
        "transition-opacity opacity-30": isPending
      })}
    >
      <p className="sr-only">{label}</p>
      <select
        className="inline-flex appearance-none rounded-full py-1 text-sm pl-2 pr-5 outline-0 truncate"
        defaultValue={defaultValue}
        disabled={isPending}
        onChange={onSelectChange}
      >
        {children}
      </select>
      <span className="pointer-events-none absolute right-2 -top-1">⌄</span>
    </label>
  );
}
