"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { useCallback, type FormEvent } from "react";

import { AnimateIn } from "@/components/ui/AnimateIn";
import { Toast, ToastViewport } from "@/components/ui/Toast";
import { Calendar, Clock, Mail, Phone, User, Users } from "@/lib/icons";
import { cormorant } from "@/lib/fonts";
import { DURATION_S, EASE, defaultScrollViewport } from "@/lib/motion";
import { useReservationForm } from "@/lib/use-reservation-form";

import "@/styles/muzik-cafe-reservation.css";

type Props = {
  backgroundImage: string;
  subsidiaryName: string;
  phone?: string;
};

const FIELDS = [
  { key: "name", icon: User, type: "text", required: true },
  { key: "phone", icon: Phone, type: "tel", required: false },
  { key: "email", icon: Mail, type: "email", required: true },
  { key: "people", icon: Users, type: "text", required: false },
  { key: "date", icon: Calendar, type: "text", required: false },
  { key: "time", icon: Clock, type: "text", required: false },
] as const;

export function MuzikCafeReservationSection({ backgroundImage, subsidiaryName, phone }: Props) {
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
    <section className={`muzik-reservation ${cormorant.variable}`}>
      <div
        className="muzik-reservation__media"
        style={{ backgroundImage: `url(${backgroundImage})` }}
        aria-hidden="true"
      >
        <span className="muzik-reservation__overlay" />
      </div>

      <div className="muzik-reservation__content">
        <AnimateIn>
          <h2 className="muzik-reservation__title">{t("muzikCafeReservation.title")}</h2>
        </AnimateIn>

        <form className="muzik-reservation__form" onSubmit={handleSubmit}>
          <div className="hidden" aria-hidden="true">
            <label htmlFor="muzik-resa-website">Ne pas remplir</label>
            <input id="muzik-resa-website" name="website" type="text" tabIndex={-1} autoComplete="off" />
          </div>

          <div className="muzik-reservation__grid">
            {FIELDS.map((field, i) => {
              const Icon = field.icon;
              const label = t(`muzikCafeReservation.${field.key}`);
              return (
                <motion.div
                  key={field.key}
                  className="muzik-reservation__field"
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={defaultScrollViewport}
                  transition={{ duration: DURATION_S.luxe, ease: EASE.luxury, delay: i * 0.06 }}
                >
                  <Icon size={18} className="muzik-reservation__field-icon" aria-hidden="true" />
                  <input
                    name={field.key}
                    type={field.type}
                    required={field.required}
                    placeholder={label}
                    aria-label={label}
                    className="muzik-reservation__input"
                  />
                </motion.div>
              );
            })}
          </div>

          {phone ? (
            <motion.a
              href={`tel:${phone.replace(/\s/g, "")}`}
              className="muzik-reservation__cta"
              initial={{ opacity: 0, y: 24, scale: 0.96 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={defaultScrollViewport}
              transition={{ duration: DURATION_S.luxe, ease: EASE.spring, delay: 0.3 }}
            >
              {t("muzikCafeReservation.cta")}
            </motion.a>
          ) : (
            <motion.button
              type="submit"
              className="muzik-reservation__cta"
              disabled={isSubmitting}
              initial={{ opacity: 0, y: 24, scale: 0.96 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={defaultScrollViewport}
              transition={{ duration: DURATION_S.luxe, ease: EASE.spring, delay: 0.3 }}
            >
              {isSubmitting ? tForm("submitting") : t("muzikCafeReservation.cta")}
            </motion.button>
          )}
        </form>
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
