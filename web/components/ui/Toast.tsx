"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { toastIcons, X } from "@/lib/icons";
import { useEffect } from "react";

import {
  toastEnterTransition,
  toastVariants,
} from "@/lib/motion";

export type ToastVariant = "success" | "error";

const VARIANT_STYLES: Record<
  ToastVariant,
  { ring: string; icon: (typeof toastIcons)["success"]; iconClass: string }
> = {
  success: {
    ring: "ring-gold/40",
    icon: toastIcons.success,
    iconClass: "text-gold",
  },
  error: {
    ring: "ring-red-400/45",
    icon: toastIcons.error,
    iconClass: "text-red-400",
  },
};

export function Toast({
  variant,
  title,
  message,
  onClose,
  duration = 5000,
}: {
  variant: ToastVariant;
  title: string;
  message?: string;
  onClose: () => void;
  duration?: number;
}) {
  const reduced = useReducedMotion();
  const { ring, icon: Icon, iconClass } = VARIANT_STYLES[variant];

  useEffect(() => {
    if (duration <= 0) return;
    const t = window.setTimeout(onClose, duration);
    return () => window.clearTimeout(t);
  }, [duration, onClose]);

  return (
    <motion.div
      role={variant === "error" ? "alert" : "status"}
      aria-live={variant === "error" ? "assertive" : "polite"}
      initial={reduced ? false : "hidden"}
      animate={reduced ? undefined : "visible"}
      exit={reduced ? undefined : "exit"}
      variants={reduced ? undefined : toastVariants}
      transition={toastEnterTransition}
      className={`pointer-events-auto flex w-full max-w-sm items-start gap-3 rounded-xl border border-white/10 bg-anthracite/95 p-4 shadow-2xl shadow-black/55 ring-1 ring-inset ${ring} backdrop-blur-md`}
    >
      <Icon className={`mt-0.5 h-5 w-5 shrink-0 ${iconClass}`} aria-hidden />
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold text-ivory">{title}</p>
        {message && (
          <p className="mt-1 text-xs leading-relaxed text-ivory/75">{message}</p>
        )}
      </div>
      <button
        type="button"
        onClick={onClose}
        aria-label="Fermer la notification"
        className="rounded-md p-1 text-ivory/55 transition-colors hover:bg-white/5 hover:text-ivory cursor-pointer"
      >
        <X className="h-4 w-4" aria-hidden />
      </button>
    </motion.div>
  );
}

export function ToastViewport({ children }: { children: React.ReactNode }) {
  return (
    <div
      aria-live="polite"
      className="pointer-events-none fixed bottom-4 right-4 z-[60] flex flex-col items-end gap-2 md:bottom-6 md:right-6"
    >
      <AnimatePresence>{children}</AnimatePresence>
    </div>
  );
}
