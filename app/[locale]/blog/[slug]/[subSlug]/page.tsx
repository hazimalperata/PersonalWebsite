import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import BlogSideBarWrapper from "@/components/molecules/BlogSideBar";
import { Separator } from "@/components/ui/separator";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { NextPageProps } from "@/types/nextjs";
import { getAllContent } from "@/sanity/client";
import { notFound } from "next/navigation";
import Image from "next/image";
import { Link } from "@/i18n/routing";
import React from "react";
import CustomPortableText from "@/components/sanity/CustomPortableText";

export async function generateStaticParams(
  props: NextPageProps<{ locale: string }>,
) {
  const { locale } = await props.params;
  const blogs = await getAllContent(locale);
  const articles = blogs.map((x) => x.subBlogs.map((y) => y.articles)).flat(2);

  return articles.map((article) => ({
    slug: article.parentSubBlogSlug,
    subSlug: article.slug.current,
  }));
}

export default async function ArticlePage(
  props: NextPageProps<{ slug: string; subSlug: string; locale: string }>,
) {
  const { locale, slug, subSlug } = await props.params;

  const blogs = await getAllContent(locale);
  const articles = blogs.map((x) => x.subBlogs.map((y) => y.articles)).flat(2);
  const article = articles.find(
    (x) => x.slug.current === subSlug && x.parentSubBlogSlug === slug,
  );

  if (!article) return notFound();

  return (
    <SidebarProvider>
      <div className="flex flex-row flex-1 h-full w-full mx-auto">
        <BlogSideBarWrapper locale={locale} />
        <div className="flex flex-col flex-1 w-full">
          <header className="fixed flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12 bg-gradient-to-t from-70% from-white/5 dark:from-black/5 to-black/10 dark:to-white/10  backdrop-blur-md shadow-md w-full">
            <div className="flex items-center gap-2 px-4">
              <SidebarTrigger className="-ml-1" />
              <Separator orientation="vertical" className="mr-2 h-4" />
              <Breadcrumb>
                <BreadcrumbList>
                  <BreadcrumbItem className="hidden md:block">
                    <BreadcrumbLink asChild>
                      <Link href={{ pathname: "/blog" }}>Blog</Link>
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator className="hidden md:block" />
                  <BreadcrumbItem className="hidden md:block">
                    <BreadcrumbLink asChild>
                      <Link
                        href={{
                          pathname: "/blog/[slug]",
                          params: { slug: article.parentSubBlogSlug },
                        }}
                      >
                        {article.parentSubBlogTitle}
                      </Link>
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator className="hidden md:block" />
                  <BreadcrumbItem>
                    <BreadcrumbPage>{article.title}</BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
            </div>
          </header>
          <article className="flex mt-16 flex-col gap-y-20 justify-center items-center h-full max-w-4xl w-full mx-auto">
            {article.imageUrl && (
              <Image
                priority
                src={article.imageUrl}
                alt={article.title}
                className="rounded-xl w-full h-auto"
                width={550}
                height={310}
              />
            )}
            <h1 className="text-4xl font-bold">{article.title}</h1>
            <h1 className="text-2xl font-medium">{article.description}</h1>
            <div className="prose prose-zinc dark:prose-invert w-full">
              <p>
                Published:{" "}
                {new Date(article.publishedAt).toLocaleDateString(undefined, {
                  dateStyle: "full",
                  // timeStyle: "medium",
                })}
              </p>
              <CustomPortableText body={article.body} />
            </div>
          </article>
        </div>
      </div>
    </SidebarProvider>
  );
}
