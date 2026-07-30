"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { useTranslations } from "next-intl";
import { useCallback, type FormEvent } from "react";

import { MexicanMotifs } from "@/components/filiales/MexicanMotifs";
import { Toast, ToastViewport } from "@/components/ui/Toast";
import { ArrowUpRight, Mail, Phone, User, Users } from "@/lib/icons";
import { DURATION_S, EASE, defaultScrollViewport } from "@/lib/motion";
import { useReservationForm } from "@/lib/use-reservation-form";

import "@/styles/gourmet-mexicana-reservation.css";

const CHEF_PHOTO = "/filiales/photos/filiale-07/mascottemexiacain.png";

const FIELDS = [
  { key: "name", icon: User, type: "text", required: true },
  { key: "phone", icon: Phone, type: "tel", required: false },
  { key: "email", icon: Mail, type: "email", required: true },
  { key: "guests", icon: Users, type: "text", required: false },
] as const;

export function GourmetMexicanaReservationSection() {
  const reduced = useReducedMotion();
  const t = useTranslations("subsidiaries");
  const tForm = useTranslations("form");
  const { isSubmitting, toast, setToast, submit } = useReservationForm("Réservation — Gourmet Mexicana");

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

  const staggerMotion = (i: number) =>
    reduced
      ? {}
      : {
          initial: { opacity: 0, y: 24 },
          whileInView: { opacity: 1, y: 0 },
          viewport: defaultScrollViewport,
          transition: { duration: DURATION_S.shimmer, ease: EASE.luxury, delay: i * 0.08 },
        };

  return (
    <>
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
            <div className="hidden" aria-hidden="true">
              <label htmlFor="mex-resa-website">Ne pas remplir</label>
              <input id="mex-resa-website" name="website" type="text" tabIndex={-1} autoComplete="off" />
            </div>

            <div className="mex-reservation__grid">
              {FIELDS.map((field) => {
                const Icon = field.icon;
                const label = t(`gourmetMexicanaReservation.${field.key}Field`);
                return (
                  <div key={field.key} className="mex-reservation__field">
                    <Icon size={16} className="mex-reservation__field-icon" aria-hidden="true" />
                    <input
                      name={field.key}
                      type={field.type}
                      required={field.required}
                      placeholder={label}
                      aria-label={label}
                      className="mex-reservation__input"
                    />
                  </div>
                );
              })}
            </div>

            <motion.button
              type="submit"
              className="mex-reservation__submit"
              disabled={isSubmitting}
              {...staggerMotion(4)}
            >
              {isSubmitting ? tForm("submitting") : t("gourmetMexicanaReservation.submitLabel")}
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
            transition={{ duration: DURATION_S.shimmer, ease: EASE.luxury, delay: 0.15 }}
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
