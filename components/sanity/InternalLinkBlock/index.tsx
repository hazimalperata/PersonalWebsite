import { InternalLinkBlockProps } from "@/components/sanity/InternalLinkBlock/types";
import { Link } from "@/i18n/routing";

export default function InternalLinkBlock(props: InternalLinkBlockProps) {
  const { value, children } = props;

  const slug = value ? value.slug.current : "";

  return (
    <Link
      href={{ pathname: "/blog/[slug]", params: { slug } }}
      className="hover:underline underline-offset-2"
    >
      {children}
    </Link>
  );
}
