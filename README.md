# Notes AI

AI-powered note-taking application with rich text editing and intelligent features.

**Production:** https://notes-ai-weld.vercel.app/

## Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Auth:** Clerk
- **Database:** Neon PostgreSQL + Drizzle ORM
- **AI:** OpenAI (GPT-3.5-turbo, DALL-E)
- **Editor:** TipTap
- **Styling:** Tailwind CSS + shadcn/ui
- **Analytics:** Umami (trials team)

## Features

- Rich text note editing with TipTap
- AI text autocomplete (Shift+A)
- AI-generated notebook thumbnails
- Notebook organization
- GitHub image backup

## Prerequisites

### Environment Variables

Copy `.env.example` to `.env.local` and configure:

- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` - Clerk publishable key
- `CLERK_SECRET_KEY` - Clerk secret key
- `DATABASE_URL` - Neon PostgreSQL connection string
- `OPENAI_API_KEY` - OpenAI API key (see below)

### OpenAI API Key

This app requires an OpenAI API key for AI-powered features:
- **Text autocomplete** (Shift+A in editor) - uses GPT-3.5-turbo
- **Notebook thumbnail generation** - uses DALL-E

**Important:** OpenAI deprecated the old `sk-...` key format in 2024. You need a new key starting with `sk-proj-...`.

1. Go to https://platform.openai.com/api-keys
2. Create a new API key
3. Add it to `.env.local` as `OPENAI_API_KEY=sk-proj-...`

## Getting Started

```bash
# Install dependencies
pnpm install

# Run database migrations
pnpm db:push

# Start development server
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser.

## Scripts

- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm start` - Start production server
- `pnpm db:generate` - Generate Drizzle migrations
- `pnpm db:push` - Push schema to database
- `pnpm db:studio` - Open Drizzle Studio

## Deployment

Deployed on Vercel with automatic deployments from main branch.

## Analytics

Tracked with self-hosted Umami under the **trials** team.
