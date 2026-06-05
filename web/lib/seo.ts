import type { Metadata, Viewport } from "next";

import type { Locale } from "@/i18n/routing";

import { getSiteConfig } from "./content";
import { getSiteOrigin } from "./site-url";

/** Fond global du site — aligné sur `--background` / `--color-petrol` (globals.css). */
export const SITE_THEME_COLOR = "#004258";

/** Open Graph / Twitter — `/public/og-image.png` (1200×630). */
export const OG_IMAGE = {
  path: "/og-image.png",
  width: 1200,
  height: 630,
} as const;

function toLocalizedPath(locale: Locale, path: string): string {
  if (locale === "en") return path || "/";
  return path ? `/fr${path}` : "/fr";
}

function languageAlternates(path: string) {
  return {
    en: path || "/",
    fr: path ? `/fr${path}` : "/fr",
  };
}

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
  const pagePath = toLocalizedPath(locale, path);
  const ogLocale = locale === "fr" ? "fr_FR" : "en_US";
  const ogImageAlt = `${site.name} — CEN21 Hospitality & Lifestyle`;

  return {
    title: fullTitle,
    description: desc,
    themeColor: SITE_THEME_COLOR,
    icons: {
      icon: "/logo.png",
      apple: "/logo.png",
    },
    alternates: {
      canonical: pagePath,
      languages: languageAlternates(path),
    },
    openGraph: {
      title: fullTitle,
      description: desc,
      url: pagePath,
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

/** Metadata de page + `metadataBase` résolu sur le domaine courant. */
export async function resolvePageMetadata(
  input: Parameters<typeof createPageMetadata>[0],
): Promise<Metadata> {
  return {
    metadataBase: new URL(await getSiteOrigin()),
    ...createPageMetadata(input),
  };
}

export async function createDefaultMetadata(locale: Locale): Promise<Metadata> {
  const site = getSiteConfig(locale);
  return resolvePageMetadata({
    title: site.name,
    description: site.description,
    locale,
  });
}

/** Barre d’adresse / overscroll mobile — même teinte que le fond global. */
export const siteViewport: Viewport = {
  themeColor: SITE_THEME_COLOR,
};
