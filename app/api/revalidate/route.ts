import { NextRequest, NextResponse } from "next/server";
import { isValidSignature, SIGNATURE_HEADER_NAME } from "@sanity/webhook";
import { revalidateTag } from "next/cache";
import { SanityContentTag } from "@/sanity/client";

const secret = process.env.SANITY_REVALIDATE_SECRET;

export async function GET(req: NextRequest) {
  const signature = req.headers.get(SIGNATURE_HEADER_NAME);
  try {
    const data = await req.json();
    if (!secret) {
      console.log("Secret Problem");
      return NextResponse.json("Secret Error", { status: 500 });
    }

    if (!signature) {
      console.log("Signature Problem");
      return NextResponse.json("No signature.", { status: 401 });
    }

    if (!(await isValidSignature(data, signature, secret))) {
      console.log("Invalid Problem");
      return NextResponse.json("Invalid signature.", { status: 401 });
    }

    revalidateTag(SanityContentTag);
    console.log("Successfully Revalidated");

    return NextResponse.json("Revalidated", { status: 200 });
  } catch (e) {
    return NextResponse.json(`Secret Error ${e}`, { status: 500 });
  }
}
