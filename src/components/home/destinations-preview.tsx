"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { Link } from "@/i18n/navigation";
import { ChevronRight } from "lucide-react";
import { getServiceDetailForLocale, type ServiceWithDetails } from "@/lib/services";

type DestinationsPreviewProps = {
  services: ServiceWithDetails[];
  locale: string;
  startingFrom: string;
};

export function DestinationsPreview({
  services,
  locale,
  startingFrom,
}: DestinationsPreviewProps) {
  const t = useTranslations("DestinationsPreview");

  const getTitle = (s: ServiceWithDetails) =>
    getServiceDetailForLocale(s.details, locale)?.title ?? s.slug;

  if (services.length === 0) {
    return null;
  }

  return (
    <section className="bg-muted/30 py-16 md:py-24">
      <div className="container mx-auto max-w-7xl px-4">
        <motion.div
          className="mb-10 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.5 }}
        >
          <div>
            <p className="text-sm font-medium uppercase tracking-wider text-teal-600">
              {t("subtitle")}
            </p>
            <h2 className="mt-1 text-3xl font-bold tracking-tight text-foreground md:text-4xl">
              {t("title")}
            </h2>
          </div>
          <Link
            href="/destinations"
            className="mt-4 flex items-center gap-1 text-base font-medium text-foreground transition-colors hover:text-teal-600 sm:mt-0"
          >
            {t("viewAll")}
            <ChevronRight className="size-5" />
          </Link>
        </motion.div>

        <motion.div
          className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.1 } },
          }}
        >
          {services.map((service, i) => {
            const title = getTitle(service);
            const location = service.location ?? "—";
            return (
              <motion.div
                key={service.id}
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0 },
                }}
              >
              <Link
                href={`/services/${service.slug}`}
                className="group overflow-hidden rounded-xl border bg-card shadow-sm transition-all hover:shadow-md"
              >
                <div className="relative aspect-[4/3] bg-muted">
                  {service.coverImage ? (
                    <Image
                      src={service.coverImage}
                      alt={title}
                      fill
                      unoptimized
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                      sizes="(max-width: 768px) 85vw, (max-width: 1200px) 45vw, 280px"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-teal-500/20 to-teal-700/30 text-4xl text-muted-foreground">
                      ✈️
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-foreground transition-colors group-hover:text-teal-600 line-clamp-2">
                    {title}
                  </h3>
                  <p className="mt-1 text-sm text-muted-foreground">{location}</p>
                  <p className="mt-2 text-base font-bold text-foreground">
                    {startingFrom} €{Math.round(service.priceAdult)}
                  </p>
                </div>
              </Link>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
