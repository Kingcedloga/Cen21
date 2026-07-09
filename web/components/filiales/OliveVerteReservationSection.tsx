"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { useCallback, type FormEvent } from "react";

import { useRouter } from "@/i18n/navigation";
import { AnimateIn } from "@/components/ui/AnimateIn";
import { DURATION_S, EASE } from "@/lib/motion";

import "@/styles/olive-verte-reservation.css";

type Props = {
  backgroundImage: string;
};

export function OliveVerteReservationSection({ backgroundImage }: Props) {
  const t = useTranslations("subsidiaries");
  const router = useRouter();

  const handleSubmit = useCallback(
    (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      router.push("/contact");
    },
    [router],
  );

  return (
    <section className="olive-reservation">
      <div className="olive-reservation__media" aria-hidden="true">
        <Image
          src={backgroundImage}
          alt=""
          fill
          className="olive-reservation__image"
          sizes="100vw"
        />
        <span className="olive-reservation__overlay" />
      </div>

      <div className="olive-reservation__content">
        <AnimateIn>
          <h2 className="olive-reservation__title">{t("oliveVerteReservation.title")}</h2>
        </AnimateIn>
        <AnimateIn delay={0.08}>
          <p className="olive-reservation__description">
            {t("oliveVerteReservation.description")}
          </p>
        </AnimateIn>
        <motion.form
          className="olive-reservation__form"
          onSubmit={handleSubmit}
          initial={{ opacity: 0, y: 24, scale: 0.96 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: DURATION_S.luxe, ease: EASE.luxury, delay: 0.16 }}
        >
          <input
            type="email"
            required
            placeholder={t("oliveVerteReservation.placeholder")}
            aria-label={t("oliveVerteReservation.placeholder")}
            className="olive-reservation__input"
          />
          <button type="submit" className="olive-reservation__cta">
            {t("oliveVerteReservation.cta")}
          </button>
        </motion.form>
      </div>
    </section>
  );
}
