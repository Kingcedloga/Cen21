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
    <header className="absolute inset-x-0 top-0 z-50 px-4 pt-3 md:px-6 md:pt-4">
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
