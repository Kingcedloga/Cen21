"use client";

import { BottomCapsuleNav } from "@/components/navigation/BottomCapsuleNav";
import type { CapsuleMenuProps } from "@/components/navigation/CapsuleMenu";
import { GroupTopBar } from "@/components/navigation/GroupTopBar";

/**
 * Navigation du site : barre haute non fixe + capsule de navigation basse,
 * sur toutes les pages (aux couleurs de la maison sur une fiche).
 */
export function SiteNavigation(props: CapsuleMenuProps) {
  return (
    <>
      <GroupTopBar />
      <BottomCapsuleNav {...props} />
    </>
  );
}
