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
  const isCenter = align === "center";
  const Title = TitleTag as ElementType;
  const Subtitle = SubtitleTag as ElementType;

  return (
    <header
      className={`max-w-3xl mb-10 md:mb-12 ${
        isCenter ? "mx-auto text-center" : "text-left"
      } ${className}`}
    >
      {eyebrow && (
        <div
          className={`mb-5 flex max-w-full flex-wrap items-center gap-x-3 gap-y-2 ${
            isCenter ? "justify-center" : "justify-start"
          }`}
        >
          <span
            aria-hidden
            className="h-px w-7 shrink-0 bg-gradient-to-r from-transparent to-gold/85 sm:w-9"
          />
          <span
            aria-hidden
            className="inline-flex h-1.5 w-1.5 shrink-0 rotate-45 bg-gold/85 shadow-[0_0_10px_rgba(197,160,89,0.55)]"
          />
          <p className="eyebrow text-gold text-[10.5px] font-medium uppercase sm:text-[11px]">
            {eyebrow}
          </p>
          {isCenter && (
            <>
              <span
                aria-hidden
                className="inline-flex h-1.5 w-1.5 shrink-0 rotate-45 bg-gold/85 shadow-[0_0_10px_rgba(197,160,89,0.55)]"
              />
              <span
                aria-hidden
                className="h-px w-7 shrink-0 bg-gradient-to-l from-transparent to-gold/85 sm:w-9"
              />
            </>
          )}
        </div>
      )}
      <Title
        id={titleId}
        className="font-[family-name:var(--font-dm-sans)] text-4xl md:text-5xl lg:text-[3.4rem] font-light tracking-[-0.028em] text-ivory leading-[1.05] [text-shadow:0_2px_28px_rgba(0,0,0,0.5)]"
      >
        {title}
      </Title>
      {subtitle && (
        <Subtitle
          className={`mt-3 font-[family-name:var(--font-dm-sans)] text-2xl md:text-[1.85rem] italic font-light tracking-[-0.012em] leading-[1.15] text-gradient-gold opacity-95 [text-shadow:0_1px_18px_rgba(0,0,0,0.35)] ${
            isCenter ? "mx-auto" : ""
          }`}
        >
          {subtitle}
        </Subtitle>
      )}
      {description && (
        <p
          className={`mt-5 text-ivory/80 text-[15px] md:text-base lg:text-lg leading-[1.75] tracking-[-0.005em] max-w-2xl ${
            isCenter ? "mx-auto" : ""
          }`}
        >
          {description}
        </p>
      )}
    </header>
  );
}
