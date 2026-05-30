import { getSiteOrigin } from "@/lib/site-url";

import { BreadcrumbNav } from "./BreadcrumbNav";

export type BreadcrumbItem = {
  label: string;
  href?: string;
};

export async function Breadcrumb({
  items,
  className = "",
  animate = false,
}: {
  items: BreadcrumbItem[];
  className?: string;
  /** Fade slide depuis le haut (pages filiales) */
  animate?: boolean;
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
      <BreadcrumbNav items={items} className={className} animate={animate} />
    </>
  );
}
