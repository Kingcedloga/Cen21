import Image from "next/image";

import { RollingText } from "@/components/motion/RollingText";
import { IconFacebook, IconInstagram } from "@/components/ui/SocialLinks";
import { ArrowUpRight } from "@/lib/icons";

import "@/styles/contact-extras.css";

export type SocialTile = {
  slug: string;
  name: string;
  network: "Instagram" | "Facebook";
  href: string;
  /** « @compte », tiré de l'adresse du profil. */
  handle: string;
  logo?: string;
  logoSurface: string;
};

/**
 * Tuiles des réseaux des filiales (Orbix : tuiles « plateformes », texte qui
 * roule au survol). Une tuile par maison, vers son Instagram (Facebook à défaut).
 */
export function SocialTiles({ tiles, label, newTab }: { tiles: SocialTile[]; label: string; newTab: string }) {
  return (
    <ul aria-label={label} className="social-tiles">
      {tiles.map((tile) => {
        const NetworkIcon = tile.network === "Instagram" ? IconInstagram : IconFacebook;
        return (
          <li key={tile.slug}>
            <a href={tile.href} target="_blank" rel="noopener noreferrer" className="social-tile tap-press">
              <span className="social-tile__logo" style={{ backgroundColor: tile.logoSurface }}>
                {tile.logo && <Image src={tile.logo} alt="" fill sizes="48px" className="object-contain p-1.5" />}
              </span>
              <span className="social-tile__text">
                <span className="social-tile__name">
                  <RollingText text={tile.name} />
                </span>
                <span className="social-tile__handle">
                  <NetworkIcon className="h-3.5 w-3.5 shrink-0" />
                  {tile.handle}
                </span>
              </span>
              <ArrowUpRight size={16} aria-hidden="true" className="social-tile__arrow" />
              <span className="sr-only">
                {" "}
                ({tile.network}, {newTab})
              </span>
            </a>
          </li>
        );
      })}
    </ul>
  );
}
