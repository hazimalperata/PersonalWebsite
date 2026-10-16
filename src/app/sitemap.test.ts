import { describe, expect, it } from "vitest";
import sitemap from "./sitemap";

describe("sitemap", () => {
  it("lists the gallery in both locales with hreflang alternates", async () => {
    const entries = await sitemap();
    const base = "https://www.hazimalperata.com";
    const languages = { en: `${base}/gallery`, tr: `${base}/tr/gallery`, "x-default": `${base}/gallery` };
    for (const url of [`${base}/gallery`, `${base}/tr/gallery`]) {
      const entry = entries.find((e) => e.url === url);
      expect(entry, url).toBeTruthy();
      expect(entry?.alternates?.languages).toEqual(languages);
    }
  });
});
