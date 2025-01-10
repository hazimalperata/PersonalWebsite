import { ReactNode } from "react";

export interface ExternalLinkBlockProps {
  value?: {
    url: string;
  };
  children?: ReactNode;
}
