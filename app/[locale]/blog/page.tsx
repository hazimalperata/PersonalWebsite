import { FilteredResponseQueryOptions, type SanityDocument } from "next-sanity";

import { client } from "@/sanity/client";
import { Link } from "@/i18n/routing";
import { NextPageProps } from "@/types/nextjs";
import DefaultWrapper from "@/components/wrappers/NavbarWrapper";
import BlogSideBarWrapper from "@/components/molecules/BlogSideBar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { ContentIllustration } from "@/components/icons";
import { getTranslations } from "next-intl/server";

export default async function BlogMainPage({
  params,
}: NextPageProps<{ locale: string }>) {
  const { locale } = await params;
  const t = await getTranslations("Blog");

  return (
    <SidebarProvider>
      <div className="flex flex-row flex-1 h-full w-full mx-auto">
        <BlogSideBarWrapper locale={locale} />
        <div className="flex flex-col flex-1 w-full p-4">
          <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
            <div className="flex items-center gap-2 px-4">
              <SidebarTrigger className="-ml-1" />
              <Separator orientation="vertical" className="mr-2 h-4" />
              <Breadcrumb>
                <BreadcrumbList>
                  <BreadcrumbItem>
                    <BreadcrumbPage>{t("welcomeTitle")}</BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
            </div>
          </header>
          <section className="flex flex-col gap-y-20 justify-center items-center h-full">
            <div className="flex flex-col items-center text-center gap-y-4">
              <h1 className="text-5xl font-semibold">{t("welcomeTitle")}</h1>
              <h2 className="text-xl font-medium max-w-2xl leading-relaxed">
                {t("welcomeDescription")}
              </h2>
            </div>
            <ContentIllustration className="h-[300px] w-auto" />
          </section>
        </div>
      </div>
    </SidebarProvider>
  );
}
