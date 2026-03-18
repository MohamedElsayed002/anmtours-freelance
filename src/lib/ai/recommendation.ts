/**
 * RAG Recommendation Engine
 * Combines vector search + metadata filtering + full service data for LLM context
 */

import { prisma } from "@/lib/prisma";
import { generateEmbedding } from "./embeddings";
import { vectorSearch } from "./vector-search";
import type { RecommendationFilters, RecommendedService } from "./types";

/**
 * Parse user message for metadata filters (simple extraction)
 */
function extractFiltersFromMessage(message: string): RecommendationFilters {
  const lower = message.toLowerCase();
  const filters: RecommendationFilters = {};

  // Price hints
  if (/cheap|budget|affordable|low cost|inexpensive/i.test(lower))
    filters.maxPrice = 50;
  if (/expensive|premium|luxury|high end/i.test(lower))
    filters.minPrice = 100;

  // Duration
  if (/half day|half-day|morning only|few hours/i.test(lower))
    filters.duration = "half day";
  if (/full day|whole day|one day|1 day|all day/i.test(lower))
    filters.duration = "full day";

  // Target audience
  if (/romantic|couple|honeymoon|two of us/i.test(lower))
    filters.targetAudience = ["couples"];
  if (/family|families|with kids|children/i.test(lower))
    filters.targetAudience = ["families", "kids"];
  if (/group|groups|we are \d+|corporate/i.test(lower))
    filters.targetAudience = ["groups"];

  // Category hints
  if (/adventure|adventurous|thrill/i.test(lower)) filters.category = "adventure";
  if (/cultural|culture|history|heritage/i.test(lower))
    filters.category = "cultural";
  if (/relax|relaxing|chill|peaceful|spa/i.test(lower))
    filters.category = "relaxing";
  if (/water|diving|snorkel|swim|beach/i.test(lower) && !filters.category)
    filters.category = "adventure";

  return filters;
}

/**
 * Get recommended services for a user message using RAG pipeline
 */
export async function getRecommendedServices(
  userMessage: string,
  limit = 5
): Promise<RecommendedService[]> {
  const filters = extractFiltersFromMessage(userMessage);
  const queryEmbedding = await generateEmbedding(userMessage);
  const searchResults = await vectorSearch(queryEmbedding, filters, limit);

  const recommended: RecommendedService[] = [];

  for (const result of searchResults) {
    const service = await prisma.service.findUnique({
      where: { id: result.serviceId },
      select: {
        id: true,
        slug: true,
        details: true,
        highlights: true,
        includes: true,
        excludes: true,
        priceAdult: true,
        priceKids: true,
        duration: true,
        category: true,
        location: true,
        maxParticipants: true,
      },
    });

    if (service) {
      recommended.push({
        service: service as RecommendedService["service"],
        score: result.score,
        embedding: result.embedding,
      });
    }
  }

  return recommended;
}
