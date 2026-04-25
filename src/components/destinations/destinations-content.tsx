"use client";

import { useState, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import { Link, usePathname } from "@/i18n/navigation";
import { Search, MapPin, Clock } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getServiceDetailForLocale } from "@/lib/services";
import { Pagination } from "@/components/ui/pagination";
import { SERVICE_LOCATION_OPTIONS } from "@/lib/service-location";

/** Number of service cards shown per page */
const ITEMS_PER_PAGE = 10;

type ServiceWithTitle = {
  id: string;
  slug: string;
  coverImage: string | null;
  details: unknown;
  category: string | null;
  location: string | null;
  serviceLocation: string;
  duration: string | null;
  priceAdult: number;
  priceKids: number;
};

type DestinationsContentProps = {
  services: ServiceWithTitle[];
  locale: string;
  searchPlaceholder: string;
  filtersLabel: string;
  clearAllLabel: string;
  categoryLabel: string;
  locationLabel: string;
  serviceLocationLabel: string;
  durationLabel: string;
  priceRangeLabel: string;
  minPriceLabel: string;
  maxPriceLabel: string;
  listingsLabel: string;
  newestLabel: string;
  lowestPriceLabel: string;
  highestPriceLabel: string;
  viewDetailsLabel: string;
  fromLabel: string;
  noResultsLabel: string;
};

