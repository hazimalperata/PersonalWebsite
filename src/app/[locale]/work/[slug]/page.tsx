import type { Metadata } from "next";
import { hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { Container } from "@/components/ui/Container";
import { textLinkClass } from "@/components/ui/TextLink";
import { MdxContent } from "@/components/mdx/mdx-components";
import { ProjectCover, ProjectHeader } from "@/components/work/ProjectHeader";
import { ProjectNav } from "@/components/work/ProjectNav";
import { ProjectScene } from "@/components/work/ProjectScene";
import { Link } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { getProject, getProjectSlugs, getProjects } from "@/lib/content";

// Unknown slugs are unmatched URLs: they get the server-rendered global 404.
export const dynamicParams = false;

export async function generateStaticParams() {
  const slugs = await getProjectSlugs();
  return routing.locales.flatMap((locale) => slugs.map((slug) => ({ locale, slug })));
}

export async function generateMetadata({ params }: PageProps<"/[locale]/work/[slug]">): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  const p = await getProject(slug, locale);
  if (!p) notFound();
  const { meta } = p;
  const title = `${meta.title} · Hazim Alper Ata`;
  // A TR URL without a TR file serves the English text: point search engines at the EN page.
  const canonical = locale === "tr" && !meta.fallback ? `/tr/work/${slug}` : `/work/${slug}`;
  const hasTr = locale === "tr" ? !meta.fallback : (await getProject(slug, "tr"))?.meta.fallback === false;
  return {
    title,
    description: meta.summary,
    openGraph: {
      type: "article",
      title,
      description: meta.summary,
      url: canonical,
      images: [`/api/og/generate?title=${encodeURIComponent(meta.title)}`],
    },
    alternates: {
      canonical,
      languages: {
        en: `/work/${slug}`,
        ...(hasTr ? { tr: `/tr/work/${slug}` } : {}),
        "x-default": `/work/${slug}`,
      },
    },
  };
}

export default async function ProjectPage({ params }: PageProps<"/[locale]/work/[slug]">) {
  const { locale, slug } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);
  const p = await getProject(slug, locale);
  if (!p) notFound();

  const t = await getTranslations("project");
  const all = await getProjects(locale);
  const index = all.findIndex((item) => item.slug === slug);
  const prev = index >= 0 ? all[(index - 1 + all.length) % all.length] : null;
  const next = index >= 0 ? all[(index + 1) % all.length] : null;

  return (
    <Container className="pt-28 pb-24">
      <ProjectScene lane={p.meta.signal} />
      <Link
        href="/#work"
        className={`${textLinkClass} inline-block rounded-full border border-fg/10 bg-bg/80 px-4 py-1.5 text-sm backdrop-blur-md`}
      >
        {t("back")}
      </Link>
      <ProjectHeader meta={p.meta} locale={locale} />
      <ProjectCover meta={p.meta} />
      <div
        className="prose prose-lg mt-10 max-w-3xl rounded-2xl border border-fg/10 bg-bg/85 p-6 backdrop-blur-md md:p-10"
        lang={p.meta.fallback ? "en" : undefined}
      >
        <MdxContent source={p.content} locale={locale} />
      </div>
      {prev && next && prev.slug !== slug ? <ProjectNav prev={prev} next={next} /> : null}
    </Container>
  );
}
