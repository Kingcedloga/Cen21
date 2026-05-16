"use client";

import { Check, Copy, Share2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";

type ShareData = {
  title: string;
  text?: string;
  url?: string;
};

export function ShareButton({
  data,
  className = "",
  variant = "outline",
}: {
  data: ShareData;
  className?: string;
  variant?: "outline" | "ghost";
}) {
  const [copied, setCopied] = useState(false);
  const [supportsShare, setSupportsShare] = useState(false);
  const timer = useRef<number | null>(null);

  useEffect(() => {
    setSupportsShare(
      typeof navigator !== "undefined" && typeof navigator.share === "function",
    );
    return () => {
      if (timer.current) window.clearTimeout(timer.current);
    };
  }, []);

  const handleClick = async () => {
    const url = data.url ?? (typeof window !== "undefined" ? window.location.href : "");
    const payload = { title: data.title, text: data.text, url };

    if (supportsShare) {
      try {
        await navigator.share(payload);
        return;
      } catch (err) {
        if (err instanceof Error && err.name === "AbortError") return;
      }
    }

    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      if (timer.current) window.clearTimeout(timer.current);
      timer.current = window.setTimeout(() => setCopied(false), 2200);
    } catch {
      // pas de feedback supplémentaire si le presse-papiers est indisponible
    }
  };

  const baseClass =
    variant === "ghost"
      ? "text-ivory/85 hover:text-gold"
      : "border border-white/15 bg-petrol/40 text-ivory/85 hover:border-gold/50 hover:text-gold";

  const Icon = copied ? Check : supportsShare ? Share2 : Copy;
  const label = copied
    ? "Lien copié"
    : supportsShare
      ? "Partager"
      : "Copier le lien";

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label={label}
      title={label}
      className={`inline-flex min-h-[44px] items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-all duration-200 cursor-pointer focus-visible:outline-2 focus-visible:outline-gold focus-visible:outline-offset-2 ${baseClass} ${className}`}
    >
      <Icon className="h-4 w-4" strokeWidth={1.85} aria-hidden />
      <span className="hidden sm:inline">{label}</span>
    </button>
  );
}
