# PackMate

Telegram Mini App for creating and managing travel packing lists with AI suggestions and shared progress.

## Stack

- Frontend: React + TypeScript + Tailwind + Zustand + React Query
- Backend: Node.js + Express + TypeScript
- AI: OpenAI API (fallback list when key is missing)

## Run locally

1. Copy `.env.example` to `.env`
2. Install dependencies: `npm install`
3. Start frontend + backend: `npm run dev`

## Current MVP

- Telegram user bootstrap from `window.Telegram.WebApp`
- Create trip form (destination, dates, trip type, people count)
- AI packing list generation endpoint
- Check/uncheck packed items with progress bar
- Weather hint injection into generated list

## Important note

Storage is in-memory for MVP (`backend/models/tripStore.ts`), so data resets on restart.
Next step: replace store with Firestore or MongoDB adapters.
