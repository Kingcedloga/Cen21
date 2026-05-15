import type { ReactNode } from "react";

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "center",
}: {
  eyebrow?: string;
  title: string;
  description?: string | ReactNode;
  align?: "left" | "center";
}) {
  const alignClass = align === "center" ? "text-center mx-auto" : "text-left";

  return (
    <div className={`max-w-3xl mb-14 md:mb-16 ${alignClass}`}>
      {eyebrow && (
        <div
          className={`mb-5 flex flex-col gap-3 ${align === "center" ? "items-center" : "items-start"}`}
        >
          <p className="text-gold text-[11px] font-medium tracking-[0.28em] uppercase">
            {eyebrow}
          </p>
          <span
            className="h-px w-12 bg-gradient-to-r from-gold/85 to-gold/25"
            aria-hidden
          />
        </div>
      )}
      <h2 className="font-[family-name:var(--font-cormorant)] text-4xl md:text-5xl lg:text-[3.25rem] font-light tracking-[-0.02em] text-ivory mb-5 leading-[1.12]">
        {title}
      </h2>
      {description && (
        <p
          className={`text-taupe text-base md:text-lg leading-[1.65] max-w-2xl ${
            align === "center" ? "mx-auto" : ""
          }`}
        >
          {description}
        </p>
      )}
    </div>
  );
}
