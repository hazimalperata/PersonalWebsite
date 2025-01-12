import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";
import { NextRequest, NextResponse } from "next/server";
import { getArticleFromSubSlug, getSubBlogFromSlug } from "@/sanity/client";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const [, locale, ...segments] = pathname.split("/");

  // Eğer "blog" path'ine ait değilse, direkt olarak intl middleware'ı çalıştır
  if (!segments.includes("blog")) {
    const handleI18nRouting = createMiddleware(routing);
    return handleI18nRouting(request);
  }

  const slug = segments[1]; // İlk segment (ör. 'sapiens-hakkinda')
  const subSlug = segments[2]; // İkinci segment (ör. 'baslangic')

  if (slug && subSlug) {
    const matchedArticle = await getArticleFromSubSlug(locale, subSlug);
    if (matchedArticle && matchedArticle._translations.length) {
      const translatedPath = `/${locale}/blog/${matchedArticle._translations[0].parentSubBlogSlug}/${matchedArticle._translations[0].slug.current}`;
      if (pathname !== translatedPath) {
        return NextResponse.redirect(new URL(translatedPath, request.url));
      }
    }
  } else if (slug) {
    const matchedSubBlog = await getSubBlogFromSlug(locale, slug);
    if (matchedSubBlog && matchedSubBlog._translations.length) {
      const translatedPath = `/${locale}/blog/${matchedSubBlog._translations[0].slug.current}`;
      if (pathname !== translatedPath) {
        return NextResponse.redirect(new URL(translatedPath, request.url));
      }
    }
  }

  // Eğer eşleşen bir içerik yoksa, intl middleware'ı çalıştır
  const handleI18nRouting = createMiddleware(routing);
  return handleI18nRouting(request);
}

export const config = {
  // Match only internationalized pathnames
  matcher: [
    // Enable a redirect to a matching locale at the root
    "/",

    // Set a cookie to remember the previous locale for
    // all requests that have a locale prefix
    "/(tr|en)/:path*",

    // Enable redirects that add missing locales
    // (e.g. `/pathnames` -> `/en/pathnames`)
    "/((?!_next|_vercel|public|files|api|textures|sounds|favicon.*\\..*).*)",
  ],
};
