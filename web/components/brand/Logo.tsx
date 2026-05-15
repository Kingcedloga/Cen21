import Image from "next/image";
import Link from "next/link";

type LogoProps = {
  showWordmark?: boolean;
  size?: "sm" | "md" | "lg";
  className?: string;
};

const sizes = {
  sm: { mark: 36, text: "text-lg" },
  md: { mark: 44, text: "text-xl md:text-2xl" },
  lg: { mark: 56, text: "text-2xl md:text-3xl" },
};

export function Logo({
  showWordmark = true,
  size = "md",
  className = "",
}: LogoProps) {
  const { mark, text } = sizes[size];

  return (
    <Link
      href="/"
      className={`inline-flex items-center gap-3 group cursor-pointer ${className}`}
      aria-label="Cen21 Hospitality — accueil"
    >
      <Image
        src="/logo.png"
        alt=""
        width={mark}
        height={mark}
        className="h-auto w-auto object-contain transition-opacity duration-200 group-hover:opacity-90"
        priority={size !== "sm"}
      />
    </Link>
  );
}
