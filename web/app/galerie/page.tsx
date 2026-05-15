import { GalleryGrid } from "@/components/gallery/GalleryGrid";
import { PageHero } from "@/components/sections/PageHero";
import { getGalleryItems } from "@/lib/content";
import { createPageMetadata } from "@/lib/seo";

export const metadata = createPageMetadata({
  title: "Galerie",
  description:
    "Photos et visuels haute résolution des univers Cen21 Hospitality.",
  path: "/galerie",
});

export default function GalleryPage() {
  const items = getGalleryItems();

  return (
    <>
      <PageHero
        eyebrow="Médias"
        title="Galerie"
        description="Une immersion visuelle dans l'univers de nos établissements."
      />
      <section className="py-16 px-4 md:px-6 max-w-7xl mx-auto">
        <GalleryGrid items={items} />
      </section>
    </>
  );
}
