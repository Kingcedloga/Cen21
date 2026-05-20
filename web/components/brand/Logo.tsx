"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";

import { Link } from "@/i18n/navigation";

type LogoProps = {
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
  /** Réduit la hauteur dans le header fixe pour garder une barre compacte tout en gardant un logo net. */
  variant?: "default" | "header" | "footer";
};

const sizesPx = {
  sm: 90,
  md: 115,
  lg: 120,
  xl: 150,
};

/** Dimensions source du fichier `/public/logo.png` (Cen21_Logo-Final). */
const LOGO_ASPECT = 1024 / 984;

export function Logo({ size = "md", className = "", variant = "default" }: LogoProps) {
  const t = useTranslations("nav");
  const isHeader = variant === "header";
  const isFooter = variant === "footer";
  const height = isFooter ? 56 : sizesPx[size];
  const width = Math.round(height * LOGO_ASPECT);

  return (
    <Link
      href="/"
      className={`group cursor-pointer ${
        isFooter
          ? "flex h-full w-full items-center justify-center"
          : "inline-flex shrink-0"
      } ${className}`}
      aria-label={`Cen21 Hospitality — ${t("home")}`}
    >
      <Image
        src="/logo.png"
        alt=""
        width={width}
        height={height}
        className={`object-contain transition-opacity duration-200 group-hover:opacity-90 ${
          isHeader
            ? "h-14 w-auto md:h-[4.25rem]"
            : isFooter
              ? "h-11 w-auto md:h-[3.25rem]"
              : ""
        }`}
        style={isHeader || isFooter ? undefined : { width, height }}
        priority
      />
    </Link>
  );
}
