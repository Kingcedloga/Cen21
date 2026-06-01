import type { GalleryItem, Subsidiary, SubsidiaryGalleryEntry } from "./types";

/** Catégories standard — slugs stables pour filtrage et i18n */
export const GALLERY_CATEGORIES = [
  "vibes",
  "ambiance",
  "interior",
  "food",
  "drinks",
  "events",
  "guests",
] as const;

export type GalleryCategory = (typeof GALLERY_CATEGORIES)[number];

const LEGACY_TAG_MAP: Record<string, GalleryCategory> = {
  filiale: "vibes",
  sport: "vibes",
  exterieur: "ambiance",
  terrasse: "ambiance",
  rooftop: "ambiance",
  lounge: "ambiance",
  restaurant: "food",
  gastronomie: "food",
  mexicain: "food",
  pizza: "food",
  boulangerie: "food",
  dessert: "food",
  yaourt: "food",
  cafe: "drinks",
  interieur: "interior",
  nightlife: "events",
  club: "events",
  musique: "events",
  live: "events",
};

export function galleryEntrySrc(entry: SubsidiaryGalleryEntry): string {
  return typeof entry === "string" ? entry : entry.src;
}

export function defaultCategoryForIndex(index: number): GalleryCategory {
  return GALLERY_CATEGORIES[index % GALLERY_CATEGORIES.length];
}

export function normalizeGalleryTags(tags: string[]): GalleryCategory[] {
  const mapped = tags
    .map((tag) => LEGACY_TAG_MAP[tag.toLowerCase()] ?? (isGalleryCategory(tag) ? tag : null))
    .filter((t): t is GalleryCategory => t !== null);
  return mapped.length > 0 ? [...new Set(mapped)] : ["vibes"];
}

function isGalleryCategory(value: string): value is GalleryCategory {
  return (GALLERY_CATEGORIES as readonly string[]).includes(value);
}

function entryToCategories(
  entry: SubsidiaryGalleryEntry,
  index: number,
): GalleryCategory[] {
  if (typeof entry === "string") {
    return [defaultCategoryForIndex(index)];
  }
  if (entry.categories?.length) {
    return entry.categories;
  }
  if (entry.category) {
    return [entry.category];
  }
  return [defaultCategoryForIndex(index)];
}

export function subsidiaryEntryToGalleryItem(
  entry: SubsidiaryGalleryEntry,
  slug: string,
  name: string,
  index: number,
): GalleryItem {
  const src = typeof entry === "string" ? entry : entry.src;
  const categories = entryToCategories(entry, index);
  return {
    id: `${slug}-gal-${index}`,
    src,
    alt: `${name} — ${index + 1}`,
    subsidiarySlug: slug,
    tags: categories,
  };
}

export function buildSubsidiaryGalleryItems(
  subsidiary: Subsidiary,
  extraItems: GalleryItem[] = [],
): GalleryItem[] {
  const fromSubsidiary = subsidiary.galleryImages.map((entry, i) =>
    subsidiaryEntryToGalleryItem(entry, subsidiary.slug, subsidiary.name, i),
  );

  if (fromSubsidiary.length > 0) {
    return fromSubsidiary;
  }

  return extraItems.map((item) => ({
    ...item,
    tags: normalizeGalleryTags(item.tags),
  }));
}

export function categoriesPresentInItems(items: GalleryItem[]): GalleryCategory[] {
  const set = new Set<GalleryCategory>();
  for (const item of items) {
    for (const tag of item.tags) {
      if (isGalleryCategory(tag)) set.add(tag);
    }
  }
  return GALLERY_CATEGORIES.filter((c) => set.has(c));
}
