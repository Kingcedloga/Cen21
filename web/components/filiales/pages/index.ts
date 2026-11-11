import type { ReactNode } from "react";

import type { FilialeContext } from "./context";
import { DefaultFilialePage } from "./default";
import { GourmetMexicanaPage } from "./gourmet-mexicana";
import { KLoungePage } from "./k-lounge";
import { MillionaireClubPage } from "./millionaire-club";
import { MokaMorePage } from "./moka-more";
import { MuzikCafePage } from "./muzik-cafe";
import { OliveVertePage } from "./olive-verte";
import { WabiSabiPage } from "./wabi-sabi";

export { buildFilialeContext, type FilialeContext } from "./context";

/**
 * Une composition par maison (refonte R5) : chaque fiche liste ses sections
 * dans l'ordre. Migrer une maison vers les blocs du socle
 * (components/filiales/blocks) ne touche que son fichier.
 */
const COMPOSITIONS: Record<string, (ctx: FilialeContext) => ReactNode> = {
  "filiale-01": OliveVertePage,
  "filiale-02": WabiSabiPage,
  "filiale-03": KLoungePage,
  "filiale-04": MillionaireClubPage,
  "filiale-05": MuzikCafePage,
  "filiale-06": MokaMorePage,
  "filiale-07": GourmetMexicanaPage,
};

export function renderFilialePage(ctx: FilialeContext): ReactNode {
  return (COMPOSITIONS[ctx.slug] ?? DefaultFilialePage)(ctx);
}
