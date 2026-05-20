"use client";

import { useInView, useReducedMotion } from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";

function parseStatValue(value: string) {
  const match = value.match(/^([^\d]*?)([\d,.]+)([^\d]*)$/);
  if (!match) {
    return { prefix: "", number: 0, suffix: value, decimals: 0 };
  }

  const raw = match[2].replace(",", ".");
  const decimals = raw.includes(".") ? raw.split(".")[1]?.length ?? 0 : 0;

  return {
    prefix: match[1],
    number: parseFloat(raw),
    suffix: match[3],
    decimals,
  };
}

function easeOutCubic(t: number) {
  return 1 - (1 - t) ** 3;
}

function formatCount(value: number, decimals: number) {
  return decimals > 0 ? value.toFixed(decimals) : String(Math.round(value));
}

export function StatCountUp({
  value,
  className = "",
}: {
  value: string;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const reduced = useReducedMotion();
  const parsed = useMemo(() => parseStatValue(value), [value]);
  const [display, setDisplay] = useState(() =>
    reduced ? value : `${parsed.prefix}0${parsed.suffix}`,
  );

  useEffect(() => {
    if (reduced) {
      setDisplay(value);
      return;
    }

    if (!inView) return;

    const duration = 1400;
    const start = performance.now();
    let frame = 0;

    const tick = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      const current = parsed.number * easeOutCubic(progress);
      setDisplay(`${parsed.prefix}${formatCount(current, parsed.decimals)}${parsed.suffix}`);

      if (progress < 1) {
        frame = requestAnimationFrame(tick);
      }
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [inView, parsed, reduced, value]);

  return (
    <span ref={ref} className={className} aria-label={value}>
      {display}
    </span>
  );
}
