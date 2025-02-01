import { NextRequest, NextResponse } from "next/server";
import { isValidSignature, SIGNATURE_HEADER_NAME } from "@sanity/webhook";
import { revalidatePath, revalidateTag } from "next/cache";
import { SanityContentTag } from "@/sanity/client";

const secret = process.env.SANITY_REVALIDATE_SECRET;

export async function POST(req: NextRequest) {
  const signature = req.headers.get(SIGNATURE_HEADER_NAME);

  const body = await req.text();

  // const jsonBody: Article | SubBlog = await req.json();
  // console.log(jsonBody);
  // console.log("BODY:", body);

  // {"_id":"926a92a5-b9d5-4a18-9ae7-225bbf2d459e","_type":"article","slug":{"_type":"slug","current":"ilk-adima-hosgeldiniz"}}

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

    revalidatePath("[locale]/blog/[slug]/[subSlug]", "page");
    revalidateTag(SanityContentTag);

    return NextResponse.json("Revalidated", { status: 200 });
  } catch (e) {
    return NextResponse.json(`Server Error: ${e}`, { status: 500 });
  }
}
