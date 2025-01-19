import { NextRequest } from "next/server";
import { isValidSignature, SIGNATURE_HEADER_NAME } from "@sanity/webhook";
import { revalidateTag } from "next/cache";
import { SanityContentTag } from "@/sanity/client";

const secret = process.env.SANITY_REVALIDATE_SECRET;

export async function POST(req: NextRequest) {
  const signature = req.headers.get(SIGNATURE_HEADER_NAME);
  const data = await req.json();
  if (!secret) {
    console.log("Secret Problem");
    return new Response("Secret Error", { status: 401 });
  }

  if (!signature) {
    console.log("Signature Problem");
    return new Response("No signature.", { status: 401 });
  }

  if (!(await isValidSignature(data, signature, secret))) {
    console.log("Invalid Problem");
    return new Response("Invalid signature.", { status: 401 });
  }

  revalidateTag(SanityContentTag);
  console.log("Successfully Revalidated");

  return new Response("Revalidated", { status: 200 });
}
