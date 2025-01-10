import { FilteredResponseQueryOptions } from "next-sanity";
import { Blog } from "@/types/sanity";
import SideBar from "./SideBar";
import { client } from "@/sanity/client";

const CONTENTS_QUERY = `
  *[_type == "blog" && locale == $locale]{
    _id,
    title,
    slug,
    icon,
    "subBlogs": *[_type == "subBlog" && parentBlog._ref == ^._id]{
      _id,
      title,
      slug,
      description,
      image,
      parentBlog,
      "articles": *[_type == "article" && parentSubBlog._ref == ^._id]{
        _id,
        title,
        slug,
        description,
        image,
        publishedAt,
        body,
        "imageUrl": image.asset->url,
        "imageAlt": image.alt,
        "parentSubBlogTitle": parentSubBlog -> title,
        "parentSubBlogSlug": parentSubBlog -> slug.current,
      }
    }
  }
`;

const options: FilteredResponseQueryOptions = {
  next: { revalidate: 10 },
  cache: "no-cache",
};

export default async function BlogSideBar({ locale }: { locale: string }) {
  const contents = await client.fetch<Blog[]>(
    CONTENTS_QUERY,
    { locale },
    options,
  );

  return <SideBar blogs={contents} />;
}
