import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it, vi } from "vitest";

vi.mock("next-intl/server", () => ({
  setRequestLocale: () => {},
  getTranslations: async ({ locale, namespace }: { locale: string; namespace: string }) => {
    const file = path.join(process.cwd(), "messages", locale, `${namespace}.json`);
    const tree = JSON.parse(readFileSync(file, "utf8")) as Record<string, string>;
    return (key: string) => tree[key];
  },
}));

vi.mock("@/components/gallery/Gallery", () => ({ Gallery: () => null }));
vi.mock("@/components/gallery/GalleryScene", () => ({ GalleryScene: () => null }));

import { generateMetadata } from "./page";

describe("gallery page metadata", () => {
  for (const locale of ["en", "tr"] as const) {
    it(`has a title, description and canonical for ${locale}`, async () => {
      const m = await generateMetadata({ params: Promise.resolve({ locale }) } as never);
      expect(String(m.title).length).toBeGreaterThan(0);
      expect(String(m.description).length).toBeGreaterThan(0);
      expect(m.alternates?.canonical).toBe(locale === "tr" ? "/tr/gallery" : "/gallery");
      expect(m.alternates?.languages).toEqual({ en: "/gallery", tr: "/tr/gallery", "x-default": "/gallery" });
    });
  }
});
