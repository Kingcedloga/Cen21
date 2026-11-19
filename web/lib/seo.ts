import type { Metadata, Viewport } from "next";

import type { Locale } from "@/i18n/routing";

import { getSiteConfig } from "./content";
import { getCanonicalOrigin, getSiteOrigin } from "./site-url";

/** Fond global du site — aligné sur `--background` / `--color-petrol` (globals.css). */
export const SITE_THEME_COLOR = "#004258";

/** Open Graph / Twitter — `/public/og-image.png` (1200×630). */
export const OG_IMAGE = {
  path: "/og-image.png",
  width: 1200,
  height: 630,
} as const;

function toLocalizedPath(locale: Locale, path: string): string {
  // « / » désigne l'accueil : « /fr », jamais « /fr/ » (redirection).
  if (path === "/") path = "";
  if (locale === "en") return path || "/";
  return path ? `/fr${path}` : "/fr";
}

/**
 * URL absolue sur le domaine officiel (www). Donnée telle quelle, sans
 * résolution par Next.js, qui ajoute une barre finale à « /fr » (« /fr/ »
 * redirige : un lien canonique ou og:url doit être l'adresse finale).
 */
function absoluteUrl(path: string): string {
  const origin = getCanonicalOrigin();
  return path === "/" ? origin : `${origin}${path}`;
}

function languageAlternates(path: string) {
  if (path === "/") path = "";
  return {
    en: absoluteUrl(path || "/"),
    fr: absoluteUrl(path ? `/fr${path}` : "/fr"),
  };
}

export function createPageMetadata({
  title,
  description,
  path = "",
  locale = "en",
  image,
}: {
  title: string;
  description?: string;
  path?: string;
  locale?: Locale;
  /** Image de partage propre à la page (sinon celle du groupe, /og-image.png). */
  image?: { url: string; alt: string };
}): Metadata {
  const site = getSiteConfig(locale);
  const fullTitle =
    title === site.name ? title : `${title} | ${site.name}`;
  const desc = description ?? site.description;
  const pagePath = toLocalizedPath(locale, path);
  const ogLocale = locale === "fr" ? "fr_FR" : "en_US";
  const ogImageAlt = `${site.name} — CEN21 Hospitality & Lifestyle`;
  const shareImages = image
    ? [{ url: image.url, alt: image.alt }]
    : [{ url: OG_IMAGE.path, width: OG_IMAGE.width, height: OG_IMAGE.height, alt: ogImageAlt }];

  return {
    title: fullTitle,
    description: desc,
    // themeColor : dans `siteViewport` (export `viewport` du layout), comme
    // l'exige Next.js 16. Icônes légères dérivées de /logo.png (399 Ko,
    // chargé en haute priorité quand il servait de favicon).
    icons: {
      icon: { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
      apple: { url: "/apple-icon-180.png", sizes: "180x180", type: "image/png" },
    },
    alternates: {
      canonical: absoluteUrl(pagePath),
      languages: languageAlternates(path),
    },
    openGraph: {
      title: fullTitle,
      description: desc,
      url: absoluteUrl(pagePath),
      siteName: site.name,
      locale: ogLocale,
      type: "website",
      images: image ? shareImages : [{ ...shareImages[0], type: "image/png" }],
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description: desc,
      images: shareImages,
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
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover", // Safe Areas iOS (notch, home indicator)
};