export function DestinationsContent({
  services,
  locale,
  searchPlaceholder,
  filtersLabel,
  clearAllLabel,
  categoryLabel,
  locationLabel,
  serviceLocationLabel,
  durationLabel,
  priceRangeLabel,
  minPriceLabel,
  maxPriceLabel,
  listingsLabel,
  newestLabel,
  lowestPriceLabel,
  highestPriceLabel,
  viewDetailsLabel,
  fromLabel,
  noResultsLabel,
}: DestinationsContentProps) {
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const [search, setSearch] = useState("");
  const [categories, setCategories] = useState<Set<string>>(new Set());
  const [locations, setLocations] = useState<Set<string>>(new Set());
  const [serviceLocations, setServiceLocations] = useState<Set<string>>(
    new Set()
  );
  const [durations, setDurations] = useState<Set<string>>(new Set());
  const [priceMin, setPriceMin] = useState("");
  const [priceMax, setPriceMax] = useState("");
  const [sort, setSort] = useState<"newest" | "lowest" | "highest">("newest");

  const uniqueCategories = useMemo(
    () =>
      Array.from(
        new Set(services.map((s) => s.category).filter(Boolean)) as Set<string>
      ).sort(),
    [services]
  );
  const uniqueLocations = useMemo(
    () =>
      Array.from(
        new Set(services.map((s) => s.location).filter(Boolean)) as Set<string>
      ).sort(),
    [services]
  );
  const availableServiceLocations = useMemo(
    () =>
      SERVICE_LOCATION_OPTIONS.filter((option) =>
        services.some((service) => service.serviceLocation === option.value)
      ),
    [services]
  );
  const uniqueDurations = useMemo(
    () =>
      Array.from(
        new Set(services.map((s) => s.duration).filter(Boolean)) as Set<string>
      ).sort(),
    [services]
  );

  const toggleFilter = (
    setter: React.Dispatch<React.SetStateAction<Set<string>>>,
    value: string
  ) => {
    setter((prev) => {
      const next = new Set(prev);
      if (next.has(value)) next.delete(value);
      else next.add(value);
      return next;
    });
  };

  const clearAll = () => {
    setCategories(new Set());
    setLocations(new Set());
    setServiceLocations(new Set());
    setDurations(new Set());
    setPriceMin("");
    setPriceMax("");
  };

  const filteredAndSorted = useMemo(() => {
    let result = services.filter((service) => {
      const detail = getServiceDetailForLocale(service.details, locale);
      const title = detail?.title ?? "";
      const description = detail?.description ?? "";

      if (search.trim()) {
        const q = search.toLowerCase();
        if (
          !title.toLowerCase().includes(q) &&
          !description.toLowerCase().includes(q) &&
          !(service.category?.toLowerCase().includes(q)) &&
          !(service.location?.toLowerCase().includes(q)) &&
          !SERVICE_LOCATION_OPTIONS.some(
            (option) =>
              option.value === service.serviceLocation &&
              option.label.toLowerCase().includes(q)
          )
        ) {
          return false;
        }
      }

      if (categories.size > 0 && service.category && !categories.has(service.category)) {
        return false;
      }
      if (locations.size > 0 && service.location && !locations.has(service.location)) {
        return false;
      }
      if (
        serviceLocations.size > 0 &&
        !serviceLocations.has(service.serviceLocation)
      ) {
        return false;
      }
      if (durations.size > 0 && service.duration && !durations.has(service.duration)) {
        return false;
      }

      const min = priceMin ? parseFloat(priceMin) : null;
      const max = priceMax ? parseFloat(priceMax) : null;
      if (min !== null && !isNaN(min) && service.priceAdult < min) return false;
      if (max !== null && !isNaN(max) && service.priceAdult > max) return false;

      return true;
    });

    result = [...result].sort((a, b) => {
      if (sort === "newest") return 0;
      if (sort === "lowest") return a.priceAdult - b.priceAdult;
      return b.priceAdult - a.priceAdult;
    });

    return result;
  }, [
    services,
    locale,
    search,
    categories,
    locations,
    serviceLocations,
    durations,
    priceMin,
    priceMax,
    sort,
  ]);

  // Pagination: read page from URL, clamp to valid range
  const rawPage = searchParams.get("page");
  const parsedPage = Math.max(1, parseInt(rawPage ?? "1", 10) || 1);
  const totalItems = filteredAndSorted.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / ITEMS_PER_PAGE));
  const currentPage = Math.min(parsedPage, totalPages);

  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedItems = filteredAndSorted.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  );

  return (
    <div className="max-w-7xl mx-auto px-12 md:px-0 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Tours & Experiences</h1>
        <p className="mt-2 text-muted-foreground">
          Explore our curated trips and day excursions. Filter by category, location, or price.
        </p>
      </div>

      <div className="flex flex-col gap-8 lg:flex-row">
        {/* Filters sidebar */}
        <aside className="w-full shrink-0 rounded-xl border bg-card p-6 lg:w-72">
          <div className="space-y-4">
            <div>
              <label className="mb-2 block text-sm font-medium">
                Search by title
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder={searchPlaceholder}
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <h2 className="font-semibold">{filtersLabel}</h2>
              <button
                type="button"
                onClick={clearAll}
                className="text-sm text-primary hover:underline"
              >
                {clearAllLabel}
              </button>
            </div>

            <Accordion
              type="multiple"
              defaultValue={[
                "category",
                "service-location",
                "location",
                "duration",
                "price",
              ]}
            >
              {uniqueCategories.length > 0 && (
                <AccordionItem value="category">
                  <AccordionTrigger>{categoryLabel}</AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-2">
                      {uniqueCategories.map((cat) => (
                        <label
                          key={cat}
                          className="flex cursor-pointer items-center gap-2"
                        >
                          <input
                            type="checkbox"
                            checked={categories.has(cat)}
                            onChange={() => toggleFilter(setCategories, cat)}
                            className="size-4 rounded border-input"
                          />
                          <span className="text-sm">{cat}</span>
                        </label>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              )}

              {availableServiceLocations.length > 0 && (
                <AccordionItem value="service-location">
                  <AccordionTrigger>{serviceLocationLabel}</AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-2">
                      {availableServiceLocations.map((serviceLocation) => (
                        <label
                          key={serviceLocation.value}
                          className="flex cursor-pointer items-center gap-2"
                        >
                          <input
                            type="checkbox"
                            checked={serviceLocations.has(serviceLocation.value)}
                            onChange={() =>
                              toggleFilter(
                                setServiceLocations,
                                serviceLocation.value
                              )
                            }
                            className="size-4 rounded border-input"
                          />
                          <span className="text-sm">{serviceLocation.label}</span>
                        </label>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              )}

              {uniqueLocations.length > 0 && (
                <AccordionItem value="location">
                  <AccordionTrigger>{locationLabel}</AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-2">
                      {uniqueLocations.map((loc) => (
                        <label
                          key={loc}
                          className="flex cursor-pointer items-center gap-2"
                        >
                          <input
                            type="checkbox"
                            checked={locations.has(loc)}
                            onChange={() => toggleFilter(setLocations, loc)}
                            className="size-4 rounded border-input"
                          />
                          <span className="text-sm">{loc}</span>
                        </label>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              )}

              {uniqueDurations.length > 0 && (
                <AccordionItem value="duration">
                  <AccordionTrigger>{durationLabel}</AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-2">
                      {uniqueDurations.map((dur) => (
                        <label
                          key={dur}
                          className="flex cursor-pointer items-center gap-2"
                        >
                          <input
                            type="checkbox"
                            checked={durations.has(dur)}
                            onChange={() => toggleFilter(setDurations, dur)}
                            className="size-4 rounded border-input"
                          />
                          <span className="text-sm">{dur}</span>
                        </label>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              )}

              <AccordionItem value="price">
                <AccordionTrigger>{priceRangeLabel}</AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-3">
                    <div>
                      <label className="mb-1 block text-xs text-muted-foreground">
                        {minPriceLabel} ($)
                      </label>
                      <Input
                        type="number"
                        placeholder="0"
                        value={priceMin}
                        onChange={(e) => setPriceMin(e.target.value)}
                        min={0}
                        step={10}
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-xs text-muted-foreground">
                        {maxPriceLabel} ($)
                      </label>
                      <Input
                        type="number"
                        placeholder="500"
                        value={priceMax}
                        onChange={(e) => setPriceMax(e.target.value)}
                        min={0}
                        step={10}
                      />
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </aside>

        {/* Main content */}
        <div className="flex-1 min-w-0">
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-muted-foreground">
              {filteredAndSorted.length} {listingsLabel}
            </p>
            <Select value={sort} onValueChange={(v: "newest" | "lowest" | "highest") => setSort(v)}>
              <SelectTrigger className="w-[180px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">{newestLabel}</SelectItem>
                <SelectItem value="lowest">{lowestPriceLabel}</SelectItem>
                <SelectItem value="highest">{highestPriceLabel}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {paginatedItems.map((service) => {
              const detail = getServiceDetailForLocale(service.details, locale);
              const title = detail?.title ?? "Untitled";
              const description = detail?.description ?? "";
              const truncatedDesc =
                description.length > 120 ? `${description.slice(0, 120)}...` : description;

              return (
                <div
                  key={service.id}
                  className="group flex flex-col overflow-hidden rounded-xl border bg-card shadow-sm transition-shadow hover:shadow-lg"
                >
                  <Link href={`/services/${service.slug}`}>
                    <div className="relative aspect-[4/3] overflow-hidden bg-muted">
                      {service.coverImage ? (
                        <Image
                          src={service.coverImage}
                          alt={title}
                          fill
                          className="object-cover transition-transform duration-300 group-hover:scale-105"
                          sizes="(max-width: 640px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          unoptimized
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center text-muted-foreground">
                          No image
                        </div>
                      )}
                      {service.category && (
                        <span className="absolute left-3 top-3 rounded-full bg-primary/90 px-2 py-0.5 text-xs font-medium text-primary-foreground">
                          {service.category}
                        </span>
                      )}
                    </div>
                  </Link>
                  <div className="flex flex-1 flex-col p-4">
                    <h3 className="line-clamp-2 font-semibold">{title}</h3>
                    <div className="mt-2 flex flex-wrap gap-3 text-sm text-muted-foreground">
                      {service.location && (
                        <span className="flex items-center gap-1">
                          <MapPin className="size-4" />
                          {service.location}
                        </span>
                      )}
                      {service.duration && (
                        <span className="flex items-center gap-1">
                          <Clock className="size-4" />
                          {service.duration}
                        </span>
                      )}
                    </div>
                    <p className="mt-2 line-clamp-2 flex-1 text-sm text-muted-foreground">
                      {truncatedDesc}
                    </p>
                    <div className="mt-4 flex items-end justify-between gap-2">
                      <div>
                        <span className="text-xl font-bold">
                          ${Math.round(service.priceAdult)}
                        </span>
                        <span className="ml-1 text-sm text-muted-foreground">
                          /{fromLabel}
                        </span>
                      </div>
                      <Button asChild variant="default" size="sm">
                        <Link href={`/services/${service.slug}`}>
                          {viewDetailsLabel}
                        </Link>
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {filteredAndSorted.length === 0 && (
            <div className="rounded-xl border border-dashed p-12 text-center text-muted-foreground">
              {noResultsLabel}
            </div>
          )}

          {filteredAndSorted.length > 0 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              basePath={pathname}
              ariaLabel="Destinations pagination"
              className="mt-8"
            />
          )}
        </div>
      </div>
    </div>
  );
}
