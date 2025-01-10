"use client";

import { ChevronRight } from "lucide-react";
import * as LucideIcons from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSkeleton,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarSeparator,
  useSidebar,
} from "@/components/ui/sidebar";
import { Blog, LucideIconKey } from "@/types/sanity";
import { PersonalLogo } from "@/components/icons";
import { Link } from "@/i18n/routing";
import ThemeChanger from "@/components/ThemeChanger";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { useTranslations } from "next-intl";
import React, { ElementType, FC } from "react";
import { client } from "@/sanity/client";
import type { SanityImageSource } from "@sanity/image-url/lib/types/types";
import imageUrlBuilder from "@sanity/image-url";
import Image from "next/image";

export default function SideBar({ blogs }: { blogs: Blog[] }) {
  const t = useTranslations("Blog.sideBar");

  const { state } = useSidebar();

  const getIcon = (iconName: string) => {
    const Component = LucideIcons[iconName as LucideIconKey] as FC;
    // TODO
    return <Component />;
  };

  const { projectId, dataset } = client.config();
  const urlFor = (source: SanityImageSource) =>
    projectId && dataset
      ? imageUrlBuilder({ projectId, dataset }).image(source)
      : null;
  const postImageUrl = (image: SanityImageSource) =>
    image ? urlFor(image)?.width(550).height(310).url() : null;

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem className="flex flex-row items-center gap-x-3 min-w-0">
            <Link href="/" className="flex-shrink-0 ml-1">
              <PersonalLogo className="w-6" />
            </Link>
            <div className="text-3xl overflow-hidden select-none">BLOG</div>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarSeparator />
      <SidebarContent>
        {blogs.map((blog) => (
          <React.Fragment key={blog._id}>
            <SidebarSeparator />
            <SidebarGroup>
              <SidebarGroupLabel className="flex flex-row items-center gap-x-2">
                {getIcon(blog.icon.name)}
                {blog.title}
              </SidebarGroupLabel>
              <SidebarMenu>
                {blog.subBlogs.map((subBlog) => (
                  <Collapsible
                    key={subBlog._id}
                    asChild
                    defaultOpen
                    className="group/collapsible"
                  >
                    <SidebarMenuItem>
                      <CollapsibleTrigger asChild>
                        <SidebarMenuButton tooltip={subBlog.title}>
                          {/*{subBlog.image.asset._ref}*/}
                          {/*<Image*/}
                          {/*  src={postImageUrl(subBlog.image)}*/}
                          {/*  alt=""*/}
                          {/*  width={500}*/}
                          {/*  height={300}*/}
                          {/*/>*/}
                          <span>{subBlog.title}</span>
                          <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                        </SidebarMenuButton>
                      </CollapsibleTrigger>
                      <CollapsibleContent>
                        <SidebarMenuSub>
                          {subBlog.articles.length && (
                            <SidebarMenuSubItem>
                              <SidebarMenuSubButton asChild>
                                <Link
                                  href={{
                                    pathname: "/blog/[slug]",
                                    params: {
                                      slug: subBlog.slug.current,
                                    },
                                  }}
                                >
                                  <span>{t("allArticles")}</span>
                                </Link>
                              </SidebarMenuSubButton>
                            </SidebarMenuSubItem>
                          )}
                          {subBlog.articles.map((article) => (
                            <SidebarMenuSubItem key={article.title}>
                              <SidebarMenuSubButton asChild>
                                <Link
                                  href={{
                                    pathname: "/blog/[slug]/[subSlug]",
                                    params: {
                                      slug: subBlog.slug.current,
                                      subSlug: article.slug.current,
                                    },
                                  }}
                                >
                                  <span>{article.title}</span>
                                </Link>
                              </SidebarMenuSubButton>
                            </SidebarMenuSubItem>
                          ))}
                        </SidebarMenuSub>
                      </CollapsibleContent>
                    </SidebarMenuItem>
                  </Collapsible>
                ))}
              </SidebarMenu>
            </SidebarGroup>
          </React.Fragment>
        ))}
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            {state === "expanded" && (
              <div className="flex flex-row items-center justify-between">
                <LanguageSwitcher />
                <ThemeChanger />
              </div>
            )}
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
