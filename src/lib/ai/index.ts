/**
 * AI Chatbot & RAG module
 */

export { buildEmbeddingContent } from "./embedding-content";
export {
  generateEmbedding,
  generateAndStoreServiceEmbedding,
  deleteServiceEmbedding,
} from "./embeddings";
export type { EmbeddingVector } from "./embeddings";
export { vectorSearch } from "./vector-search";
export type { VectorSearchResult } from "./vector-search";
export { getRecommendedServices } from "./recommendation";
export { buildSystemPrompt } from "./system-prompt";
export type {
  ServiceForEmbedding,
  RecommendationFilters,
  RecommendedService,
  PhysicalLevel,
  BestTimeOfDay,
} from "./types";
