import type { ComponentPropsWithoutRef } from "react";
import { cn } from "@/lib/cn";

export const textLinkClass =
  "underline decoration-fg-2 decoration-1 underline-offset-4 transition-[text-decoration-color] duration-200 ease-out hover:decoration-fg motion-reduce:transition-none";

/** Inline anchor; use `TextLinkButton` for actions. */
export function TextLink({ className, ...props }: ComponentPropsWithoutRef<"a">) {
  return <a className={cn(textLinkClass, className)} {...props} />;
}

export function TextLinkButton({ className, type = "button", ...props }: ComponentPropsWithoutRef<"button">) {
  return <button type={type} className={cn(textLinkClass, "cursor-pointer", className)} {...props} />;
}
