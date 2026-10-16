import type { MetadataRoute } from "next";
import { getProject, getProjectSlugs } from "@/lib/content";
import { siteUrl } from "@/lib/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const today = new Date().toISOString().split("T")[0];
  const homeLanguages = { en: `${siteUrl}/`, tr: `${siteUrl}/tr`, "x-default": `${siteUrl}/` };
  const entries: MetadataRoute.Sitemap = [
    { url: `${siteUrl}/`, lastModified: today, alternates: { languages: homeLanguages } },
    { url: `${siteUrl}/tr`, lastModified: today, alternates: { languages: homeLanguages } },
  ];

  const slugs = await getProjectSlugs();
  const projects = await Promise.all(
    slugs.map(async (slug) => {
      const [en, tr] = await Promise.all([getProject(slug, "en"), getProject(slug, "tr")]);
      return { slug, lastModified: en?.meta.publishedAt || today, hasTr: tr !== null && !tr.meta.fallback };
    }),
  );

  for (const { slug, lastModified, hasTr } of projects) {
    const languages = {
      en: `${siteUrl}/work/${slug}`,
      ...(hasTr ? { tr: `${siteUrl}/tr/work/${slug}` } : {}),
      "x-default": `${siteUrl}/work/${slug}`,
    };
    entries.push({ url: `${siteUrl}/work/${slug}`, lastModified, alternates: { languages } });
    if (hasTr) entries.push({ url: `${siteUrl}/tr/work/${slug}`, lastModified, alternates: { languages } });
  }
  return entries;
}
