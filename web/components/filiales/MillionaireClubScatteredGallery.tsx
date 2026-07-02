"use client";

import { FilialMarqueeGallery } from "@/components/filiales/FilialMarqueeGallery";
import type { GalleryItem } from "@/lib/types";

type Props = {
  items: GalleryItem[];
  title: string;
  description?: string;
};

export function MillionaireClubScatteredGallery({ items, title, description }: Props) {
  return (
    <FilialMarqueeGallery
      items={items}
      title={title}
      description={description ?? ""}
      variant="millionnaire"
      sectionId="millionnaire-gallery"
    />
  );
}
