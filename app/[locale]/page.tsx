import {useTranslations} from 'next-intl';
import {Link} from '@/i18n/routing';
import LanguageSwitcher from "@/components/LanguageSwitcher";
import ThemeChanger from "@/components/ThemeChanger";
import ThemeChangerLoading from "@/components/ThemeChanger/loading";
import Header from "@/components/Header";
import EntrySection from "@/components/EntrySection";

export default function HomePage() {
  const t = useTranslations('HomePage');

  return (
    <div>
      <Header/>
      <EntrySection/>
      <div className="h-[4000px] bg-red-300">
        sa knk
      </div>
      {/*<h1 className="dark:text-white text-black">{t('title')}</h1>*/}
      {/*<Link href="/about">{t('about')}</Link>*/}
      {/*<LanguageSwitcher/>*/}
      {/*<ThemeChanger/>*/}
      {/*<ThemeChangerLoading/>*/}
    </div>
  );
}
