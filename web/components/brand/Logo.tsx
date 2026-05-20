"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";

import { Link } from "@/i18n/navigation";

type LogoProps = {
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
  /** Réduit la hauteur dans le header fixe pour garder une barre compacte tout en gardant un logo net. */
  variant?: "default" | "header";
};

const sizesPx = {
  sm: 90,
  md: 115,
  lg: 120,
  xl: 150,
};

export function Logo({ size = "md", className = "", variant = "default" }: LogoProps) {
  const t = useTranslations("nav");
  const mark = sizesPx[size];
  const isHeader = variant === "header";

  return (
    <Link
      href="/"
      className={`inline-flex shrink-0 group cursor-pointer ${className}`}
      aria-label={`Cen21 Hospitality — ${t("home")}`}
    >
      <Image
        src="/logo.png"
        alt=""
        width={mark}
        height={mark}
        className={`object-contain transition-opacity duration-200 group-hover:opacity-90 drop-shadow-[0_2px_8px_rgba(0,0,0,0.5)] ${
          isHeader ? "h-14 w-auto md:h-[4.25rem]" : ""
        }`}
        style={isHeader ? undefined : { width: mark, height: mark }}
        priority
      />
    </Link>
  );
}
