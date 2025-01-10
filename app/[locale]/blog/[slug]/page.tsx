import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import BlogSideBar from "@/components/molecules/BlogSideBar";
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
import { client } from "@/sanity/client";
import { SanityCustomDocument, SubBlog } from "@/types/sanity";
import {
  FilteredResponseQueryOptions,
  PortableText,
  type SanityDocument,
} from "next-sanity";
import { notFound } from "next/navigation";
import type { SanityImageSource } from "@sanity/image-url/lib/types/types";
import imageUrlBuilder from "@sanity/image-url";
import Image from "next/image";
import SampleImageComponent from "@/components/atoms/SanityImage";
import { Link } from "@/i18n/routing";
import React from "react";
import slugify from "@/utils/slugify";

const POST_QUERY = `
*[slug.current == $slug && locale == $locale][0]{
  _id,
  title,
  slug,
  description,
  parentBlog,
  _type,
  "imageUrl": image.asset->url,
  "imageAlt": image.alt,
  "parentBlogTitle": parentBlog -> title,
  "parentBlogSlug": parentBlog -> slug.current,
   "articles": *[_type == "article" && parentSubBlog._ref == ^._id]{
        _id,
        title,
        content
      }
}
`;

const options: FilteredResponseQueryOptions = {
  next: { revalidate: 10 },
  cache: "force-cache",
};

const { projectId, dataset } = client.config();
const urlFor = (source: SanityImageSource) =>
  projectId && dataset
    ? imageUrlBuilder({ projectId, dataset }).image(source)
    : null;

export default async function SubBlogPage(
  props: NextPageProps<{ slug: string; locale: string }>,
) {
  const { locale, slug } = await props.params;

  const subBlog = await client.fetch<SubBlog>(
    POST_QUERY,
    { slug, locale },
    options,
  );

  if (subBlog === null) return notFound();

  console.log(subBlog);

  return (
    <SidebarProvider>
      <div className="flex flex-row flex-1 h-full w-full mx-auto">
        <BlogSideBar locale={locale} />
        <div className="flex flex-col flex-1 w-full p-4">
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
