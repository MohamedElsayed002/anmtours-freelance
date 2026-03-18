import { ChevronRight } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { getServices } from "@/lib/services";
import { ServicesCarousel } from "./services-carousel";

type ServicesSectionProps = {
  locale: string;
  featuredSubtitle?: string;
  featuredTitle?: string;
  viewAllPackages?: string;
  startingFrom?: string;
};

export async function ServicesSection({
  locale,
  featuredSubtitle = "HANDPICKED JOURNEYS",
  featuredTitle = "Featured Experiences",
  viewAllPackages = "View all packages",
  startingFrom = "STARTING FROM",
}: ServicesSectionProps) {
  const services = await getServices();

  if (services.length === 0) {
    return (
      <section className="bg-muted/30 py-16">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-medium uppercase tracking-wider text-teal-600">
              {featuredSubtitle}
            </p>
            <h2 className="mt-2 text-2xl font-bold">{featuredTitle}</h2>
            <p className="mt-6 text-muted-foreground">
              No services yet. Check back soon for amazing travel experiences!
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-muted/30 py-16">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-7xl">
          {/* Section header */}
          <div className="mb-10 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-medium uppercase tracking-wider text-teal-600">
                {featuredSubtitle}
              </p>
              <h2 className="mt-1 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                {featuredTitle}
              </h2>
            </div>
            <Link
              href="/destinations"
              className="mt-4 flex items-center gap-1 text-base font-medium text-foreground transition-colors hover:text-teal-600 sm:mt-0"
            >
              {viewAllPackages}
              <ChevronRight className="size-5" />
            </Link>
          </div>

          {/* Carousel */}
          <div className="relative px-6 md:px-12">
            <ServicesCarousel
              services={services}
              locale={locale}
              startingFrom={startingFrom}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
