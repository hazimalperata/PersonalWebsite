import {PortableText, type SanityDocument} from "next-sanity";
import imageUrlBuilder from "@sanity/image-url";
import type {SanityImageSource} from "@sanity/image-url/lib/types/types";
import {client} from "@/sanity/client";
import {Link} from "@/i18n/routing";
import DefaultWrapper from "@/components/wrappers/NavbarWrapper";
import {notFound} from "next/navigation";
import Image from "next/image";
import SampleImageComponent from "@/components/atoms/SanityImage";

const POST_QUERY = `*[_type == "post" && slug.current == $slug && language == $language][0]`;

const {projectId, dataset} = client.config();
const urlFor = (source: SanityImageSource) =>
  projectId && dataset
    ? imageUrlBuilder({projectId, dataset}).image(source)
    : null;

const options = {next: {revalidate: 0}};

export default async function PostPage({params}: { params: Promise<{ slug: string, locale: string }> }) {
  const promisedParams = await params;
  const post = await client.fetch<SanityDocument>(POST_QUERY, {slug: promisedParams.slug, language: promisedParams.locale}, options);
  console.log(post)
  if (post === null) return notFound();

  const postImageUrl = post.image
    ? urlFor(post.image)?.width(550).height(310).url()
    : null;

  return (
    <DefaultWrapper>
      <main className="container mx-auto min-h-screen max-w-3xl p-8 flex flex-col gap-4 mt-10">
        <Link href="/deneme" className="hover:underline">
          ← Back to posts
        </Link>
        {postImageUrl && (
          <Image
            src={postImageUrl}
            alt={post.title}
            className="aspect-video rounded-xl"
            width="550"
            height="310"
          />
        )}
        <h1 className="text-4xl font-bold mb-8">{post.title}</h1>
        <div className="prose">
          <p>Published: {new Date(post.publishedAt).toLocaleDateString()}</p>
          {Array.isArray(post.body) && <PortableText components={{
            types: {
              image: SampleImageComponent,
            }
          }} value={post.body}/>}
        </div>
      </main>
    </DefaultWrapper>
  );
}
