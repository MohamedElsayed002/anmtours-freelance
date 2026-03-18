# AI Travel Assistant Chatbot

RAG-powered chatbot for personalized travel recommendations in Sharm El Sheikh.

## Architecture

```
src/lib/ai/
├── types.ts           # Shared types & constants
├── embedding-content.ts  # Builds embedding text from service data
├── embeddings.ts      # OpenAI embeddings + storage
├── vector-search.ts   # Cosine similarity search
├── recommendation.ts  # RAG pipeline with metadata filtering
├── system-prompt.ts   # LLM system prompt
└── index.ts           # Public exports
```

## Setup

1. **Environment variables** (`.env`):
   ```
   OPENAI_API_KEY=sk-...
   DATABASE_URL=mongodb+srv://...
   ```

2. **Generate embeddings for existing services**:
   ```bash
   npm run generate:embeddings
   ```

3. **New services**: Embeddings are generated automatically when creating/updating services via the admin dashboard.

## Flow

1. **User message** → Chat API
2. **RAG pipeline**:
   - Extract filters (price, duration, audience) from message
   - Generate query embedding via OpenAI
   - Vector similarity search on `ServiceEmbedding`
   - Metadata filtering (price, duration, category, etc.)
   - Return top 5 services
3. **LLM context**: Injected recommended services into system prompt
4. **Streaming**: Vercel AI SDK `streamText` → real-time tokens to UI

## ServiceEmbedding Model

- `embedding`: Vector from `text-embedding-3-small` (1536 dims)
- `content`: Text used for embedding (title, description, highlights, includes, excludes, goodToKnow, duration, category, location, maxParticipants)
- `tags`, `targetAudience`, `physicalLevel`, `bestTimeOfDay`: Inferred metadata for filtering

## API Routes

- `POST /api/chat` – Streaming chat (expects `{ messages: UIMessage[] }`)

## Chat Page

- `/[locale]/chat` – Full-page chat UI (e.g. `/en/chat`)
