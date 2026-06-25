"use client";

import { AnimateIn } from "@/components/ui/AnimateIn";
import { SubsidiariesCoverFlow } from "@/components/filiales/SubsidiariesCoverFlow";
import type { Subsidiary } from "@/lib/types";

export function FeaturedSubsidiariesSlider({
  subsidiaries,
}: {
  subsidiaries: Subsidiary[];
}) {
  return (
    <AnimateIn className="w-full max-sm:overflow-x-clip px-1 sm:px-2">
      <SubsidiariesCoverFlow subsidiaries={subsidiaries} surface="light" compactLayout />
    </AnimateIn>
  );
}
