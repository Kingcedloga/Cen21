import { galleryEntrySrc } from "@/lib/gallery-categories";
import type { GalleryItem, Subsidiary } from "@/lib/types";

/** Photo de la galerie du groupe. `houseSlug` vide : photo du groupe, sans maison. */
export type GalleryPhoto = {
  id: string;
  src: string;
  alt: string;
  houseSlug: string;
};

/**
 * Galerie du groupe (refonte R4) : la sélection de gallery.json puis les
 * galeries des maisons, sans doublons.
 *
 * Ordre : les photos locales (vraies photos des maisons) alternent d'une
 * maison à l'autre, pour que « Toutes » ne commence pas par quarante photos
 * de la même adresse ; les images d'illustration (URL externes) viennent
 * ensuite.
 */
export function buildGalleryPhotos(
  curated: GalleryItem[],
  subsidiaries: Subsidiary[],
  altFor: (name: string, n: number) => string,
): GalleryPhoto[] {
  const seen = new Set<string>();
  const queues = new Map<string, GalleryPhoto[]>();
  const remote: GalleryPhoto[] = [];

  const add = (photo: GalleryPhoto) => {
    if (seen.has(photo.src)) return;
    seen.add(photo.src);
    if (!photo.src.startsWith("/")) {
      remote.push(photo);
      return;
    }
    const queue = queues.get(photo.houseSlug) ?? [];
    queue.push(photo);
    queues.set(photo.houseSlug, queue);
  };

  for (const item of curated) {
    add({ id: item.id, src: item.src, alt: item.alt, houseSlug: item.subsidiarySlug ?? "" });
  }
  for (const s of subsidiaries) {
    s.galleryImages.forEach((entry, i) => {
      add({ id: `${s.slug}-${i}`, src: galleryEntrySrc(entry), alt: altFor(s.name, i + 1), houseSlug: s.slug });
    });
  }

  // Tour de table : une photo par maison, dans l'ordre du groupe.
  const order = ["", ...subsidiaries.map((s) => s.slug)].filter((slug) => queues.has(slug));
  const interleaved: GalleryPhoto[] = [];
  for (let round = 0; interleaved.length < seen.size - remote.length; round += 1) {
    for (const slug of order) {
      const photo = queues.get(slug)?.[round];
      if (photo) interleaved.push(photo);
    }
  }
  return [...interleaved, ...remote];
}
