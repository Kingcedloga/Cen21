"use client";

import type { ReactNode } from "react";

import { AnimateIn } from "@/components/ui/AnimateIn";

export function LegalH2({ children }: { children: ReactNode }) {
  return (
    <AnimateIn>
      <h2 className="font-[family-name:var(--font-dm-sans)] text-xl font-bold text-ivory md:text-2xl">
        {children}
      </h2>
    </AnimateIn>
  );
}
