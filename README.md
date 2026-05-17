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

## Telegram Mini App (подключение к боту)

1. Задеплойте актуальный код на **Vercel** (`git push` в `main`). Скопируйте **Production** URL вида `https://travel-pack-….vercel.app` (страница проекта → **Visit** / **Domains**).
2. В **Vercel → Project → Settings → Environment Variables** добавьте **`OPENAI_API_KEY`**, если нужны реальные ответы от ИИ (как в локальном `.env`). Сохраните и сделайте **Redeploy** последнего деплоя.
3. В Telegram откройте **@BotFather** → **`/mybots`** → выберите своего бота → **Bot Settings** → **Menu Button** → **Configure menu button** → укажите текст кнопки (например `Открыть PackMate`) → выберите тип **Web App** → вставьте **тот же HTTPS URL** с Vercel (без слэша в конце).
4. Откройте бота в Telegram и нажмите **кнопку меню** (слева от поля ввода) — откроется приложение внутри Telegram. ID пользователя берётся из `Telegram.WebApp.initDataUnsafe.user.id`.

Если Telegram ругается на домен, в BotFather для бота проверьте настройки **Domain** / **Mini App** (нужен домен вашего URL, например `travel-pack-xxx.vercel.app`).

## Deploy (Vercel)

Фронт: `npm run build`. API Express доступен как serverless `api/index.ts` (пути `/api/...`, `/health`). В продакшене запросы идут на **тот же хост**, отдельно `VITE_API_BASE_URL` не обязателен.

## Important note

Storage is in-memory for MVP (`backend/models/tripStore.ts`), so data resets on restart.
Next step: replace store with Firestore or MongoDB adapters.

**Serverless:** на Vercel память между вызовами не гарантирована — для стабильного продакшена нужна внешняя БД.
