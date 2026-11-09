"use client";

import { Header } from "@/components/layout/Header";
import { BottomCapsuleNav } from "@/components/navigation/BottomCapsuleNav";
import type { CapsuleMenuProps } from "@/components/navigation/CapsuleMenu";
import { GroupTopBar } from "@/components/navigation/GroupTopBar";
import { usePathname } from "@/i18n/navigation";

const SUBSIDIARY_PAGE = /^\/filiales\/[^/]+/;

/**
 * Pages filiales (/filiales/[slug]) : en-tête à charte inchangé.
 * Pages groupe : barre haute non fixe + capsule de navigation basse.
 */
export function SiteNavigation(props: CapsuleMenuProps) {
  const pathname = usePathname();

  if (SUBSIDIARY_PAGE.test(pathname)) return <Header />;

  return (
    <>
      <GroupTopBar />
      <BottomCapsuleNav {...props} />
    </>
  );
}
