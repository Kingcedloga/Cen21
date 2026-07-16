"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { useTranslations } from "next-intl";
import { useCallback, type FormEvent } from "react";

import { useRouter } from "@/i18n/navigation";
import { IconFacebook, IconInstagram, IconLinkedin } from "@/components/ui/SocialLinks";
import { Calendar, Clock, Mail, User, Users } from "@/lib/icons";
import { DURATION_S, EASE, defaultScrollViewport } from "@/lib/motion";
import type { Subsidiary } from "@/lib/types";

import "@/styles/moka-more-reservation-section.css";

const MAIN_PHOTO = "/filiales/photos/filiale-06/reservation-main.png";
const SECONDARY_PHOTO = "/filiales/photos/filiale-06/reservation-secondary.png";

const FIELDS = [
  { key: "name", icon: User, type: "text" },
  { key: "email", icon: Mail, type: "email" },
  { key: "people", icon: Users, type: "text" },
  { key: "date", icon: Calendar, type: "text" },
  { key: "time", icon: Clock, type: "text" },
] as const;

export function MokaMoreReservationSection({ subsidiary }: { subsidiary: Subsidiary }) {
  const reduced = useReducedMotion();
  const t = useTranslations("subsidiaries");
  const router = useRouter();

  const handleSubmit = useCallback(
    (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      router.push("/contact");
    },
    [router],
  );

  const socialLinks = [
    { href: subsidiary.social.instagram, Icon: IconInstagram, name: "Instagram" },
    { href: subsidiary.social.facebook, Icon: IconFacebook, name: "Facebook" },
    { href: subsidiary.social.linkedin, Icon: IconLinkedin, name: "LinkedIn" },
  ].filter(
    (l): l is { href: string; Icon: typeof IconInstagram; name: string } => Boolean(l.href),
  );

  return (
    <section className="moka-reservation">
      <motion.span
        className="moka-reservation__watermark"
        aria-hidden="true"
        initial={reduced ? false : { opacity: 0 }}
        whileInView={reduced ? undefined : { opacity: 0.08 }}
        viewport={defaultScrollViewport}
        transition={{ duration: DURATION_S.grand, ease: EASE.luxury, delay: 0.1 }}
      >
        {t("mokaMoreReservation.watermark")}
      </motion.span>

      <div className="moka-reservation__grid">
        <motion.div
          className="moka-reservation__form-col"
          initial={reduced ? false : { opacity: 0, x: -40 }}
          whileInView={reduced ? undefined : { opacity: 1, x: 0 }}
          viewport={defaultScrollViewport}
          transition={{ duration: 0.7, ease: EASE.luxury }}
        >
          <p className="moka-reservation__eyebrow">{t("mokaMoreReservation.formEyebrow")}</p>
          <h2 className="moka-reservation__title">{t("mokaMoreReservation.formTitle")}</h2>
          <p className="moka-reservation__note">{t("mokaMoreReservation.formNote")}</p>

          <form className="moka-reservation__form" onSubmit={handleSubmit}>
            {FIELDS.map((field, i) => {
              const Icon = field.icon;
              const label = t(`mokaMoreReservation.${field.key}Field`);
              return (
                <motion.div
                  key={field.key}
                  className="moka-reservation__field"
                  initial={reduced ? false : { opacity: 0, y: 16 }}
                  whileInView={reduced ? undefined : { opacity: 1, y: 0 }}
                  viewport={defaultScrollViewport}
                  transition={{ duration: DURATION_S.base, ease: EASE.luxury, delay: i * 0.06 }}
                >
                  <Icon size={16} className="moka-reservation__field-icon" aria-hidden="true" />
                  <input
                    type={field.type}
                    placeholder={label}
                    aria-label={label}
                    className="moka-reservation__input"
                  />
                </motion.div>
              );
            })}
            <button type="submit" className="moka-reservation__submit">
              {t("mokaMoreReservation.submitLabel")}
            </button>
          </form>
        </motion.div>

        <motion.div
          className="moka-reservation__photo-col"
          initial={reduced ? false : { opacity: 0, scale: 0.95 }}
          whileInView={reduced ? undefined : { opacity: 1, scale: 1 }}
          viewport={defaultScrollViewport}
          transition={{ duration: DURATION_S.grand, ease: EASE.luxury, delay: 0.15 }}
        >
          <Image
            src={MAIN_PHOTO}
            alt={subsidiary.name}
            fill
            className="moka-reservation__photo"
            sizes="(max-width: 899px) 90vw, 30vw"
          />
        </motion.div>

        <motion.div
          className="moka-reservation__location-col"
          initial={reduced ? false : { opacity: 0, x: 40 }}
          whileInView={reduced ? undefined : { opacity: 1, x: 0 }}
          viewport={defaultScrollViewport}
          transition={{ duration: 0.7, ease: EASE.luxury, delay: 0.2 }}
        >
          <p className="moka-reservation__eyebrow">{t("mokaMoreReservation.locationEyebrow")}</p>
          <h2 className="moka-reservation__title">{t("mokaMoreReservation.locationTitle")}</h2>

          {subsidiary.practicalInfo.address && (
            <p className="moka-reservation__address">{subsidiary.practicalInfo.address}</p>
          )}

          <span className="moka-reservation__divider" aria-hidden="true" />

          {subsidiary.practicalInfo.hours && (
            <p className="moka-reservation__hours">{subsidiary.practicalInfo.hours}</p>
          )}

          {socialLinks.length > 0 && (
            <div className="moka-reservation__social">
              {socialLinks.map(({ href, Icon, name }) => (
                <a
                  key={name}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="moka-reservation__social-link"
                  aria-label={name}
                >
                  <Icon className="moka-reservation__social-icon" />
                </a>
              ))}
            </div>
          )}

          <div className="moka-reservation__secondary-photo-wrap">
            <Image
              src={SECONDARY_PHOTO}
              alt=""
              fill
              className="moka-reservation__secondary-photo"
              sizes="(max-width: 899px) 60vw, 16rem"
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
