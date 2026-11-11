"use client";

import { Header } from "@/components/layout/Header";
import { BottomCapsuleNav } from "@/components/navigation/BottomCapsuleNav";
import type { CapsuleMenuProps } from "@/components/navigation/CapsuleMenu";
import { GroupTopBar } from "@/components/navigation/GroupTopBar";
import { usePathname } from "@/i18n/navigation";
import { isMigratedFiliale } from "@/lib/filiale-migration";

const SUBSIDIARY_PAGE = /^\/filiales\/([^/]+)/;

/**
 * Pages groupe et fiches migrées (lib/filiale-migration.ts) : barre haute non
 * fixe + capsule de navigation basse (aux couleurs de la maison sur une fiche).
 * Autres fiches : en-tête à charte inchangé, jusqu'à leur refonte.
 */
export function SiteNavigation(props: CapsuleMenuProps) {
  const pathname = usePathname();

  const filiale = SUBSIDIARY_PAGE.exec(pathname)?.[1];
  if (filiale && !isMigratedFiliale(filiale)) return <Header />;

  return (
    <>
      <GroupTopBar />
      <BottomCapsuleNav {...props} />
    </>
  );
}
