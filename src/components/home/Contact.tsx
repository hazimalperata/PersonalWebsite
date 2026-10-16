import { useTranslations } from "next-intl";
import { SignalSection } from "@/components/signal";
import { NewTabHint } from "@/components/ui/NewTabHint";
import { profile } from "@/data/profile";
import css from "./home.module.css";

export function Contact() {
  const t = useTranslations("home.contact");
  const elsewhere = profile.social.filter((s) => s.icon !== "email");
  return (
    <SignalSection id="contact" state="contact">
      <div className={css.contact}>
        <div className={css.contactIn}>
          <span className={css.tag}>{t("tag")}</span>
          <h2>{t("title")}</h2>
          <a className={css.mail} href={`mailto:${profile.email}`}>
            {profile.email}
          </a>
          <div className={css.btns}>
            <a className={`${css.btn} ${css.btnPrimary}`} href={profile.cv.en} download>
              {t("cv")}
            </a>
          </div>
          <ul className={css.social} aria-label={t("elsewhere")}>
            {elsewhere.map((s) => (
              <li key={s.name}>
                <a href={s.href} target="_blank" rel="noopener noreferrer">
                  {s.name}
                  <NewTabHint />
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </SignalSection>
  );
}
