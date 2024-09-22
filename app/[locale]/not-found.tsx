import {useTranslations} from "next-intl";

export default function NotFound() {
  const t = useTranslations('404');
  return (
    <div>
      {t('title')}
    </div>
  )
}
