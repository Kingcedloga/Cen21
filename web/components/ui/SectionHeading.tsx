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
    <div className={`max-w-3xl mb-12 ${alignClass}`}>
      {eyebrow && (
        <p className="text-gold text-sm tracking-[0.2em] uppercase mb-3">
          {eyebrow}
        </p>
      )}
      <h2 className="font-[family-name:var(--font-cormorant)] text-4xl md:text-5xl lg:text-6xl font-light text-ivory mb-4">
        {title}
      </h2>
      {description && (
        <p className="text-taupe text-lg leading-relaxed">{description}</p>
      )}
    </div>
  );
}
