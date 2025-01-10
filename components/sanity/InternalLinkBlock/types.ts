import { SanitySlug } from "@/types/sanity";
import { ReactNode } from "react";

export interface InternalLinkBlockProps {
  value?: {
    slug: SanitySlug;
  };
  children?: ReactNode;
}
