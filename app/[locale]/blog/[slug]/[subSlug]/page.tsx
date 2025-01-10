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
import { Article, SanityCustomDocument } from "@/types/sanity";
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
import CodeBlock from "@/components/sanity/CodeBlock";
import HeadingWithIdBlock from "@/components/sanity/HeadingWithIdBlock";
import CustomPortableText from "@/components/sanity/CustomPortableText";

const POST_QUERY = `
*[_type == "article" && slug.current == $subSlug && locale == $locale && parentSubBlog->slug.current == $slug][0]{
  _id,
  title,
  slug,
  description,
  publishedAt,
  _type,
  "imageUrl": image.asset->url,
  "parentSubBlogTitle": parentSubBlog -> title,
  "parentSubBlogSlug": parentSubBlog -> slug.current,
  "translations": *[_type == "translation.metadata" && references(^._id)].translations[].value->{
    title,
    slug,
    locale
  },
  body[]{
    ...,
    markDefs[]{
      ...,
      _type == "internalLink" => {
        "slug": @.reference->slug
      }
    }
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
// const postImageUrl = post.image
//   ? urlFor(post.image)?.width(550).height(310).url()
//   : null;

export default async function ArticlePage(
  props: NextPageProps<{ slug: string; subSlug: string; locale: string }>,
) {
  const { locale, slug, subSlug } = await props.params;

  const article = await client.fetch<Article>(
    POST_QUERY,
    { slug, subSlug, locale },
    options,
  );

  console.log("Article:", article);

  if (article === null) return notFound();

  return (
    <SidebarProvider>
      <div className="flex flex-row flex-1 h-full w-full mx-auto">
        <BlogSideBar locale={locale} />
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
