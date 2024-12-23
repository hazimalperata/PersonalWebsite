import {type SanityDocument} from "next-sanity";

import {client} from "@/sanity/client";
import {Link} from "@/i18n/routing";

const POSTS_QUERY = `*[
  _type == "post"
  && defined(slug.current)
  && language == $language
]|order(publishedAt desc)[0...12]{
  _id,
  title,
  slug,
  publishedAt, 
  "_translations": *[_type == "translation.metadata" && references(^._id)].translations[].value->{
    title,
    slug,
    language
  },
}`;

const options = {next: {revalidate: 30}};

export default async function IndexPage({params}: { params: Promise<{ locale: string }> }) {
  const {locale} = await params;

  const posts = await client.fetch<SanityDocument[]>(POSTS_QUERY, {language: locale}, options);
  console.log(posts);

  return (
    <main className="container mx-auto min-h-screen max-w-3xl p-8">
      <h1 className="text-4xl font-bold mb-8">Posts</h1>
      <ul className="flex flex-col gap-y-4">
        {posts.map((post) => (
          <li className="hover:underline" key={post._id}>
            <Link href={{pathname: "/deneme/[slug]", params: {slug: post.slug.current}}}>
              <h2 className="text-xl font-semibold">{post.title}</h2>
              <p>{new Date(post.publishedAt).toLocaleDateString()}</p>
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
