import createMiddleware from "next-intl/middleware";
import { Locale, routing } from "./i18n/routing";
import { NextRequest, NextResponse } from "next/server";
import { getAllContent } from "@/sanity/client";
import { updateSession } from "@/utils/supabase/middleware";

const protectedRoutes = ["picker", "login"];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const [, locale, ...segments] = pathname.split("/");
  if (routing.locales.includes(locale as Locale)) {
    const supaResponse = await updateSession(request, locale as Locale);

    if (supaResponse.cookies.has("supaFirst")) {
      return supaResponse;
    }
  }

  const slug = segments[1];
  const subSlug = segments[2];

  if (!segments.includes("blog") && !(slug || subSlug)) {
    const handleI18nRouting = createMiddleware(routing);
    return handleI18nRouting(request);
  }

  const blogs = await getAllContent(locale);

  if (slug && subSlug) {
    let redirectSubBlogPath = null;
    let redirectArticlePath = null;

    const subBlogTranslations = blogs.flatMap((blog) =>
      blog.subBlogs.flatMap((subBlog) => subBlog._translations),
    );

    const matchedSubBlogTranslation = subBlogTranslations.find(
      (translation) => translation.slug.current === slug,
    );

    const articleTranslations = blogs.flatMap((blog) =>
      blog.subBlogs.flatMap((subBlog) =>
        subBlog.articles.flatMap((article) => article._translations),
      ),
    );

    const matchedArticleTranslation = articleTranslations.find(
      (translation) => translation.slug.current === subSlug,
    );

    if (matchedSubBlogTranslation && matchedArticleTranslation) {
      const findLocaleSubBlogTranslation = subBlogTranslations.find(
        (translation) => translation.locale === locale,
      );

      const findLocaleArticleTranslation = articleTranslations.find(
        (translation) => translation.locale === locale,
      );

      if (findLocaleSubBlogTranslation && findLocaleArticleTranslation) {
        redirectSubBlogPath = findLocaleSubBlogTranslation.slug.current;
        redirectArticlePath = findLocaleArticleTranslation.slug.current;
      }
    }

    if (redirectSubBlogPath && redirectArticlePath) {
      const translatedPath = `/${locale}/blog/${redirectSubBlogPath}/${redirectArticlePath}`;
      if (pathname !== translatedPath) {
        return NextResponse.redirect(new URL(translatedPath, request.url));
      }
    }
  } else if (slug) {
    let redirectSubBlogPath = null;

    const subBlogTranslations = blogs.flatMap((blog) =>
      blog.subBlogs.flatMap((subBlog) => subBlog._translations),
    );

    const matchedTranslation = subBlogTranslations.find(
      (translation) => translation.slug.current === slug,
    );

    if (matchedTranslation) {
      const findLocaleTranslation = subBlogTranslations.find(
        (translation) => translation.locale === locale,
      );

      if (findLocaleTranslation) {
        redirectSubBlogPath = findLocaleTranslation.slug.current;
      }
    }

    if (redirectSubBlogPath) {
      const translatedPath = `/${locale}/blog/${redirectSubBlogPath}`;
      if (pathname !== translatedPath) {
        return NextResponse.redirect(new URL(translatedPath, request.url));
      }
    }
  }

  // Default i18n routing
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
