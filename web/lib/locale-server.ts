import { getLocale } from "next-intl/server";

import type { Locale } from "@/i18n/routing";

export async function getContentLocale(): Promise<Locale> {
  return (await getLocale()) as Locale;
}
