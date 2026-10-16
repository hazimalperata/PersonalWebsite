import { useLocale, useTranslations } from "next-intl";
import { SignalSection } from "@/components/signal";
import { formatProof, type ProofFact } from "@/lib/proof";
import { Reveal } from "./Reveal";
import css from "./home.module.css";

/** The number shown for a fact; also the string the field draws as points. */
export function proofText(fact: ProofFact, locale: "en" | "tr"): string {
  return `${formatProof(fact.value, locale)}${fact.suffix}`;
}

/** One screen per fact. The field draws the number as points; the number stays here as text too. */
export function Proof({ facts }: { facts: ProofFact[] }) {
  const t = useTranslations("home");
  const locale = useLocale() === "tr" ? "tr" : "en";
  return (
    <div id="proof">
      <h2 className="sr-only">{t("proof.heading")}</h2>
      {facts.map((fact, i) => (
        <SignalSection key={fact.id} id={`proof-${i}`} state={`numbers:${i}`}>
          <div className={css.proofStep}>
            <Reveal className={`${css.proofCopy} ${css.panel}`}>
              <div className={css.proofIdx}>
                {String(i + 1).padStart(2, "0")} / {String(facts.length).padStart(2, "0")}
              </div>
              <p className={css.proofBig}>{proofText(fact, locale)}</p>
              <p className={css.proofLbl}>{t(`proof.${fact.id}`, { year: fact.sinceYear ?? "" })}</p>
            </Reveal>
          </div>
        </SignalSection>
      ))}
    </div>
  );
}
