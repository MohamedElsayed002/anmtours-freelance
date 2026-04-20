"use client";

import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, Clock, Heart } from "lucide-react";
import { useWishlist } from "@/contexts/wishlist-context";
import type { ServiceWithDetails } from "@/lib/services";

type ServiceCardProps = {
  service: ServiceWithDetails;
  detail: { title: string; description: string } | null;
  viewDetails: string;
  from: string;
};

export function ServiceCard({
  service,
  detail,
  viewDetails,
  from,
}: ServiceCardProps) {
  const { isInWishlist, toggleWishlist } = useWishlist();
  const title = detail?.title ?? "Untitled";
  const description = detail?.description ?? "";
  const truncatedDesc =
    description.length > 120 ? `${description.slice(0, 120)}...` : description;

  return (
    <Card className="overflow-hidden transition-shadow hover:shadow-lg">
      <Link href={`/services/${service.slug}`}>
        <div className="relative aspect-[4/3] overflow-hidden bg-muted">
          {service.coverImage ? (
            <Image
              src={service.coverImage}
              alt={title}
              fill
              className="object-cover transition-transform hover:scale-105"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
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
      <CardHeader className="pb-2">
        <h3 className="line-clamp-2 text-lg font-semibold">{title}</h3>
        <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
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
      </CardHeader>
      <CardContent className="pb-4">
        <p className="line-clamp-3 text-sm text-muted-foreground">
          {truncatedDesc}
        </p>
      </CardContent>
      <CardFooter className="flex items-center justify-between border-t pt-4">
        <div>
          <span className="text-2xl font-bold">${Math.round(service.priceAdult)}</span>
          <span className="ml-1 text-sm text-muted-foreground">{from}</span>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className={isInWishlist(service.id) ? "text-primary" : ""}
            onClick={() => toggleWishlist(service.id)}
            aria-label={isInWishlist(service.id) ? "Remove from wishlist" : "Add to wishlist"}
          >
            <Heart className={`h-4 w-4 ${isInWishlist(service.id) ? "fill-current" : ""}`} />
          </Button>
          <Button asChild variant="default" size="sm">
            <Link href={`/services/${service.slug}`}>{viewDetails}</Link>
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
