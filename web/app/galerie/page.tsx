import { GalleryGrid } from "@/components/gallery/GalleryGrid";
import { PageHero } from "@/components/sections/PageHero";
import { PageSection } from "@/components/layout/PageSection";
import { SectionWave } from "@/components/layout/SectionWave";
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
      <PageSection variant="default">
        <GalleryGrid items={items} />
      </PageSection>

      <SectionWave fill="petrol" />
    </>
  );
}
