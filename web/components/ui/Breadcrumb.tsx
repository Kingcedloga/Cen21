import Link from "next/link";
import { ChevronRight, Home } from "@/lib/icons";

import { getSiteOrigin } from "@/lib/site-url";

export type BreadcrumbItem = {
  label: string;
  href?: string;
};

export async function Breadcrumb({
  items,
  className = "",
}: {
  items: BreadcrumbItem[];
  className?: string;
}) {
  if (!items.length) return null;

  const origin = await getSiteOrigin();
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.label,
      ...(item.href ? { item: `${origin}${item.href}` } : {}),
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <nav
        aria-label="Fil d'Ariane"
        className={`flex flex-wrap items-center gap-1.5 text-sm text-ivory/70 ${className}`}
      >
        <ol className="flex flex-wrap items-center gap-1.5">
          {items.map((item, i) => {
            const isLast = i === items.length - 1;
            const isFirst = i === 0;
            return (
              <li key={`${item.label}-${i}`} className="flex items-center gap-1.5">
                {!isFirst && (
                  <ChevronRight
                    className="h-3.5 w-3.5 text-ivory/40"
                    aria-hidden
                  />
                )}
                {item.href && !isLast ? (
                  <Link
                    href={item.href}
                    className="inline-flex items-center gap-1.5 rounded-md px-1.5 py-0.5 text-ivory/75 transition-colors duration-fine hover:text-gold focus-visible:outline-2 focus-visible:outline-gold cursor-pointer"
                  >
                    {isFirst && <Home className="h-3.5 w-3.5" aria-hidden />}
                    <span>{item.label}</span>
                  </Link>
                ) : (
                  <span
                    aria-current={isLast ? "page" : undefined}
                    className={`inline-flex items-center gap-1.5 px-1.5 py-0.5 ${
                      isLast ? "font-medium text-gold" : "text-ivory/75"
                    }`}
                  >
                    {isFirst && <Home className="h-3.5 w-3.5" aria-hidden />}
                    <span>{item.label}</span>
                  </span>
                )}
              </li>
            );
          })}
        </ol>
      </nav>
    </>
  );
}
