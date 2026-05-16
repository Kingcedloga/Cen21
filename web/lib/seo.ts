import type { Metadata } from "next";

import { getSiteConfig } from "./content";
import { SITE_URL } from "./site-url";

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
  const url = `${SITE_URL}${path}`;

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
      images: [
        {
          url: "/og-image.png",
          width: 300,
          height: 169,
          alt: `${site.name} — logo`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description: desc,
      images: ["/og-image.png"],
    },
  };
}

export const defaultMetadata = createPageMetadata({
  title: site.name,
  description: site.description,
});
