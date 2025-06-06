import { ReactNode } from "react";
import "@/styles/globals.scss";
import QueryProvider from "./QueryProvider";

type Props = {
  children: ReactNode;
};

// Since we have a `not-found.tsx` page on the root, a layout file
// is required, even if it's just passing children through.
export default function RootLayout({ children }: Props) {
  return <QueryProvider>{children}</QueryProvider>;
  // return children;
}
