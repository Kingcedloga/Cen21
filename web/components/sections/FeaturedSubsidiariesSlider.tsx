"use client";

import { SubsidiariesCoverFlow } from "@/components/filiales/SubsidiariesCoverFlow";
import type { Subsidiary } from "@/lib/types";

/**
 * Carrousel des filiales en vedette (home).
 *
 * Délibérément sans panneau « stage » ni bouton sous-jacent — le cover flow respire
 * seul sur le fond de section ; marges titre → bloc inchangées côté `page.tsx`.
 */
export function FeaturedSubsidiariesSlider({
  subsidiaries,
}: {
  subsidiaries: Subsidiary[];
}) {
  return (
    <div className="w-full max-sm:overflow-x-clip px-1 sm:px-2">
      <SubsidiariesCoverFlow subsidiaries={subsidiaries} />
    </div>
  );
}
