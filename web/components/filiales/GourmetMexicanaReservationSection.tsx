"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { useTranslations } from "next-intl";
import { useCallback } from "react";

import { useRouter } from "@/i18n/navigation";
import { MexicanMotifs } from "@/components/filiales/MexicanMotifs";
import { ArrowUpRight, Mail, Phone, User, Users } from "@/lib/icons";
import { EASE, defaultScrollViewport } from "@/lib/motion";

import "@/styles/gourmet-mexicana-reservation.css";

const DISH_PHOTO =
  "https://images.unsplash.com/photo-1615870216519-2f9fa575fa5c?w=700&q=80";
const CHEF_PHOTO = "/filiales/photos/filiale-07/mascottemexiacain.png";

const FIELDS = [
  { key: "name", icon: User, type: "text" },
  { key: "phone", icon: Phone, type: "tel" },
  { key: "email", icon: Mail, type: "email" },
  { key: "guests", icon: Users, type: "text" },
] as const;

export function GourmetMexicanaReservationSection() {
  const reduced = useReducedMotion();
  const t = useTranslations("subsidiaries");
  const router = useRouter();

  const handleSubmit = useCallback(
    (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      router.push("/contact");
    },
    [router],
  );

  const staggerMotion = (i: number) =>
    reduced
      ? {}
      : {
          initial: { opacity: 0, y: 24 },
          whileInView: { opacity: 1, y: 0 },
          viewport: defaultScrollViewport,
          transition: { duration: 0.9, ease: EASE.luxury, delay: i * 0.08 },
        };

  return (
    <section className="mex-reservation">
      <MexicanMotifs variant="reservation" />

      <div className="mex-reservation__inner">
        <div className="mex-reservation__form-col">
          <motion.p className="mex-reservation__eyebrow" {...staggerMotion(0)}>
            {t("gourmetMexicanaReservation.eyebrow")}
          </motion.p>
          <motion.h2 className="mex-reservation__title" {...staggerMotion(1)}>
            <span>{t("gourmetMexicanaReservation.titleLine1")}</span>
            <span>{t("gourmetMexicanaReservation.titleLine2")}</span>
          </motion.h2>
          <motion.p className="mex-reservation__note" {...staggerMotion(2)}>
            {t("gourmetMexicanaReservation.note")}
          </motion.p>

          <motion.form className="mex-reservation__form" onSubmit={handleSubmit} {...staggerMotion(3)}>
            <div className="mex-reservation__grid">
              {FIELDS.map((field) => {
                const Icon = field.icon;
                const label = t(`gourmetMexicanaReservation.${field.key}Field`);
                return (
                  <div key={field.key} className="mex-reservation__field">
                    <Icon size={16} className="mex-reservation__field-icon" aria-hidden="true" />
                    <input
                      type={field.type}
                      placeholder={label}
                      aria-label={label}
                      className="mex-reservation__input"
                    />
                  </div>
                );
              })}
            </div>

            <motion.button type="submit" className="mex-reservation__submit" {...staggerMotion(4)}>
              {t("gourmetMexicanaReservation.submitLabel")}
              <ArrowUpRight size={16} aria-hidden="true" />
            </motion.button>
          </motion.form>

          <p className="mex-reservation__footnote">{t("gourmetMexicanaReservation.footnote")}</p>
        </div>

        <div className="mex-reservation__visual">
          <motion.div
            className="mex-reservation__chef-wrap"
            initial={reduced ? false : { opacity: 0, x: 40 }}
            whileInView={reduced ? undefined : { opacity: 1, x: 0 }}
            viewport={defaultScrollViewport}
            transition={{ duration: 0.9, ease: EASE.luxury, delay: 0.15 }}
          >
            <Image
              src={CHEF_PHOTO}
              alt=""
              fill
              className="mex-reservation__chef-photo"
              sizes="(max-width: 1023px) 80vw, 26rem"
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
