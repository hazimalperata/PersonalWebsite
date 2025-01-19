import { NextRequest, NextResponse } from "next/server";
import { isValidSignature, SIGNATURE_HEADER_NAME } from "@sanity/webhook";
import { revalidateTag } from "next/cache";
import { SanityContentTag } from "@/sanity/client";

const secret = process.env.SANITY_REVALIDATE_SECRET;

async function readBody(readable: any) {
  const chunks = [];
  for await (const chunk of readable) {
    chunks.push(typeof chunk === "string" ? Buffer.from(chunk) : chunk);
  }
  return Buffer.concat(chunks).toString("utf8");
}

export async function POST(req: NextRequest) {
  const signature = req.headers.get(SIGNATURE_HEADER_NAME);

  console.error(signature);

  // revalidateTag(SanityContentTag);
  // console.error("Successfully Revalidated");
  console.error(req);
  console.error(req.body);
  const temp_body = await req.json();
  console.error(temp_body);

  // return NextResponse.json("Revalidated", { status: 200 });
  const body = await readBody(req);
  console.error(body);

  try {
    if (!secret) {
      console.log("Secret Problem");
      return NextResponse.json("Secret Error", { status: 500 });
    }

    if (!signature) {
      console.log("Signature Problem");
      return NextResponse.json("No signature.", { status: 401 });
    }

    if (!(await isValidSignature(body, signature, secret))) {
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
