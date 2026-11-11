import { Magnetic } from "@/components/motion/Magnetic";
import { Link } from "@/i18n/navigation";
import type { ReactNode } from "react";

type Variant = "primary" | "secondary" | "ghost";
type Size = "sm" | "md" | "lg";

/**
 * Boutons — charte Cen21 (Cen21_Logo-Final) : pilules, styles dans
 * app/globals.css.
 *
 * Variants :
 *  - primary  : dégradé Refined Rosé (champagne ↔ rosé cuivré) qui glisse au
 *               survol, texte Dark Teal. Sur fond Quartz : Dark Teal, texte Quartz.
 *  - secondary: transparent, filet et texte Quartz ; au survol filet et voile
 *               rosés. Sur fond Quartz : filet et texte Dark Teal.
 *  - ghost    : minimaliste, hover ivoire clair uniquement.
 *
 * Sizes : sm (40px), md (44px — défaut, conforme tap-target Apple), lg (52px).
 *
 * `magnetic` : le bouton suit légèrement la souris au survol (effet aimant
 * d'Orbix, ±10 px). Réservé aux CTA en ligne, pas aux boutons pleine largeur.
 *
 * `native` : lien <a> simple, hors routeur (ancre `#…` défilée par Lenis,
 * `tel:`, `mailto:`), dans le même onglet.
 */
const variants: Record<Variant, string> = {
  primary: "btn-primary",
  secondary: "btn-secondary",
  ghost:
    "border border-transparent bg-transparent text-ivory/90 hover:text-ivory transition-colors duration-luxe ease-luxury",
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
  native = false,
  ariaLabel,
  magnetic = false,
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
  native?: boolean;
  ariaLabel?: string;
  magnetic?: boolean;
}) {
  const base =
    "group/btn relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-xl font-medium tracking-[0.005em] transition-all duration-luxe ease-luxury cursor-pointer focus-visible:outline-1 focus-visible:outline-ivory focus-visible:outline-offset-[3px] disabled:pointer-events-none disabled:opacity-45 disabled:cursor-not-allowed";

  const classes = `${base} ${sizes[size]} ${variants[variant]} ${className}`;

  const content = (
    <>
      <span className={`relative inline-flex items-center gap-2 ${magnetic ? "magnetic__content" : ""}`}>
        {children}
      </span>
    </>
  );

  let element: ReactNode;
  if (href && external) {
    element = (
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
  } else if (href && native) {
    element = (
      <a href={href} className={classes} aria-label={ariaLabel}>
        {content}
      </a>
    );
  } else if (href) {
    element = (
      <Link href={href} className={classes} aria-label={ariaLabel}>
        {content}
      </Link>
    );
  } else {
    element = (
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

  return magnetic ? <Magnetic>{element}</Magnetic> : element;
}
