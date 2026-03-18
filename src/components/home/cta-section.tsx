"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";

export function CtaSection() {
  const t = useTranslations("CtaSection");

  return (
    <section className="py-16 md:py-24">
      <div className="container mx-auto max-w-7xl px-4">
        <motion.div
          className="overflow-hidden rounded-2xl bg-gradient-to-br from-teal-600 to-teal-800 px-6 py-16 text-center md:px-12 md:py-20"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-2xl font-bold text-white md:text-3xl lg:text-4xl">
            {t("title")}
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-lg text-teal-100">
            {t("subtitle")}
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button
              size="lg"
              asChild
              className="rounded-xl bg-white px-8 font-semibold text-teal-700 hover:bg-teal-50"
            >
              <Link href="/destinations">{t("exploreTours")}</Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              asChild
              className="rounded-xl border-2 border-white bg-transparent font-semibold text-white hover:bg-white/10"
            >
              <Link href="/contact">{t("contactUs")}</Link>
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
