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

export async function generateStaticParams(
  props: NextPageProps<{ locale: string }>,
) {
  const { locale } = await props.params;
  const blogs = await getAllContent(locale);
  const subBlogs = blogs.map((x) => x.subBlogs).flat();

  return subBlogs.map((subBlog) => ({
    slug: subBlog.slug.current,
  }));
}

export default async function SubBlogPage(
  props: NextPageProps<{ slug: string; locale: string }>,
) {
  const { locale, slug } = await props.params;

  const blogs = await getAllContent(locale);
  const subBlogs = blogs.map((x) => x.subBlogs).flat();
  const subBlog = subBlogs.find((x) => x.slug.current === slug);

  if (subBlog === undefined) return notFound();

  return (
    <SidebarProvider>
      <div className="flex flex-row flex-1 h-full w-full mx-auto">
        <BlogSideBarWrapper locale={locale} />
        <div className="flex flex-col flex-1 w-full">
          <header className="fixed flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
            <div className="flex items-center gap-2 px-4">
              <SidebarTrigger className="-ml-1" />
              <Separator orientation="vertical" className="mr-2 h-4" />
              <Breadcrumb>
                <BreadcrumbList>
                  <BreadcrumbItem className="hidden md:block">
                    <BreadcrumbLink asChild>
                      <Link href="/blog">Blog</Link>
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator className="hidden md:block" />
                  <BreadcrumbItem>
                    <BreadcrumbPage>{subBlog.title}</BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
            </div>
          </header>
          <article className="flex mt-16 flex-col gap-y-20 justify-center items-center h-full max-w-4xl w-full mx-auto">
            {subBlog.imageUrl && (
              <Image
                src={subBlog.imageUrl}
                alt={subBlog.imageAlt}
                className="rounded-xl"
                width="550"
                height="310"
              />
            )}
            <h1 className="text-4xl font-bold">{subBlog.title}</h1>
            <h1 className="text-2xl font-medium">{subBlog.description}</h1>
            <ul>
              {subBlog.articles.map((article) => (
                <li key={article._id}>{article.title}</li>
              ))}
            </ul>
          </article>
        </div>
      </div>
    </SidebarProvider>
  );
}
