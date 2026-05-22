import type { ReactNode } from "react";

import type { SubsidiaryPageTheme } from "@/lib/subsidiary-themes";

import "@/styles/subsidiary-themes/millionaire-club.css";
import "@/styles/subsidiary-themes/k-lounge.css";
import "@/styles/subsidiary-themes/moka-more.css";
import "@/styles/subsidiary-themes/pain-quotidien.css";
import "@/styles/subsidiary-themes/papa-johns.css";

type Props = {
  theme: SubsidiaryPageTheme;
  children: ReactNode;
};

export function SubsidiaryThemeShell({ theme, children }: Props) {
  const { colors } = theme;

  return (
    <div
      data-subsidiary-theme={theme.id}
      className="subsidiary-themed-page min-h-full text-white"
      style={
        {
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
        } as React.CSSProperties
      }
    >
      {children}
    </div>
  );
}
