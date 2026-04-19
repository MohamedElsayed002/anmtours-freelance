# AI Chatbot Implementation Guide

A comprehensive guide to the personalized travel assistant chatbot built for A&M Tours.

---

## Table of Contents

1. [Overview](#overview)
2. [Architecture](#architecture)
3. [How It Works](#how-it-works)
4. [Personalization for A&M Tours](#personalization-for-amt-tours)
5. [Technical Implementation](#technical-implementation)
6. [Configuration](#configuration)
7. [File Structure](#file-structure)

---

## Overview

The chatbot is a **Retrieval Augmented Generation (RAG)** powered travel assistant that helps visitors discover experiences in Sharm El Sheikh. It appears as a floating widget at the bottom-right of every page and provides:

- **Personalized recommendations** based on user preferences (romantic, family, budget, duration, etc.)
- **Real-time streaming responses** for a smooth conversational experience
- **Clickable service links** that open the recommended tours
- **Anti-hallucination safeguards** so the chatbot only uses your actual data

---

## Architecture

```
┌─────────────────┐     ┌──────────────────┐     ┌─────────────────────┐
│   User Message  │────▶│   Chat API       │────▶│   RAG Pipeline      │
│   (Floating UI) │     │   /api/chat      │     │   - Embedding       │
└─────────────────┘     └────────┬─────────┘     │   - Vector Search   │
                                 │               │   - Metadata Filter │
                                 │               └──────────┬──────────┘
                                 │                          │
                                 │               ┌──────────▼──────────┐
                                 │               │   Top 5 Services     │
                                 │               │   (from your DB)     │
                                 │               └──────────┬──────────┘
                                 │                          │
                                 │               ┌──────────▼──────────┐
                                 ▼               │   LLM (GPT-4o-mini)  │
                        ┌──────────────────┐    │   + System Prompt     │
                        │   Stream Response │◀───│   + Company Info     │
                        │   to User         │    │   + FAQ Data         │
                        └──────────────────┘    └──────────────────────┘
```

---

## How It Works

### 1. User Sends a Message

The user types or clicks a suggested question (e.g., "I want something romantic", "Who is A&M Tours?").

### 2. RAG Pipeline (Retrieval)

1. **Query Embedding**: The user's message is converted to a vector using OpenAI's `text-embedding-3-small` model.
2. **Vector Search**: The vector is compared against all service embeddings in `ServiceEmbedding` using cosine similarity.
3. **Metadata Filtering**: Results are filtered by:
   - Price (e.g., "cheap" → max $50)
   - Duration (e.g., "half day", "full day")
   - Category (adventure, cultural, relaxing)
   - Target audience (couples, families, kids, groups)
4. **Top 5 Services**: The most relevant services are selected and passed to the LLM.

### 3. LLM Response (Generation)

The LLM receives:

- **Company information** (from `chat-faq.ts`) — name, description, contact, etc.
- **FAQ answers** (from `chat-faq.ts`) — "Who am I?", "Who is A&M Tours?", etc.
- **Recommended services** (from RAG) — titles, prices, highlights, includes, excludes
- **Strict instructions** — only use provided data, never invent information

The LLM generates a natural, helpful response and includes **clickable markdown links** to the recommended services.

### 4. Streaming to UI

The response is streamed token-by-token using the Vercel AI SDK. The UI renders markdown so links appear as clickable buttons that open in a new tab.

---

## Personalization for A&M Tours

### Company-Specific Data

All company information lives in **`src/config/chat-faq.ts`**:

| Data                  | Purpose                                                  |
| --------------------- | -------------------------------------------------------- |
| **Company name**      | A&M Tours                                                |
| **Tagline**           | Your trusted travel partner in Sharm El Sheikh           |
| **Description**       | Premium travel agency, safaris, diving, snorkeling, etc. |
| **Contact**           | Email, phone, location                                   |
| **Founded, services** | For "Who is A&M Tours?" type questions                   |

**You can edit this file** to update any company info. The chatbot will never make up data—it only uses what you provide here.

### Frequent Questions (FAQ)

Pre-defined Q&A pairs ensure consistent answers:

- **"Who am I?"** — Explains the user is chatting with the A&M Tours Travel Assistant.
- **"Who is A&M Tours?"** — Company overview and contact details.
- **"What does A&M Tours offer?"** — Services summary.
- **"How can I contact A&M Tours?"** — Contact info.

Add or edit FAQ entries in `chat-faq.ts` to control these answers.

### Service Embeddings

Each tour/experience in your database has an embedding stored in `ServiceEmbedding`:

- **Embedding content** is built from: title, description, highlights, includes, excludes, goodToKnow, duration, category, location, maxParticipants.
- **Metadata** (tags, targetAudience, physicalLevel, bestTimeOfDay) is inferred for filtering.
- **Automatic sync**: When you add, update, or delete a service in the admin dashboard, the embedding is created, updated, or removed automatically.

### Suggested Questions

The chatbot suggests questions tailored to your offerings:

- "I want something romantic"
- "We are 4 people with kids"
- "Cheap water activity"
- "We only have one free day"
- "Something relaxing?"
- "Who am I?"
- "Who is A&M Tours?"

### Clickable Links

When the chatbot recommends a service, it includes a link in this format:

```
https://anntours.vercel.app/en/services/camel-walk
```

- **Base URL** comes from `BASE_URL` in `.env` (e.g., `https://anntours.vercel.app`).
- **Locale** is taken from the current page (en, ar, ru, it).
- Links open in a new tab.

---

## Technical Implementation

### Anti-Hallucination

The system prompt includes strict rules:

- **ONLY** use information from the provided context.
- **NEVER** invent services, prices, or contact details.
- If information is missing, direct the user to contact you.

### Streaming

The Vercel AI SDK `streamText` function streams tokens in real-time. The UI uses `useChat` from `@ai-sdk/react` to receive and display the stream as it arrives.

### Vector Search

- **Model**: OpenAI `text-embedding-3-small` (1536 dimensions)
- **Storage**: MongoDB via Prisma (`ServiceEmbedding` model)
- **Similarity**: Cosine similarity (works with any MongoDB; for scale, consider MongoDB Atlas Vector Search)

---

## Configuration

### Environment Variables

| Variable         | Required | Description                                                         |
| ---------------- | -------- | ------------------------------------------------------------------- |
| `OPENAI_API_KEY` | Yes      | OpenAI API key for embeddings and chat                              |
| `DATABASE_URL`   | Yes      | MongoDB connection string                                           |
| `BASE_URL`       | No       | Base URL for service links (default: `https://anntours.vercel.app`) |

### Backfilling Embeddings

For existing services, run:

```bash
npm run generate:embeddings
```

This generates and stores embeddings for all services in the database.

---

## File Structure

```
src/
├── config/
│   └── chat-faq.ts              # Company info & FAQ (EDIT THIS)
├── lib/ai/
│   ├── types.ts                  # Shared types
│   ├── embedding-content.ts      # Builds text for embedding
│   ├── embeddings.ts             # OpenAI embeddings + storage
│   ├── vector-search.ts          # Cosine similarity search
│   ├── recommendation.ts         # RAG pipeline
│   ├── system-prompt.ts          # LLM system prompt
│   └── index.ts
├── app/
│   └── api/chat/
│       └── route.ts              # Streaming chat API
├── components/chat/
│   ├── ChatBotFloating.tsx       # Floating widget (bottom-right)
│   └── ChatBot.tsx              # Full-page chat (optional)
└── prisma/
    └── schema.prisma             # ServiceEmbedding model
```

---

## Summary

The chatbot is personalized for A&M Tours by:

1. **Using your real services** — Recommendations come from your database via RAG.
2. **Using your company data** — All company/FAQ info is in `chat-faq.ts`.
3. **Linking to your site** — Service links use your `BASE_URL` and locale.
4. **Avoiding hallucination** — Strict prompts ensure only your data is used.
5. **Suggesting relevant questions** — Tailored to travel and your brand.

Edit `src/config/chat-faq.ts` to update company info and FAQ answers. The rest of the system will use your changes automatically.
