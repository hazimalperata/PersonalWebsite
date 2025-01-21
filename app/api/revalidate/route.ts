import { NextRequest, NextResponse } from "next/server";
import { isValidSignature, SIGNATURE_HEADER_NAME } from "@sanity/webhook";
import { revalidateTag } from "next/cache";
import { SanityContentTag } from "@/sanity/client";

const secret = process.env.SANITY_REVALIDATE_SECRET;

export async function POST(req: NextRequest) {
  const signature = req.headers.get(SIGNATURE_HEADER_NAME);

  const body = await req.text();

  try {
    if (!secret) {
      return NextResponse.json("Secret Error", { status: 500 });
    }

    if (!signature) {
      return NextResponse.json("No signature.", { status: 401 });
    }

    if (!(await isValidSignature(body, signature, secret))) {
      return NextResponse.json("Invalid signature.", { status: 401 });
    }

    revalidateTag(SanityContentTag);

    return NextResponse.json("Revalidated", { status: 200 });
  } catch (e) {
    return NextResponse.json(`Secret Error ${e}`, { status: 500 });
  }
}
