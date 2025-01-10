import { ExternalLinkBlockProps } from "@/components/sanity/ExternalLinkBlock/types";
import { ExternalLink } from "lucide-react";

export default function ExternalLinkBlock(props: ExternalLinkBlockProps) {
  const { value, children } = props;
  const href = value?.url;

  return (
    <a
      target="_blank"
      href={href}
      rel="noopener noreferrer"
      className="inline-flex flex-row items-center gap-x-1 hover:underline underline-offset-2"
    >
      {children}
      <ExternalLink size={14} />
    </a>
  );
}
