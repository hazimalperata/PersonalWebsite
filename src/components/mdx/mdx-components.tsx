import type { ComponentProps } from "react";
import Image from "next/image";
import { MDXRemote } from "next-mdx-remote/rsc";
import { Link } from "@/i18n/navigation";
import { NewTabHint } from "@/components/ui/NewTabHint";
import type { AppLocale } from "@/i18n/routing";

const IMAGE_SIZES = "(min-width:1024px) 60vw, 100vw";

export function Figure({ src, alt, width, height, title }: ComponentProps<"img">) {
  if (typeof src !== "string") return null;
  return (
    <figure className="my-8">
      <Image
        src={src}
        alt={alt ?? ""}
        width={Number(width) || 1600}
        height={Number(height) || 1000}
        sizes={IMAGE_SIZES}
        unoptimized={src.toLowerCase().endsWith(".gif")}
        className="h-auto w-full rounded-lg"
      />
      {title ? <figcaption className="mt-2 text-sm opacity-70">{title}</figcaption> : null}
    </figure>
  );
}

export function isExternalHref(href: string): boolean {
  return /^(?:[a-z][a-z0-9+.-]*:|\/\/)/i.test(href);
}

function createAnchor(locale: AppLocale) {
  return function MdxAnchor({ href, children, ...rest }: ComponentProps<"a">) {
    if (!href) return <a {...rest}>{children}</a>;
    if (isExternalHref(href)) {
      if (/^(?:mailto|tel):/i.test(href)) {
        return (
          <a {...rest} href={href}>
            {children}
          </a>
        );
      }
      return (
        <a {...rest} href={href} target="_blank" rel="noopener noreferrer">
          {children}
          <NewTabHint />
        </a>
      );
    }
    if (href.startsWith("#")) {
      return (
        <a {...rest} href={href}>
          {children}
        </a>
      );
    }
    return (
      <Link {...rest} href={href} locale={locale}>
        {children}
      </Link>
    );
  };
}

export function MdxContent({ source, locale }: { source: string; locale: AppLocale }) {
  return <MDXRemote source={source} components={{ img: Figure, a: createAnchor(locale) }} />;
}
