"use client";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { FeaturedExperienceCard } from "./featured-experience-card";
import { getServiceDetailForLocale } from "@/lib/services";
import type { ServiceWithDetails } from "@/lib/services";

type ServicesCarouselProps = {
  services: ServiceWithDetails[];
  locale: string;
  startingFrom: string;
};

export function ServicesCarousel({
  services,
  locale,
  startingFrom,
}: ServicesCarouselProps) {
  const getBadge = (index: number): "TOP RATED" | "BESTSELLER" | null => {
    if (index === 0) return "TOP RATED";
    if (index === 1) return "BESTSELLER";
    return null;
  };

  const getRating = (index: number) => {
    const ratings = [4.9, 4.8, 5.0, 4.7, 4.9, 4.6, 5.0, 4.8, 4.7, 5.0];
    return ratings[index % ratings.length];
  };

  const getReviewCount = (index: number) => {
    const counts = [124, 210, 89, 156, 203, 67, 98, 145, 112, 178];
    return counts[index % counts.length];
  };

  return (
    <Carousel
      opts={{
        align: "start",
        loop: true,
      }}
      className="w-full"
    >
      <CarouselContent className="-ml-4">
        {services.map((service, index) => {
          const detail = getServiceDetailForLocale(service.details, locale);
          return (
            <CarouselItem
              key={service.id}
              className="pl-4 sm:basis-[85%] md:basis-[45%] lg:basis-[380px]"
            >
              <FeaturedExperienceCard
                service={service}
                detail={detail}
                badge={getBadge(index)}
                rating={getRating(index)}
                reviewCount={getReviewCount(index)}
                startingFrom={startingFrom}
              />
            </CarouselItem>
          );
        })}
      </CarouselContent>
      <CarouselPrevious className="-left-2 size-10 border-2 bg-white shadow-md hover:bg-muted md:-left-6" />
      <CarouselNext className="-right-2 size-10 border-2 bg-white shadow-md hover:bg-muted md:-right-6" />
    </Carousel>
  );
}
