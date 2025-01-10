"use client";

import { PortableText } from "next-sanity";
import HeadingWithIdBlock from "@/components/sanity/HeadingWithIdBlock";
import SampleImageComponent from "@/components/atoms/SanityImage";
import CodeBlock from "@/components/sanity/CodeBlock";
import React from "react";
import InternalLinkBlock from "@/components/sanity/InternalLinkBlock";
import ExternalLinkBlock from "@/components/sanity/ExternalLinkBlock";

export default function CustomPortableText({ body }: { body: [] }) {
  return (
    Array.isArray(body) && (
      <PortableText
        components={{
          marks: {
            internalLink: InternalLinkBlock,
            link: ExternalLinkBlock,
          },
          block: {
            h1: HeadingWithIdBlock,
          },
          types: {
            image: SampleImageComponent,
            code: CodeBlock,
          },
        }}
        value={body}
      />
    )
  );
}
