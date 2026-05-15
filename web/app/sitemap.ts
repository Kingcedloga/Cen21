import type { MetadataRoute } from "next";

import { getAllSubsidiarySlugs } from "@/lib/content";
import { SITE_URL } from "@/lib/site-url";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = [
    "",
    "/a-propos",
    "/filiales",
    "/evenements",
    "/galerie",
    "/contact",
    "/mentions-legales",
    "/confidentialite",
    "/cookies",
  ].map((path) => ({
    url: `${SITE_URL}${path}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority:
      path === ""
        ? 1
        : path.startsWith("/mentions") ||
            path === "/confidentialite" ||
            path === "/cookies"
          ? 0.35
          : 0.8,
  }));

  const subsidiaryRoutes = getAllSubsidiarySlugs().map((slug) => ({
    url: `${SITE_URL}/filiales/${slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  return [...staticRoutes, ...subsidiaryRoutes];
}
