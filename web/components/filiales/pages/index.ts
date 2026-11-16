import type { ReactNode } from "react";

import type { FilialeContext } from "./context";
import { GourmetMexicanaPage } from "./gourmet-mexicana";
import { KLoungePage } from "./k-lounge";
import { MillionaireClubPage } from "./millionaire-club";
import { MokaMorePage } from "./moka-more";
import { MuzikCafePage } from "./muzik-cafe";
import { OliveVertePage } from "./olive-verte";
import { WabiSabiPage } from "./wabi-sabi";

export { buildFilialeContext, type FilialeContext } from "./context";

/**
 * Une composition par maison (refonte R5 à R12) : chaque fiche liste ses
 * sections dans l'ordre, avec les blocs du socle (components/filiales/blocks)
 * et les composants propres à la maison.
 */
const COMPOSITIONS: Record<string, (ctx: FilialeContext) => ReactNode | Promise<ReactNode>> = {
  "olive-verte": OliveVertePage,
  "wabi-sabi": WabiSabiPage,
  "k-lounge": KLoungePage,
  "millionaire-club": MillionaireClubPage,
  "cafe-muzik": MuzikCafePage,
  "muzik-cafe": MuzikCafePage,
  "moka-more": MokaMorePage,
  "gourmet-mexicana": GourmetMexicanaPage,

  // Anciens slugs pour rétrocompatibilité
  "filiale-01": OliveVertePage,
  "filiale-02": WabiSabiPage,
  "filiale-03": KLoungePage,
  "filiale-04": MillionaireClubPage,
  "filiale-05": MuzikCafePage,
  "filiale-06": MokaMorePage,
  "filiale-07": GourmetMexicanaPage,
};

/** La maison a-t-elle une fiche sur le site ? (sinon : 404) */
export function hasFilialePage(slug: string): boolean {
  return slug in COMPOSITIONS;
}

export function renderFilialePage(ctx: FilialeContext): ReactNode | Promise<ReactNode> {
  const compose = COMPOSITIONS[ctx.slug];
  return compose ? compose(ctx) : null;
}
