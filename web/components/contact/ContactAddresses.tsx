"use client";

import { useInView } from "framer-motion";
import Image from "next/image";
import { useRef, useState } from "react";

import { RollingText } from "@/components/motion/RollingText";
import { Link } from "@/i18n/navigation";
import { ArrowUpRight, ExternalLink, MapPin, Phone } from "@/lib/icons";
import { googleMapsEmbedUrl, googleMapsExternalUrl } from "@/lib/map";

import "@/styles/contact-extras.css";

export type AddressEntry = {
  id: string;
  name: string;
  /** Ville affichée en étiquette quand ce n'est pas la ville principale. */
  city?: string;
  address: string;
  phone?: string;
  hours?: string;
  logo?: string;
  logoSurface: string;
  /** Fiche de la maison (absente pour le siège) et libellé « Découvrir … ». */
  page?: { href: string; external: boolean; label: string };
  /** Titre de la carte (« Carte — … »). */
  mapTitle: string;
};

type Labels = {
  list: string;
  directions: string;
  call: string;
  newTab: string;
  hours: string;
};

/**
 * « Nos adresses » (refonte R1) : le siège et les maisons, et une carte qui
 * se place sur l'adresse choisie. Desktop : liste à gauche, carte collante à
 * droite. Mobile : pastilles défilantes au-dessus de la carte.
 *
 * La carte Google (≈ 400 Ko de scripts) ne se charge qu'à l'approche de
 * l'écran. Choisir une adresse recharge la carte sur cette adresse.
 */
export function ContactAddresses({ entries, labels }: { entries: AddressEntry[]; labels: Labels }) {
  const [selectedId, setSelectedId] = useState(entries[0]?.id);
  const frameRef = useRef<HTMLDivElement>(null);
  const near = useInView(frameRef, { once: true, margin: "400px 0px" });
  const selected = entries.find((entry) => entry.id === selectedId) ?? entries[0];
  if (!selected) return null;

  return (
    <div className="contact-addresses">
      <ul aria-label={labels.list} className="contact-addresses__list">
        {entries.map((entry) => (
          <li key={entry.id}>
            <button
              type="button"
              aria-pressed={entry.id === selected.id}
              onClick={() => setSelectedId(entry.id)}
              className="address-choice tap-press"
            >
              <span className="address-choice__logo" style={{ backgroundColor: entry.logoSurface }}>
                {entry.logo && <Image src={entry.logo} alt="" fill sizes="40px" className="object-contain p-1.5" />}
              </span>
              <span className="address-choice__text">
                <span className="address-choice__name">
                  {entry.name}
                  {entry.city && <span className="address-choice__city">{entry.city}</span>}
                </span>
                <span className="address-choice__address">{entry.address}</span>
              </span>
            </button>
          </li>
        ))}
      </ul>

      <div className="contact-addresses__stage">
        <div ref={frameRef} className="contact-addresses__map">
          {/* Repère visible tant que la carte se charge (elle le recouvre ensuite). */}
          <MapPin size={36} aria-hidden="true" className="contact-addresses__map-pin" />
          {near && (
            <iframe
              key={selected.id}
              title={selected.mapTitle}
              src={googleMapsEmbedUrl(selected.address)}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
            />
          )}
        </div>

        {/* Fiche de l'adresse choisie, annoncée au changement. */}
        <div className="contact-addresses__card" aria-live="polite">
          <p className="contact-addresses__card-name">
            {selected.name}
            {selected.city && <span className="address-choice__city">{selected.city}</span>}
          </p>
          <p className="contact-addresses__card-line">
            <MapPin size={16} aria-hidden="true" />
            {selected.address}
          </p>
          {selected.hours && (
            <p className="contact-addresses__card-line">
              <span className="sr-only">{labels.hours} : </span>
              <span aria-hidden="true" className="contact-addresses__dot" />
              {selected.hours}
            </p>
          )}
          <div className="contact-addresses__actions">
            <a
              href={googleMapsExternalUrl(selected.address)}
              target="_blank"
              rel="noopener noreferrer"
              className="address-action tap-press"
            >
              <RollingText text={labels.directions} />
              <ExternalLink size={14} aria-hidden="true" />
              <span className="sr-only"> ({labels.newTab})</span>
            </a>
            {selected.phone && (
              <a href={`tel:${selected.phone.replace(/\s/g, "")}`} className="address-action tap-press">
                <Phone size={14} aria-hidden="true" />
                <RollingText text={`${labels.call} · ${selected.phone}`} />
              </a>
            )}
            {selected.page &&
              (selected.page.external ? (
                <a href={selected.page.href} target="_blank" rel="noopener noreferrer" className="address-action tap-press">
                  <RollingText text={selected.page.label} />
                  <ArrowUpRight size={14} aria-hidden="true" />
                  <span className="sr-only"> ({labels.newTab})</span>
                </a>
              ) : (
                <Link href={selected.page.href} className="address-action tap-press">
                  <RollingText text={selected.page.label} />
                  <ArrowUpRight size={14} aria-hidden="true" />
                </Link>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}
