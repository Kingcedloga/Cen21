/** Photos de fond — section contact pratique (par filiale). */
export const SUBSIDIARY_CONTACT_IMAGES: Record<string, string> = {
  "filiale-01":
    "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1600&q=80",
  "filiale-02":
    "https://images.unsplash.com/photo-1579584425555-c3ce17fd1871?w=1600&q=80",
  "filiale-03": "/filiales/photos/filiale-03/gallery/05-dsc01050.webp",
  "filiale-04": "/filiales/photos/filiale-04/gallery/08-dsc-6684-modifier.webp",
  "filiale-05":
    "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=1600&q=80",
  "filiale-06":
    "https://images.unsplash.com/photo-1509048199710-4ce6f31643b1?w=1600&q=80",
  "filiale-07":
    "https://images.unsplash.com/photo-1565299585323-38174c5544aa?w=1600&q=80",
  "filiale-08":
    "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=1600&q=80",
  "filiale-09":
    "https://images.unsplash.com/photo-1488477181946-6428a0291777?w=1600&q=80",
  "filiale-10":
    "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=1600&q=80",
};

export function getSubsidiaryContactImage(
  slug: string,
  fallback?: string,
): string {
  return SUBSIDIARY_CONTACT_IMAGES[slug] ?? fallback ?? SUBSIDIARY_CONTACT_IMAGES["filiale-01"];
}
