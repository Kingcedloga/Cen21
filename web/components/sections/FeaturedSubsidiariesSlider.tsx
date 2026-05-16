"use client";

import { SubsidiariesCoverFlow } from "@/components/filiales/SubsidiariesCoverFlow";
import type { Subsidiary } from "@/lib/types";

/** Slider cover-flow pour la section filiales de l’accueil. */
export function FeaturedSubsidiariesSlider({
  subsidiaries,
}: {
  subsidiaries: Subsidiary[];
}) {
  return <SubsidiariesCoverFlow subsidiaries={subsidiaries} />;
}
