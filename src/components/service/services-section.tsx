import { ChevronRight, Compass, MapPin, Waves } from "lucide-react";
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
  const featuredLocations = [
    {
      key: "sharm-elsheikh",
      title: "Sharm El Sheikh",
      subtitle: "Red Sea escapes, desert adventures, and iconic snorkeling trips.",
      accent: "from-cyan-500/15 via-sky-500/10 to-transparent",
      badgeClass:
        "border-cyan-200 bg-cyan-500/10 text-cyan-700 dark:border-cyan-900 dark:text-cyan-300",
      icon: Waves,
      services: services.filter(
        (item) => item.serviceLocation === "sharm-elsheikh"
      ),
    },
    {
      key: "hurghada",
      title: "Hurghada",
      subtitle: "Island hopping, glassy waters, and easy-going coastal getaways.",
      accent: "from-amber-500/15 via-orange-500/10 to-transparent",
      badgeClass:
        "border-amber-200 bg-amber-500/10 text-amber-700 dark:border-amber-900 dark:text-amber-300",
      icon: Compass,
      services: services.filter((item) => item.serviceLocation === "hurghada"),
    },
  ].filter((location) => location.services.length > 0);

  if (featuredLocations.length === 0) {
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

          <div className="space-y-8">
            {featuredLocations.map((location) => {
              const Icon = location.icon;

              return (
                <div
                  key={location.key}
                  className="overflow-hidden rounded-[2rem] border border-border/60 bg-background shadow-sm"
                >
                  <div
                    className={`bg-gradient-to-r ${location.accent} px-6 py-6 sm:px-8`}
                  >
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                      <div className="space-y-3">
                        <div
                          className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] ${location.badgeClass}`}
                        >
                          <Icon className="size-3.5" />
                          Featured in {location.title}
                        </div>
                        <div>
                          <h3 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
                            {location.title}
                          </h3>
                          <p className="mt-2 max-w-2xl text-sm text-muted-foreground sm:text-base">
                            {location.subtitle}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 self-start rounded-full border border-border/70 bg-background/80 px-4 py-2 text-sm text-muted-foreground backdrop-blur">
                        <MapPin className="size-4 text-teal-600" />
                        <span>
                          {location.services.length} experience
                          {location.services.length === 1 ? "" : "s"}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="relative px-6 py-6 md:px-12 md:py-8">
                    <ServicesCarousel
                      services={location.services}
                      locale={locale}
                      startingFrom={startingFrom}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
