import type { MetadataRoute } from "next";

import { routing } from "@/i18n/routing";
import { getAllSubsidiarySlugs } from "@/lib/content";
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
      const localized = localePath(locale, `/filiales/${slug}`);
      entries.push({
        url: `${origin}${localized}`,
        lastModified: new Date(),
        changeFrequency: "weekly",
        priority: 0.7,
      });
    }
  }

  return entries;
}
