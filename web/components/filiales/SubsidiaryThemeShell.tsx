import type { ReactNode } from "react";

import type { SubsidiaryPageTheme } from "@/lib/subsidiary-themes";

import { MexicanaMotifLayer } from "@/components/filiales/MexicanaMotifLayer";

import "@/styles/subsidiary-themes/pinkberry.css";
import "@/styles/pinkberry-hero.css";
import "@/styles/pinkberry-story-section.css";
import "@/styles/pinkberry-gallery-section.css";
import "@/styles/subsidiary-themes/wabi-sabi.css";
import "@/styles/subsidiary-themes/millionaire-club.css";
import "@/styles/subsidiary-themes/olive-verte.css";
import "@/styles/subsidiary-themes/k-lounge.css";
import "@/styles/subsidiary-themes/moka-more.css";
import "@/styles/subsidiary-themes/pain-quotidien.css";
import "@/styles/subsidiary-themes/papa-johns.css";
import "@/styles/subsidiary-themes/gourmet-mexicana.css";
import "@/styles/subsidiary-themes/muzik-cafe.css";
import "@/styles/subsidiary-contact-band.css";

type Props = {
  theme: SubsidiaryPageTheme;
  children: ReactNode;
};

export function SubsidiaryThemeShell({ theme, children }: Props) {
  const { colors } = theme;
  const hasMotifs = theme.id === "gourmet-mexicana";

  const style = {
    "--sub-bg": colors.bg,
    "--sub-gold": colors.gold,
    "--sub-gold-rgb": colors.goldRgb,
    "--sub-text": colors.text,
    "--sub-text-muted": colors.textMuted,
    "--sub-text-subtle": colors.textSubtle,
    "--sub-surface": colors.surface,
    "--sub-surface-elevated": colors.surfaceElevated,
    "--sub-border": colors.border,
    "--sub-btn": colors.btn ?? colors.gold,
    ...(colors.red && { "--sub-red": colors.red }),
    ...(colors.redRgb && { "--sub-red-rgb": colors.redRgb }),
    ...(colors.ochre && { "--sub-ochre": colors.ochre }),
    ...(colors.ochreRgb && { "--sub-ochre-rgb": colors.ochreRgb }),
    ...(colors.terracotta && { "--sub-terracotta": colors.terracotta }),
    ...(colors.terracottaRgb && {
      "--sub-terracotta-rgb": colors.terracottaRgb,
    }),
  } as React.CSSProperties;

  return (
    <div
      data-subsidiary-theme={theme.id}
      className={`subsidiary-themed-page min-h-full text-white${hasMotifs ? " subsidiary-themed-page--motifs" : ""}`}
      style={style}
    >
      {hasMotifs && <MexicanaMotifLayer />}
      <div className={hasMotifs ? "relative z-[1]" : undefined}>{children}</div>
    </div>
  );
}
