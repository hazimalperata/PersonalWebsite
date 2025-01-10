import slugify from "@/utils/slugify";
import React from "react";
import { HeadingWithIdBlockProps } from "@/components/sanity/HeadingWithIdBlock/types";

export default function HeadingWithIdBlock(props: HeadingWithIdBlockProps) {
  const headingId = slugify(props.value.children[0].text);

  return (
    <h1 id={headingId} className="scroll-mt-20">
      <a
        href={`#${headingId}`}
        aria-hidden="true"
        tabIndex={-1}
        className="group/heading -ml-8"
      >
        <span className="invisible group-hover/heading:visible opacity-30">
          #{" "}
        </span>
        {props.children}
      </a>
    </h1>
  );
}
