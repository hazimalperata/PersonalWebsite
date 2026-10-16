import type { ReactNode } from "react";
import { cn } from "@/lib/cn";
import { Container } from "./Container";

export function Section({
  id,
  title,
  className,
  children,
}: {
  id: string;
  title?: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <section id={id} className={cn("scroll-mt-24 py-24 md:py-32", className)}>
      <Container>
        {title && <h2 className="mb-12 font-display text-3xl md:text-4xl">{title}</h2>}
        {children}
      </Container>
    </section>
  );
}
