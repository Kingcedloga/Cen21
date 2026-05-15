"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { useState } from "react";

import { Logo } from "@/components/brand/Logo";

import { NAV_LINKS } from "./nav-links";

export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed top-4 left-4 right-4 z-50">
      <div className="mx-auto max-w-7xl glass-panel rounded-2xl px-5 md:px-8 shadow-lg shadow-black/30">
        <div className="flex h-[4.25rem] md:h-[4.75rem] items-center justify-between">
          <Logo size="xl" variant="header" />

          <nav
            className="hidden lg:flex items-center gap-9"
            aria-label="Navigation principale"
          >
            {NAV_LINKS.map(({ href, label }) => {
              const active = pathname === href;
              return (
                <Link
                  key={href}
                  href={href}
                  className={`text-[13px] font-medium tracking-wide transition-colors duration-300 ease-out cursor-pointer ${
                    active
                      ? "text-gold"
                      : "text-ivory/75 hover:text-ivory hover:text-gold/95"
                  }`}
                >
                  {label}
                </Link>
              );
            })}
          </nav>

          <button
            type="button"
            className="lg:hidden p-2.5 rounded-xl text-ivory hover:text-gold hover:bg-white/5 transition-colors cursor-pointer"
            aria-expanded={open}
            aria-label={open ? "Fermer le menu" : "Ouvrir le menu"}
            onClick={() => setOpen(!open)}
          >
            {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {open && (
          <nav
            className="lg:hidden border-t border-white/10 py-4 flex flex-col gap-3"
            aria-label="Navigation mobile"
          >
            {NAV_LINKS.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className="text-ivory/85 hover:text-gold py-2.5 px-2 rounded-lg text-sm font-medium transition-colors duration-200 cursor-pointer"
                onClick={() => setOpen(false)}
              >
                {label}
              </Link>
            ))}
          </nav>
        )}
      </div>
    </header>
  );
}
