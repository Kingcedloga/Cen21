import type { ElementType, ReactNode } from "react";

export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  description,
  align = "center",
  titleAs: TitleTag = "h2",
  subtitleAs: SubtitleTag = "h3",
  titleId,
  className = "",
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  description?: string | ReactNode;
  align?: "left" | "center";
  titleAs?: "h1" | "h2" | "h3";
  subtitleAs?: "h2" | "h3" | "p";
  titleId?: string;
  className?: string;
}) {
  const alignClass = align === "center" ? "text-center mx-auto" : "text-left";
  const Title = TitleTag as ElementType;
  const Subtitle = SubtitleTag as ElementType;

  return (
    <header className={`max-w-3xl mb-10 md:mb-12 ${alignClass} ${className}`}>
      {eyebrow && (
        <div
          className={`mb-4 flex flex-col gap-3 ${align === "center" ? "items-center" : "items-start"}`}
        >
          <p className="text-gold text-[11px] font-semibold tracking-[0.28em] uppercase">
            {eyebrow}
          </p>
          <span
            className="h-px w-12 bg-gradient-to-r from-gold/90 to-gold/30"
            aria-hidden
          />
        </div>
      )}
      <Title
        id={titleId}
        className="font-[family-name:var(--font-cormorant)] text-4xl md:text-5xl lg:text-[3.35rem] font-light tracking-[-0.02em] text-ivory leading-[1.1] [text-shadow:0_2px_24px_rgba(0,0,0,0.45)]"
      >
        {title}
      </Title>
      {subtitle && (
        <Subtitle
          className={`mt-3 font-[family-name:var(--font-cormorant)] text-2xl md:text-3xl font-light tracking-[-0.01em] text-ivory/90 leading-snug [text-shadow:0_1px_16px_rgba(0,0,0,0.35)] ${
            align === "center" ? "mx-auto" : ""
          }`}
        >
          {subtitle}
        </Subtitle>
      )}
      {description && (
        <p
          className={`mt-4 text-ivory/75 text-base md:text-lg leading-[1.65] max-w-2xl ${
            align === "center" ? "mx-auto" : ""
          }`}
        >
          {description}
        </p>
      )}
    </header>
  );
}
