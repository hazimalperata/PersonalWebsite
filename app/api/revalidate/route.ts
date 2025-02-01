import { NextRequest, NextResponse } from "next/server";
import { isValidSignature, SIGNATURE_HEADER_NAME } from "@sanity/webhook";
import { revalidatePath, revalidateTag } from "next/cache";
import { SanityContentTag } from "@/sanity/client";
import { Article, SubBlog } from "@/types/sanity";

const secret = process.env.SANITY_REVALIDATE_SECRET;

export async function POST(req: NextRequest) {
  const signature = req.headers.get(SIGNATURE_HEADER_NAME);

  const body = await req.text();

  const jsonBody: Article | SubBlog = await req.json();
  console.log(jsonBody);

  try {
    if (!secret) {
      return NextResponse.json("Secret error!", { status: 500 });
    }

    if (!signature) {
      return NextResponse.json("No signature.", { status: 401 });
    }

    if (!(await isValidSignature(body, signature, secret))) {
      return NextResponse.json("Invalid signature.", { status: 401 });
    }

    if ("parentSubBlogSlug" in jsonBody) {
      revalidatePath(
        `/blog/${jsonBody.parentSubBlogSlug}/${jsonBody.slug.current}`,
      );
    } else {
      revalidatePath(`/blog/${jsonBody.slug.current}`);
    }

    revalidatePath("[locale]/blog/[slug]/[subSlug]");
    revalidateTag(SanityContentTag);

    return NextResponse.json("Revalidated", { status: 200 });
  } catch (e) {
    return NextResponse.json(`Server Error: ${e}`, { status: 500 });
  }
}
