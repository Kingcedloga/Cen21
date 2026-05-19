"use client";

import { useLocale } from "next-intl";

import type { Locale } from "@/i18n/routing";

import { getSectorLabel, type SectorKey } from "./content";

export function useSectorLabel(sector: SectorKey): string {
  const locale = useLocale() as Locale;
  return getSectorLabel(locale, sector);
}
