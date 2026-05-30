import type { ReactNode } from "react";

export function LegalArticle({ children }: { children: ReactNode }) {
  return (
    <article className="mx-auto max-w-3xl space-y-8 px-4 py-20 text-base leading-relaxed text-taupe md:px-6 md:py-24 lg:px-8">
      {children}
    </article>
  );
}

export { LegalH2 } from "./LegalH2";

export function LegalP({ children }: { children: ReactNode }) {
  return <p>{children}</p>;
}

export function LegalUl({ children }: { children: ReactNode }) {
  return <ul className="list-inside list-disc space-y-2 pl-1">{children}</ul>;
}
