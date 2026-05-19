import { Link } from "@/i18n/navigation";
import type { ReactNode } from "react";

type Variant = "primary" | "secondary" | "ghost";
type Size = "sm" | "md" | "lg";

/**
 * Boutons ultra-premium — design system Cen21 Hospitality.
 *
 * Variants :
 *  - primary  : gradient métallique 4-stops (or chaud → or profond) avec
 *               highlight intérieur haut + ombre intérieure basse + drop
 *               shadow + halo doré diffus. Effet "matière" tactile, pas un aplat.
 *  - secondary: hairline blanche très fine + voile sombre + glassmorphism léger.
 *               Au survol : bord doré + lueur dorée diffuse.
 *  - ghost    : minimaliste, hover gold uniquement.
 *
 * Sizes : sm (40px), md (44px — défaut, conforme tap-target Apple), lg (52px).
 *
 * Easing signature : cubic-bezier(0.16, 1, 0.3, 1) — décélération naturelle
 * "luxe" inspirée Apple HIG. Durée 480ms : ni nerveuse, ni paresseuse.
 */
const variants: Record<Variant, string> = {
  primary: [
    // Gradient métallique 4-stops — clair → ambré → profond → bronze chaud.
    // Chaque stop est une teinte chaude réelle, pas une opacité, pour un
    // rendu "matière dorée" perceptible à l'œil même en aplat.
    "bg-[linear-gradient(180deg,#d4ad65_0%,#c5a059_45%,#b58e48_85%,#a17b35_100%)]",
    "border border-[#9d7c39]",
    "text-petrol",
    // Triple ombre signature :
    //  1. Top inner highlight  → simule reflet lumineux haut
    //  2. Bottom inner shade   → ancre la matière (ombre interne basse)
    //  3. Drop sub-pixel       → crédibilité physique
    //  4. Halo doré diffus     → présence sans agressivité
    "shadow-[inset_0_1px_0_rgba(255,255,255,0.35),inset_0_-1px_0_rgba(0,0,0,0.22),0_1px_2px_rgba(0,0,0,0.28),0_12px_28px_-10px_rgba(197,160,89,0.45)]",
    // Hover : amplifie le halo + brightness subtil (4%, imperceptible mais
    // perçu par le système visuel comme "vivant").
    "hover:brightness-[1.04]",
    "hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.42),inset_0_-1px_0_rgba(0,0,0,0.22),0_2px_4px_rgba(0,0,0,0.3),0_18px_40px_-12px_rgba(197,160,89,0.65)]",
    // Active : enfoncement physique (translate-y + ombre intérieure profonde).
    "active:translate-y-[0.5px]",
    "active:shadow-[inset_0_1px_3px_rgba(0,0,0,0.18),0_4px_10px_-4px_rgba(197,160,89,0.4)]",
  ].join(" "),
  secondary: [
    // Hairline blanche à 15% — bord ultra-fin (signature ultra-premium).
    "border border-white/15",
    "bg-white/[0.03]",
    "text-ivory",
    "backdrop-blur-sm",
    "shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]",
    // Hover : bord doré + ombre dorée diffuse (sans brillance, juste matière).
    "hover:border-gold/55",
    "hover:bg-white/[0.06]",
    "hover:text-gold",
    "hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.06),0_8px_22px_-12px_rgba(197,160,89,0.32)]",
    "active:bg-white/[0.04]",
  ].join(" "),
  ghost: "border border-transparent bg-transparent text-ivory/90 hover:text-gold",
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
  // Base — typo affinée :
  //  - tracking-[0.005em] : très léger desserrement pour les tailles UI ≤14px
  //                        (compense l'effet d'optique de fonts géométriques sur petits corps)
  //  - font-medium (500)  : poids signature luxe (ni light, ni semibold)
  //  - duration-500 + ease luxury : timing "haute couture"
  const base =
    "group/btn relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-xl font-medium tracking-[0.005em] transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] cursor-pointer focus-visible:outline-1 focus-visible:outline-gold focus-visible:outline-offset-[3px] disabled:pointer-events-none disabled:opacity-45 disabled:cursor-not-allowed";

  const classes = `${base} ${sizes[size]} ${variants[variant]} ${className}`;

  const content = (
    <>
      {variant === "primary" && (
        // Shimmer signature — voile blanc qui balaye le bouton au survol.
        // Plus subtil qu'avant (25% → 18%) pour rester premium et non clinquant.
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/[0.18] to-transparent transition-transform duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover/btn:translate-x-full"
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
