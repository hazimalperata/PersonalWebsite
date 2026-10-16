import type { ComponentPropsWithoutRef } from "react";
import { cn } from "@/lib/cn";
import { Link } from "@/i18n/navigation";

type Variant = "primary" | "ghost";

const base =
  "inline-flex h-12 items-center justify-center rounded-full px-6 transition-[background-color,border-color,color,filter] duration-200 ease-out motion-reduce:transition-none";
const variants: Record<Variant, string> = {
  primary: "bg-amber font-medium text-on-amber hover:brightness-95",
  ghost: "border border-fg-2/40 text-fg hover:border-fg",
};

type Common = { variant?: Variant };
type AsLink = Common & { href: string } & Omit<ComponentPropsWithoutRef<"a">, "href">;
type AsButton = Common & { href?: undefined } & ComponentPropsWithoutRef<"button">;

/** Renders `Link` for internal paths, `<a>` for anchors and external URLs, `<button>` otherwise. */
export function Button(props: AsLink | AsButton) {
  if (props.href !== undefined) {
    const { variant = "primary", className, href, ...anchorProps } = props;
    const classes = cn(base, variants[variant], className);
    const isFile = /\.[a-z0-9]+$/i.test(href.split(/[?#]/)[0]);
    if (href.startsWith("/") && !href.startsWith("//") && !isFile) {
      return <Link href={href} className={classes} {...anchorProps} />;
    }
    const external = href.startsWith("http") || href.startsWith("//");
    return (
      <a
        href={href}
        className={classes}
        {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
        {...anchorProps}
      />
    );
  }
  const { variant = "primary", className, href: _unused, ...buttonProps } = props;
  void _unused;
  return <button type="button" className={cn(base, variants[variant], className)} {...buttonProps} />;
}
