import { setRequestLocale } from "next-intl/server";
import { getTranslations } from "next-intl/server";
import { getServicesWithUniqueLocations, getServiceDetailForLocale } from "@/lib/services";
import { Hero } from "@/components/layout/hero";
import { ServicesSection } from "@/components/service/services-section";
import { AnimatedSection } from "@/components/home/animated-section";
import { WhyChooseUs } from "@/components/home/why-choose-us";
import { StatsSection } from "@/components/home/stats-section";
import { DestinationsPreview } from "@/components/home/destinations-preview";
import { CtaSection } from "@/components/home/cta-section";
import { TrustBadges } from "@/components/layout/TrustBadges";
import { Testimonals } from "@/components/testimonals";

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function HomePage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("Home");
  // npx prisma db push 
  return (
    <>
      <Hero />
      <TrustBadges />
      <AnimatedSection>
        <ServicesSection
        locale={locale}
        featuredSubtitle={t("featuredSubtitle")}
        featuredTitle={t("featuredTitle")}
        viewAllPackages={t("viewAllPackages")}
        startingFrom={t("startingFrom")}
        />
      </AnimatedSection>
      <WhyChooseUs />
      <StatsSection />
      <Testimonals/>
      <DestinationsPreview
        services={await getServicesWithUniqueLocations(4)}
        locale={locale}
        startingFrom={t("startingFrom")}
      />
      <CtaSection />
    </>
  );
}
