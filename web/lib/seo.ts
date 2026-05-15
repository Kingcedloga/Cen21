import type { Metadata } from "next";

import { getSiteConfig } from "./content";

const site = getSiteConfig();

export function createPageMetadata({
  title,
  description,
  path = "",
}: {
  title: string;
  description?: string;
  path?: string;
}): Metadata {
  const fullTitle =
    title === site.name ? title : `${title} | ${site.name}`;
  const desc = description ?? site.description;
  const url = `https://cen21hospitality.com${path}`;

  return {
    title: fullTitle,
    description: desc,
    icons: {
      icon: "/logo.png",
      apple: "/logo.png",
    },
    openGraph: {
      title: fullTitle,
      description: desc,
      url,
      siteName: site.name,
      locale: "fr_FR",
      type: "website",
      images: [{ url: "/logo.png", width: 512, height: 512, alt: site.name }],
    },
  };
}

export const defaultMetadata = createPageMetadata({
  title: site.name,
  description: site.description,
});
