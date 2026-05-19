import { Link } from "@/i18n/navigation";
import type { ReactNode } from "react";

type Variant = "primary" | "secondary" | "ghost";
type Size = "sm" | "md" | "lg";

/**
 * Boutons ultra-premium — design system Cen21 Hospitality.
 *
 * Variants :
 *  - primary  : surface neutre #E7D1BF, texte pétrole #004258, relief
 *               intérieur + halo chaud diffus. Effet matière ivoire chaud.
 *  - secondary: hairline neutre + voile sombre + glassmorphism léger.
 *               Au survol : bord et lueur #E7D1BF.
 *  - ghost    : minimaliste, hover neutre clair uniquement.
 *
 * Sizes : sm (40px), md (44px — défaut, conforme tap-target Apple), lg (52px).
 */
const variants: Record<Variant, string> = {
  primary: "btn-primary",
  secondary: "btn-secondary",
  ghost:
    "border border-transparent bg-transparent text-ivory/90 hover:text-ivory transition-colors duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]",
};

const sizes: Record<Size, string> = {
  sm: "min-h-[40px] px-5 py-2.5 text-[13px]",
  md: "min-h-[44px] px-7 py-3.5 text-sm",
  lg: "min-h-[52px] px-9 py-4 text-[15px]",
};

export function Button({
  href,
  children,
  variant = "primary",
  size = "md",
  className = "",
  onClick,
  type = "button",
  disabled,
  external,
  ariaLabel,
}: {
  href?: string;
  children: ReactNode;
  variant?: Variant;
  size?: Size;
  className?: string;
  onClick?: () => void;
  type?: "button" | "submit";
  disabled?: boolean;
  external?: boolean;
  ariaLabel?: string;
}) {
  const base =
    "group/btn relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-xl font-medium tracking-[0.005em] transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] cursor-pointer focus-visible:outline-1 focus-visible:outline-ivory focus-visible:outline-offset-[3px] disabled:pointer-events-none disabled:opacity-45 disabled:cursor-not-allowed";

  const classes = `${base} ${sizes[size]} ${variants[variant]} ${className}`;

  const content = (
    <>
      {variant === "primary" && (
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/[0.22] to-transparent transition-transform duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover/btn:translate-x-full"
        />
      )}
      <span className="relative inline-flex items-center gap-2">{children}</span>
    </>
  );

  if (href) {
    if (external) {
      return (
        <a
          href={href}
          className={classes}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={ariaLabel}
        >
          {content}
        </a>
      );
    }
    return (
      <Link href={href} className={classes} aria-label={ariaLabel}>
        {content}
      </Link>
    );
  }

  return (
    <button
      type={type}
      className={classes}
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
    >
      {content}
    </button>
  );
}
