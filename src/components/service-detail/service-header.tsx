"use client";

import { Clock, Users, Star, Share2, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";

type ServiceHeaderProps = {
  title: string;
  duration?: string | null;
  maxParticipants?: number | null;
  languages?: string;
  rating?: number;
  reviewCount?: number;
};

export function ServiceHeader({
  title,
  duration,
  maxParticipants,
  languages = "English & German",
  rating = 4.9,
  reviewCount = 124,
}: ServiceHeaderProps) {
  return (
    <div
      className="space-y-4"
      role="region"
      aria-label="Service overview"
    >
      <h1 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl">
        {title}
      </h1>
      <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground">
        {duration && (
          <span className="flex items-center gap-2">
            <Clock className="size-4" />
            {duration}
          </span>
        )}
        {maxParticipants && (
          <span className="flex items-center gap-2">
            <Users className="size-4" />
            Max {maxParticipants} People
          </span>
        )}
      </div>
      {/* <div className="flex gap-2">
        <Button variant="outline" size="icon" aria-label="Share">
          <Share2 className="size-4" />
        </Button>
        <Button variant="outline" size="icon" aria-label="Add to favorites">
          <Heart className="size-4" />
        </Button>
      </div> */}
    </div>
  );
}
