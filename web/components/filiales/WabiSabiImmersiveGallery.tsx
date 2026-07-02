"use client";

import { FilialMarqueeGallery } from "@/components/filiales/FilialMarqueeGallery";
import type { GalleryItem } from "@/lib/types";

type Props = {
  items: GalleryItem[];
  title: string;
  description: string;
};

export function WabiSabiImmersiveGallery({ items, title, description }: Props) {
  return (
    <FilialMarqueeGallery
      items={items}
      title={title}
      description={description}
      variant="wabi-sabi"
      sectionId="wabi-sabi-gallery"
      extraClassName="wabi-immersive-gallery"
    />
  );
}
