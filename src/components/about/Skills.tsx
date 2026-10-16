import { pick, profile } from "@/data/profile";
import type { AppLocale } from "@/i18n/routing";

export function Skills({ locale }: { locale: AppLocale }) {
  return (
    <div className="mt-8 grid gap-x-8 gap-y-6 sm:grid-cols-2">
      {profile.skills.map((group) => (
        <div key={group.title.en}>
          <h4 className="text-base font-medium">{pick(group.title, locale)}</h4>
          <p className="mt-1 text-fg-2">{group.items.join(", ")}</p>
        </div>
      ))}
    </div>
  );
}
