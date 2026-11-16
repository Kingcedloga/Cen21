import type { MetadataRoute } from "next";

import { routing } from "@/i18n/routing";
import { getAllSubsidiarySlugs, getSubsidiaryBySlug } from "@/lib/content";
import { filialeShareImage } from "@/lib/filiale-seo";
import { getSiteOrigin } from "@/lib/site-url";

const STATIC_PATHS = [
  "",
  "/a-propos",
  "/filiales",
  "/evenements",
  "/galerie",
  "/contact",
  "/mentions-legales",
  "/confidentialite",
  "/cookies",
];

function localePath(locale: (typeof routing.locales)[number], path: string) {
  if (locale === routing.defaultLocale) return path || "/";
  return path ? `/fr${path}` : "/fr";
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const origin = await getSiteOrigin();
  const entries: MetadataRoute.Sitemap = [];

  for (const locale of routing.locales) {
    for (const path of STATIC_PATHS) {
      const localized = localePath(locale, path);
      entries.push({
        url: `${origin}${localized === "/" ? "" : localized}`,
        lastModified: new Date(),
        changeFrequency: "weekly",
        priority:
          path === ""
            ? 1
            : path.startsWith("/mentions") ||
                path === "/confidentialite" ||
                path === "/cookies"
              ? 0.35
              : 0.8,
      });
    }

    for (const slug of getAllSubsidiarySlugs(locale)) {
      const subsidiary = getSubsidiaryBySlug(locale, slug);
      if (!subsidiary || subsidiary.externalUrl) continue;

      const localized = localePath(locale, `/filiales/${slug}`);
      const image = filialeShareImage(subsidiary);
      entries.push({
        url: `${origin}${localized}`,
        lastModified: new Date(),
        changeFrequency: "weekly",
        priority: 0.7,
        // Versions linguistiques de la fiche et sa photo (Google Images).
        alternates: {
          languages: Object.fromEntries(
            routing.locales.map((l) => [l, `${origin}${localePath(l, `/filiales/${slug}`)}`]),
          ),
        },
        images: [image.startsWith("http") ? image : `${origin}${image}`],
      });
    }
  }

  return entries;
}
