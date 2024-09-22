'use client'

import {useLocale, useTranslations} from 'next-intl';
import {LOCALES} from '@/i18n/routing';
import LanguageSwitcherSelect from "@/components/LanguageSwitcherSelect";

export default function LanguageSwitcher() {
  const t = useTranslations('LanguageSwitcher');
  const locale = useLocale();

  return (
    <LanguageSwitcherSelect defaultValue={locale} label={t('label')}>
      {Object.values(LOCALES).map((cur) => (
        <option key={cur} value={cur} className="text-tiny text-white dark:text-gray-700 w-min">
          {t('locale', {locale: cur})}
        </option>
      ))}
    </LanguageSwitcherSelect>
  );
}
