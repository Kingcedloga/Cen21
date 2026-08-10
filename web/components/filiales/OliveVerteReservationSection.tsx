"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { useCallback, type FormEvent } from "react";

import { AnimateIn } from "@/components/ui/AnimateIn";
import { Toast, ToastViewport } from "@/components/ui/Toast";
import { DURATION_S, EASE } from "@/lib/motion";
import { useReservationForm } from "@/lib/use-reservation-form";

import "@/styles/olive-verte-reservation.css";

type Props = {
  backgroundImage: string;
  subsidiaryName: string;
  phone?: string;
};

export function OliveVerteReservationSection({ backgroundImage, subsidiaryName, phone }: Props) {
  const t = useTranslations("subsidiaries");
  const tForm = useTranslations("form");
  const { isSubmitting, toast, setToast, submit } = useReservationForm(
    `Réservation — ${subsidiaryName}`,
  );

  const handleSubmit = useCallback(
    (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      void submit(event.currentTarget, {
        successTitle: tForm("successTitle"),
        successBody: tForm("successBody"),
        errorTitle: tForm("errorTitle"),
        errorBody: tForm("errorBody"),
      });
    },
    [submit, tForm],
  );

  return (
    <>
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
          <div className="hidden" aria-hidden="true">
            <label htmlFor="olive-resa-website">Ne pas remplir</label>
            <input id="olive-resa-website" name="website" type="text" tabIndex={-1} autoComplete="off" />
          </div>
          <input
            name="name"
            type="text"
            required
            placeholder={t("oliveVerteReservation.namePlaceholder")}
            aria-label={t("oliveVerteReservation.namePlaceholder")}
            className="olive-reservation__input"
          />
          <input
            name="email"
            type="email"
            required
            placeholder={t("oliveVerteReservation.placeholder")}
            aria-label={t("oliveVerteReservation.placeholder")}
            className="olive-reservation__input"
          />
          {phone ? (
            <a href={`tel:${phone.replace(/\s/g, "")}`} className="olive-reservation__cta">
              {t("oliveVerteReservation.cta")}
            </a>
          ) : (
            <button type="submit" className="olive-reservation__cta" disabled={isSubmitting}>
              {isSubmitting ? tForm("submitting") : t("oliveVerteReservation.cta")}
            </button>
          )}
        </motion.form>
      </div>
    </section>

      <ToastViewport>
        {toast && (
          <Toast
            key={`${toast.variant}-${toast.title}`}
            variant={toast.variant}
            title={toast.title}
            message={toast.message}
            onClose={() => setToast(null)}
          />
        )}
      </ToastViewport>
    </>
  );
}
