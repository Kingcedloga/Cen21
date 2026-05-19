import type { MetadataRoute } from "next";

import { routing } from "@/i18n/routing";
import { getAllSubsidiarySlugs } from "@/lib/content";
import { SITE_URL } from "@/lib/site-url";

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

export default function sitemap(): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = [];

  for (const locale of routing.locales) {
    for (const path of STATIC_PATHS) {
      const localized = localePath(locale, path);
      entries.push({
        url: `${SITE_URL}${localized === "/" ? "" : localized}`,
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
        url: `${SITE_URL}${localized}`,
        lastModified: new Date(),
        changeFrequency: "weekly",
        priority: 0.7,
      });
    }
  }

  return entries;
}
