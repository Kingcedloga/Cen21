import Link from "next/link";
import type { ReactNode } from "react";

type Variant = "primary" | "secondary" | "ghost";

const variants: Record<Variant, string> = {
  primary:
    "bg-gold text-petrol hover:bg-gold/92 border border-gold/95 shadow-sm shadow-black/25 hover:shadow-md hover:shadow-black/30 active:scale-[0.99]",
  secondary:
    "bg-transparent text-ivory border border-white/25 hover:border-gold/55 hover:bg-white/[0.03] hover:text-gold",
  ghost:
    "bg-transparent text-ivory/90 hover:text-gold border border-transparent",
};

export function Button({
  href,
  children,
  variant = "primary",
  className = "",
  onClick,
  type = "button",
  disabled,
}: {
  href?: string;
  children: ReactNode;
  variant?: Variant;
  className?: string;
  onClick?: () => void;
  type?: "button" | "submit";
  disabled?: boolean;
}) {
  const base =
    "inline-flex items-center justify-center gap-2 rounded-xl px-7 py-3.5 text-sm font-medium tracking-wide transition-all duration-300 ease-out cursor-pointer disabled:pointer-events-none disabled:opacity-45 disabled:cursor-not-allowed";

  const classes = `${base} ${variants[variant]} ${className}`;

  if (href) {
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    );
  }

  return (
    <button type={type} className={classes} onClick={onClick} disabled={disabled}>
      {children}
    </button>
  );
}
