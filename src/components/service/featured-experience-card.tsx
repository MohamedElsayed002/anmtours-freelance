"use client";

import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { Clock, ChevronRight, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useWishlist } from "@/contexts/wishlist-context";
import type { ServiceWithDetails } from "@/lib/services";

type FeaturedExperienceCardProps = {
  service: ServiceWithDetails;
  detail: { title: string; description: string } | null;
  badge?: "TOP RATED" | "BESTSELLER" | null;
  rating?: number;
  reviewCount?: number;
  startingFrom: string;
};

export function FeaturedExperienceCard({
  service,
  detail,
  badge,
  startingFrom,
}: FeaturedExperienceCardProps) {
  const { isInWishlist, toggleWishlist } = useWishlist();
  const title = detail?.title ?? "Untitled";

  return (
    <div className="group flex min-w-0 shrink-0 flex-col overflow-hidden rounded-xl bg-white shadow-md transition-shadow hover:shadow-lg">
      {/* Image area */}
      <Link href={`/services/${service.slug}`} className="relative block aspect-[4/3] overflow-hidden">
        {service.coverImage ? (
          <Image
            src={service.coverImage}
            alt={title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 768px) 85vw, (max-width: 1200px) 45vw, 380px"
            unoptimized
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-muted text-muted-foreground">
            No image
          </div>
        )}
        {/* Badge */}
        {badge && (
          <span className="absolute left-3 top-3 rounded px-2 py-1 text-xs font-semibold uppercase tracking-wide text-white bg-slate-900/90">
            {badge}
          </span>
        )}
        {/* Wishlist */}
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            toggleWishlist(service.id);
          }}
          className="absolute right-3 top-3 flex size-9 items-center justify-center rounded-full border border-white/30 bg-white/20 text-white backdrop-blur-sm transition-colors hover:bg-white/30"
          aria-label={isInWishlist(service.id) ? "Remove from wishlist" : "Add to wishlist"}
        >
          <Heart className={`size-4 ${isInWishlist(service.id) ? "fill-white" : ""} stroke-white`} />
        </button>
      </Link>

      {/* Content area */}
      <div className="flex flex-1 flex-col p-4">
        {/* Duration & Rating row */}
        <div className="mb-2 flex items-center justify-between text-sm">
          {service.duration && (
            <span className="flex items-center gap-1.5 text-muted-foreground">
              <Clock className="size-4" />
              {service.duration}
            </span>
          )}
          <span className="flex items-center gap-1.5 font-medium text-blue-600">
            {/* <Star className="size-4 fill-blue-600" /> */}
            {/* {rating} ({reviewCount} {reviewCount === 1 ? "review" : "reviews"}) */}
          </span>
        </div>

        {/* Title */}
        <h3 className="mb-3 line-clamp-2 text-base font-bold text-foreground">
          {title}
        </h3>

        {/* Price & CTA */}
        <div className="mt-auto flex items-end justify-between gap-2">
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              {startingFrom}
            </p>
            <p className="text-xl font-bold text-foreground">
              €{Math.round(service.priceAdult)}
            </p>
          </div>
          <Button
            asChild
            variant="secondary"
            size="icon"
            className="shrink-0 rounded-lg bg-muted hover:bg-muted/80"
          >
            <Link href={`/services/${service.slug}`}>
              <ChevronRight className="size-5 text-foreground" />
              <span className="sr-only">View details</span>
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
