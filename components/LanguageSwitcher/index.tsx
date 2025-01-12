"use client";

import { useLocale, useTranslations } from "next-intl";
import { LOCALES, usePathname, useRouter } from "@/i18n/routing";
import React, { useCallback, useTransition } from "react";
import { Globe } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useParams } from "next/navigation";

export default function LanguageSwitcher() {
  const t = useTranslations("LanguageSwitcher");
  const router = useRouter();
  const currentLocale = useLocale();
  const pathname = usePathname();
  const params = useParams();
  const [isPending, startTransition] = useTransition();

  const onSelectChange = useCallback(
    (locale: string) => {
      if (currentLocale !== locale) {
        startTransition(() => {
          router.replace(
            // @ts-expect-error -- TypeScript will validate that only known `params`
            // are used in combination with a given `pathname`.
            // Since the two will always match for the current route, we can skip runtime checks.
            { pathname, params },
            { locale },
          );
        });
      }
    },
    [currentLocale, params, pathname, router],
  );

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button disabled={isPending} variant="outline" size="icon">
          <Globe className="h-[1.2rem] w-[1.2rem]" />
          <span className="sr-only">{t("label")}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {Object.values(LOCALES).map((locale: string) => (
          <DropdownMenuCheckboxItem
            key={locale}
            checked={currentLocale === locale}
            disabled={currentLocale === locale}
            onCheckedChange={() => onSelectChange(locale)}
          >
            {t("locale", { locale })}
          </DropdownMenuCheckboxItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
