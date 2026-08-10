"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

import { Phone } from "@/lib/icons";

import "@/styles/phone-location-picker.css";

export type PhoneLocation = { city: string; address: string; phone: string };

type Props = {
  locations: PhoneLocation[];
  /** Render prop — passe le onClick au bouton déclencheur */
  renderTrigger: (onClick: () => void) => ReactNode;
  popoverVariant?: "light" | "dark";
  align?: "left" | "center";
};

export function PhoneLocationPicker({
  locations,
  renderTrigger,
  popoverVariant = "light",
  align = "left",
}: Props) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onMouse = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    document.addEventListener("mousedown", onMouse);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onMouse);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div ref={ref} className={`plp${open ? " plp--open" : ""}`}>
      {renderTrigger(() => setOpen((v) => !v))}

      <div
        className={[
          "plp__popover",
          `plp__popover--${popoverVariant}`,
          align === "center" ? "plp__popover--center" : "",
        ]
          .filter(Boolean)
          .join(" ")}
        role="dialog"
        aria-modal="false"
        aria-label="Choisir un établissement"
      >
        {locations.map((loc) => (
          <a
            key={loc.city}
            href={`tel:${loc.phone.replace(/\s/g, "")}`}
            className="plp__option"
            onClick={() => setOpen(false)}
          >
            <span className="plp__city">{loc.city}</span>
            <span className="plp__address">{loc.address}</span>
            <span className="plp__phone">
              <Phone weight="regular" className="plp__phone-icon" aria-hidden />
              {loc.phone}
            </span>
          </a>
        ))}
      </div>
    </div>
  );
}
