"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";

import { LoaderGraphic } from "@/components/brand/LoaderGraphic";

const MIN_VISIBLE_MS = 700;
const FADE_MS = 480;

type Phase = "visible" | "fading" | "hidden";

export function SiteLoader() {
  const t = useTranslations("common");
  const reduced = useReducedMotion();
  const [phase, setPhase] = useState<Phase>("visible");

  useEffect(() => {
    let minTimer: ReturnType<typeof setTimeout> | undefined;
    let hideTimer: ReturnType<typeof setTimeout> | undefined;

    const dismiss = () => {
      const delay = reduced ? 0 : MIN_VISIBLE_MS;
      minTimer = setTimeout(() => {
        setPhase("fading");
        hideTimer = setTimeout(
          () => setPhase("hidden"),
          reduced ? 0 : FADE_MS,
        );
      }, delay);
    };

    if (document.readyState === "complete") {
      dismiss();
    } else {
      window.addEventListener("load", dismiss, { once: true });
    }

    return () => {
      clearTimeout(minTimer);
      clearTimeout(hideTimer);
      window.removeEventListener("load", dismiss);
    };
  }, [reduced]);

  if (phase === "hidden") return null;

  return (
    <motion.div
      initial={false}
      animate={{ opacity: phase === "fading" ? 0 : 1 }}
      transition={{
        duration: reduced ? 0 : FADE_MS / 1000,
        ease: [0.22, 1, 0.36, 1],
      }}
      className={`fixed inset-0 z-[300] flex items-center justify-center bg-petrol ${
        phase === "fading" ? "pointer-events-none" : ""
      }`}
      role="status"
      aria-live="polite"
      aria-busy={phase === "visible"}
      aria-label={t("loadingSite")}
    >
      <LoaderGraphic />
    </motion.div>
  );
}
