import type { Metadata } from "next";

import type { Locale } from "@/i18n/routing";

import { getSiteConfig } from "./content";
import { SITE_URL } from "./site-url";

/** Open Graph / Twitter — `/public/og-image.png` (1200×630). */
export const OG_IMAGE = {
  path: "/og-image.png",
  width: 1200,
  height: 630,
} as const;

export function createPageMetadata({
  title,
  description,
  path = "",
  locale = "en",
}: {
  title: string;
  description?: string;
  path?: string;
  locale?: Locale;
}): Metadata {
  const site = getSiteConfig(locale);
  const fullTitle =
    title === site.name ? title : `${title} | ${site.name}`;
  const desc = description ?? site.description;
  const localizedPath =
    locale === "en" ? path || "/" : path ? `/fr${path}` : "/fr";
  const url = `${SITE_URL}${localizedPath === "/" ? "" : localizedPath}`;
  const ogLocale = locale === "fr" ? "fr_FR" : "en_US";
  const ogImageAlt = `${site.name} — CEN21 Hospitality & Lifestyle`;

  return {
    title: fullTitle,
    description: desc,
    icons: {
      icon: "/logo.png",
      apple: "/logo.png",
    },
    alternates: {
      canonical: url,
      languages: {
        en: `${SITE_URL}${path || "/"}`,
        fr: `${SITE_URL}/fr${path || ""}`,
      },
    },
    openGraph: {
      title: fullTitle,
      description: desc,
      url,
      siteName: site.name,
      locale: ogLocale,
      type: "website",
      images: [
        {
          url: OG_IMAGE.path,
          width: OG_IMAGE.width,
          height: OG_IMAGE.height,
          alt: ogImageAlt,
          type: "image/png",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description: desc,
      images: [
        {
          url: OG_IMAGE.path,
          width: OG_IMAGE.width,
          height: OG_IMAGE.height,
          alt: ogImageAlt,
        },
      ],
    },
  };
}

export function createDefaultMetadata(locale: Locale): Metadata {
  const site = getSiteConfig(locale);
  return createPageMetadata({
    title: site.name,
    description: site.description,
    locale,
  });
}
