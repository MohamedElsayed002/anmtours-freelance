/**
 * AI Chatbot - Shared types and constants
 */

export const PHYSICAL_LEVELS = ["Easy", "Moderate", "Hard"] as const;
export const BEST_TIME_OF_DAY = ["Morning", "Sunset", "Night"] as const;

export type PhysicalLevel = (typeof PHYSICAL_LEVELS)[number];
export type BestTimeOfDay = (typeof BEST_TIME_OF_DAY)[number];

export interface ServiceForEmbedding {
  id: string;
  details: { lang: string; title: string; description: string }[];
  highlights?: { lang: string; items: string[] }[] | null;
  includes?: { lang: string; items: string[] }[] | null;
  excludes?: { lang: string; items: string[] }[] | null;
  goodToKnow?: { lang: string; items: string[] }[] | null;
  duration?: string | null;
  category?: string | null;
  location?: string | null;
  maxParticipants?: number | null;
  priceAdult: number;
}

export interface RecommendationFilters {
  maxPrice?: number;
  minPrice?: number;
  duration?: string; // "half day" | "full day" | "1 day"
  category?: string;
  maxParticipants?: number;
  targetAudience?: string[]; // couples, families, kids, groups
  physicalLevel?: PhysicalLevel;
}

export interface RecommendedService {
  service: {
    id: string;
    slug: string;
    details: { lang: string; title: string; description: string }[];
    highlights?: { lang: string; items: string[] }[] | null;
    includes?: { lang: string; items: string[] }[] | null;
    excludes?: { lang: string; items: string[] }[] | null;
    priceAdult: number;
    priceKids: number;
    duration?: string | null;
    category?: string | null;
    location?: string | null;
    maxParticipants?: number | null;
  };
  score: number;
  embedding?: {
    tags: string[];
    targetAudience: string[];
    physicalLevel?: string | null;
    bestTimeOfDay?: string | null;
  };
}
