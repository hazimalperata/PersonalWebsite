import { createClient, FilteredResponseQueryOptions } from "next-sanity";
import { Blog, SubBlog } from "@/types/sanity";

export const client = createClient({
  projectId: "trlbkq4k",
  dataset: "production",
  apiVersion: "2024-01-01",
  useCdn: false,
});

const CONTENTS_QUERY = `
  *[_type == "blog" && locale == $locale]{
    _id,
    title,
    icon,
    "subBlogs": *[_type == "subBlog" && parentBlog._ref == ^._id]{
      _id,
      title,
      slug,
      description,
      image,
      parentBlog,
      "_translations": *[_type == "translation.metadata" && references(^._id)].translations[].value->{
        slug,
        locale
      },
      "articles": *[_type == "article" && parentSubBlog._ref == ^._id]{
        _id,
        title,
        slug,
        description,
        image,
        publishedAt,
        "imageUrl": image.asset->url,
        "imageAlt": image.alt,
        "parentSubBlogTitle": parentSubBlog -> title,
        "parentSubBlogSlug": parentSubBlog -> slug.current,
        "_translations": *[_type == "translation.metadata" && references(^._id)].translations[].value->{
          slug,
          locale,
          "parentSubBlogSlug": parentSubBlog -> slug.current,
        },
        body[]{
          ...,
          markDefs[]{
            ...,
            _type == "internalLink" => {
              "slug": @.reference->slug
            }
          }
        }
      }
    }
  }
`;

export const SanityContentTag = "sanity-content-tag";

const options: FilteredResponseQueryOptions = {
  cache: "force-cache",
  next: {
    tags: [SanityContentTag],
  },
};

export async function getAllContent(locale: string) {
  return await client.fetch<Blog[]>(CONTENTS_QUERY, { locale }, options);
}

const subBlogDetailQuery = `
  *[_type == "subBlog" && locale == $locale && slug.current == $slug][0]{
    _id,
    title,
    slug,
    description,
    "imageUrl": image.asset->url,
    "imageAlt": image.alt,
    locale,
  }
`;

export async function getSubBlogDetail(locale: string, slug: string) {
  return await client.fetch<SubBlog>(
    subBlogDetailQuery,
    { locale, slug },
    options,
  );
}

// const subBlogFromSlugQuery = `
//   *[_type == "subBlog" && slug.current == $slug][0] {
//     _id,
//     "_translations": *[_type == "translation.metadata" && references(^._id)].translations[_key == $locale].value->{
//       slug,
//       locale
//     }
//   }
// `;
//
// export async function getSubBlogFromSlug(locale: string, slug: string) {
//   return await client.fetch<SubBlog>(
//     subBlogFromSlugQuery,
//     { locale, slug },
//     options,
//   );
// }
//
// const articleFromSubSlugQuery = `
//  *[_type == "article" && slug.current == $subSlug][0]{
//     _id,
//     "_translations": *[_type == "translation.metadata" && references(^._id)].translations[_key == $locale].value->{
//       slug,
//       locale,
//       "parentSubBlogSlug": parentSubBlog -> slug.current,
//     },
//   }
// `;
//
// export async function getArticleFromSubSlug(locale: string, subSlug: string) {
//   return await client.fetch<Article>(
//     articleFromSubSlugQuery,
//     { locale, subSlug },
//     options,
//   );
// }
