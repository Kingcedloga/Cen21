import type { FilialeContext } from "./context";
import {
  BreadcrumbBar,
  ContactBand,
  DefaultHero,
  DescriptionSection,
  EditorialAbout,
  EventShowcase,
  MobileActions,
  ReadingProgressBar,
  StandardEvents,
  StandardGallery,
  StandardMap,
} from "./sections";

/**
 * Composition par défaut : maison sans composition propre (nouvelle filiale,
 * contenu minimal). Reprend les sections génériques de l'ancienne page.
 */
export function DefaultFilialePage(ctx: FilialeContext) {
  return (
    <>
      <ReadingProgressBar {...ctx} />
      <DefaultHero {...ctx} />
      <BreadcrumbBar {...ctx} />
      <EventShowcase {...ctx} />
      <DescriptionSection {...ctx} />
      <ContactBand {...ctx} />
      <StandardGallery {...ctx} />
      <EditorialAbout {...ctx} />
      {!ctx.useEventShowcase && <StandardEvents {...ctx} />}
      <StandardMap {...ctx} />
      <MobileActions {...ctx} />
    </>
  );
}
