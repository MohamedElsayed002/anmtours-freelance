import { setRequestLocale } from "next-intl/server";
import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import {
  getServiceBySlug,
  getServiceDetailForLocale,
  getArrayForLocale,
} from "@/lib/services";
import { AnimatedSection } from "@/components/home/animated-section";
import { ServiceBreadcrumbs } from "@/components/service-detail/service-breadcrumbs";
import { ServiceHeader } from "@/components/service-detail/service-header";
import { ServiceGallery } from "@/components/service-detail/service-gallery";
import { ServiceTabs } from "@/components/service-detail/service-tabs";
import { BookingSidebar } from "@/components/service-detail/booking-sidebar";
import { DemandNotification } from "@/components/service-detail/demand-notification";
import { HelpSection } from "@/components/service-detail/help-section";

type Props = {
  params: Promise<{ locale: string; slug: string }>;
};

export default async function ServicePage({ params }: Props) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("Service");

  const service = await getServiceBySlug(slug);
  if (!service) notFound();

  const detail = getServiceDetailForLocale(service.details, locale);
  const title = detail?.title ?? "Untitled";
  const description = detail?.description ?? "";
  const highlights = getArrayForLocale(service.highlights, locale);
  const includes = getArrayForLocale(service.includes, locale);
  const excludes = getArrayForLocale(service.excludes, locale);
  const goodToKnow = getArrayForLocale(service.goodToKnow, locale);

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto max-w-7xl px-4 py-8">
        <AnimatedSection fast>
          <ServiceBreadcrumbs
            title={title}
            category={service.category}
            homeLabel={t("home")}
            toursLabel={t("tours")}
          />
        </AnimatedSection>

        <AnimatedSection className="mt-6" fast>
          <ServiceHeader
            title={title}
            duration={service.duration}
            maxParticipants={service.maxParticipants}
          />
        </AnimatedSection>

        <AnimatedSection className="mt-8">
          <ServiceGallery
            coverImage={service.coverImage}
            images={service.images ?? []}
            title={title}
            viewAllPhotosLabel={t("viewAllPhotos", {
              count: (service.coverImage ? 1 : 0) + (service.images?.length ?? 0),
            })}
          />
        </AnimatedSection>

        <div className="mt-12 grid gap-12 lg:grid-cols-3">
          <AnimatedSection className="lg:col-span-2">
            <ServiceTabs
              description={description}
              highlights={highlights}
              includes={includes}
              excludes={excludes}
              goodToKnow={goodToKnow}
              location={service.location}
              overviewTabLabel={t("overview")}
              highlightsLabel={t("highlights")}
              descriptionLabel={t("description")}
              includesTabLabel={t("whatIncluded")}
              excludesTabLabel={t("excludes")}
              goodToKnowTabLabel={t("goodToKnow")}
              locationTabLabel={t("locationTab")}
              faqTabLabel={t("faq")}
            />
          </AnimatedSection>

          <AnimatedSection className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              <BookingSidebar
                serviceId={service.id}
                priceAdult={service.priceAdult}
                priceKids={service.priceKids}
                perPersonLabel={t("perPerson")}
                selectDatesLabel={t("selectDates")}
                travelersLabel={t("travelers")}
                travelersHintLabel={t("travelersHint")}
                adultsLabel={t("adults")}
                childrenLabel={t("children")}
                infantsLabel={t("infants")}
                localTaxesLabel={t("localTaxes")}
                totalLabel={t("total")}
                bookButtonLabel={t("bookButton")}
                secureLabel={t("secureBooking")}
              />
              {/* <DemandNotification message={t("highDemand")} /> */}
              <HelpSection
                title={t("needHelp")}
                description={t("helpDesc")}
                buttonLabel={t("chatExpert")}
              />
            </div>
          </AnimatedSection>
        </div>
      </div>
    </div>
  );
}
