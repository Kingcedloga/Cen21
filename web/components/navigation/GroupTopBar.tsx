"use client";

import { useTranslations } from "next-intl";

import { Logo } from "@/components/brand/Logo";
import { LanguageSwitcher } from "@/components/layout/LanguageSwitcher";
import { Button } from "@/components/ui/Button";

/**
 * Barre haute des pages groupe (Orbix) : logo, langue et contact. Elle n'est
 * pas fixe et défile avec la page ; la navigation passe par la capsule basse,
 * qui reprend aussi la langue et le contact.
 */
export function GroupTopBar() {
  const t = useTranslations("nav");

  return (
    // Safe areas iOS (viewport-fit=cover) : jamais sous la barre de statut ni
    // l'encoche ; sans encoche, env() vaut 0 et les marges restent celles d'avant.
    <header className="absolute inset-x-0 top-0 z-50 pt-[max(0.75rem,env(safe-area-inset-top))] pr-[max(1rem,env(safe-area-inset-right))] pl-[max(1rem,env(safe-area-inset-left))] md:pt-[max(1rem,env(safe-area-inset-top))] md:pr-[max(1.5rem,env(safe-area-inset-right))] md:pl-[max(1.5rem,env(safe-area-inset-left))]">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 md:px-4">
        <Logo size="xl" variant="header" />
        <div className="flex items-center gap-2 sm:gap-3">
          <LanguageSwitcher />
          <Button href="/contact" variant="secondary" size="sm" magnetic className="max-sm:hidden">
            {t("contact")}
          </Button>
        </div>
      </div>
    </header>
  );
}
