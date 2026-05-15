import type { MetadataRoute } from "next";

import { getAllSubsidiarySlugs } from "@/lib/content";

const BASE = "https://cen21hospitality.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = [
    "",
    "/a-propos",
    "/filiales",
    "/evenements",
    "/galerie",
    "/contact",
  ].map((path) => ({
    url: `${BASE}${path}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: path === "" ? 1 : 0.8,
  }));

  const subsidiaryRoutes = getAllSubsidiarySlugs().map((slug) => ({
    url: `${BASE}/filiales/${slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  return [...staticRoutes, ...subsidiaryRoutes];
}
