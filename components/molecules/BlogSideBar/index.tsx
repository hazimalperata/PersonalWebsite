import BlogSideBar from "./BlogSideBar";
import { getAllContent } from "@/sanity/client";

export default async function BlogSideBarWrapper({
  locale,
}: {
  locale: string;
}) {
  const contents = await getAllContent(locale);

  return <BlogSideBar blogs={contents} />;
}
