"use client";

import { useLocale, useTranslations } from "next-intl";
import { useState } from "react";

import { usePathname, getPathname } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";

const LOCALE_ORDER: Locale[] = ["en", "fr"];

const BTN_BASE =
  "min-h-[36px] min-w-[40px] rounded-full px-3 text-xs font-semibold uppercase tracking-wider transition-all duration-fine cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 disabled:opacity-60";

export function LanguageSwitcher({ className = "" }: { className?: string }) {
  const locale = useLocale() as Locale;
  const pathname = usePathname();
  const t = useTranslations("language");
  const [pending, setPending] = useState(false);

  const switchLocale = (next: Locale) => {
    if (next === locale || pending) return;
    setPending(true);
    const target = getPathname({ href: pathname, locale: next });
    window.location.assign(target);
  };

  return (
    <div
      className={`inline-flex items-center rounded-full border border-white/15 bg-petrol/50 p-0.5 backdrop-blur-sm ${className}`}
      role="group"
      aria-label={t("label")}
    >
      {LOCALE_ORDER.map((code) => {
        const active = code === locale;
        const label = code === "en" ? t("en") : t("fr");


        return (
          <button
            key={code}
            type="button"
            onClick={() => switchLocale(code)}
            disabled={pending}
            aria-pressed={active}
            aria-label={t("switchTo", { language: label })}
            className={`${BTN_BASE} focus-visible:outline-rose ${
              active
                ? "bg-rose text-petrol shadow-sm"
                : "text-ivory/75 hover:text-rose"
            }`}
          >
            {code}
          </button>
        );
      })}
    </div>
  );
}
