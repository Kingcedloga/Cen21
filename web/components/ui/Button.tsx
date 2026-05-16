import Link from "next/link";
import type { ReactNode } from "react";

type Variant = "primary" | "secondary" | "ghost";
type Size = "sm" | "md" | "lg";

const variants: Record<Variant, string> = {
  primary:
    "border border-gold/95 bg-gradient-to-b from-gold to-[#b08c46] text-petrol shadow-[0_8px_22px_-10px_rgba(197,160,89,0.65)] hover:from-[#cfa867] hover:to-[#b58e48] hover:shadow-[0_14px_32px_-12px_rgba(197,160,89,0.85)] active:translate-y-[0.5px] active:shadow-[0_4px_12px_-6px_rgba(197,160,89,0.6)]",
  secondary:
    "border border-white/30 bg-white/[0.04] text-ivory backdrop-blur-sm hover:border-gold/60 hover:bg-white/[0.07] hover:text-gold active:bg-white/[0.05]",
  ghost:
    "border border-transparent bg-transparent text-ivory/90 hover:text-gold",
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
    "group/btn relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-xl font-medium tracking-wide transition-all duration-300 ease-out cursor-pointer focus-visible:outline-2 focus-visible:outline-gold focus-visible:outline-offset-2 disabled:pointer-events-none disabled:opacity-45 disabled:cursor-not-allowed";

  const classes = `${base} ${sizes[size]} ${variants[variant]} ${className}`;

  const content = (
    <>
      {variant === "primary" && (
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/25 to-transparent transition-transform duration-700 ease-out group-hover/btn:translate-x-full"
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
