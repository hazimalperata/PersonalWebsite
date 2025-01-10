import { ReactNode } from "react";
import { ArbitraryTypedObject, PortableTextSpan } from "@portabletext/types";

export interface HeadingWithIdBlockProps {
  value: {
    children: (ArbitraryTypedObject | PortableTextSpan)[];
  };
  children?: ReactNode;
}
