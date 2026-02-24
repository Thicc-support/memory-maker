# TaleWeaver - Custom AI Family Books

## Overview

TaleWeaver is a full-stack web application that turns family memories into custom AI-illustrated children's books. Users go through a guided chat interface where an AI interviewer asks questions about their stories, memories, and values. The app then generates a personalized narrative with custom illustrations, which can be previewed as a digital book and ordered as a physical printed copy (digital, softcover, or hardcover).

The application follows a monorepo structure with a React frontend, Express backend, and PostgreSQL database.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Directory Structure
- `client/` — React frontend (Vite-based SPA)
- `server/` — Express backend API
- `shared/` — Shared types and database schema (used by both client and server)
- `migrations/` — Drizzle database migrations
- `script/` — Build scripts

### Frontend Architecture
- **Framework**: React with TypeScript, bundled by Vite
- **Routing**: Wouter (lightweight client-side router) with three main pages: Home (`/`), Create (`/create`), Profile (`/profile`)
- **State Management**: TanStack React Query for server state; local React state for UI
- **Styling**: Tailwind CSS v4 (using `@tailwindcss/vite` plugin) with CSS variables for theming. Uses a warm "storybook" color palette with cream backgrounds and deep ink text.
- **UI Components**: shadcn/ui (new-york style) built on Radix UI primitives. Components live in `client/src/components/ui/`.
- **Animations**: Framer Motion for page transitions and interactive elements
- **Fonts**: DM Sans (body) and Fraunces (headings) from Google Fonts
- **Auth**: Custom `useAuth` hook in `client/src/lib/auth.ts` manages session-based authentication with a global listener pattern for state sharing across components

### Backend Architecture
- **Framework**: Express 5 on Node.js with TypeScript (run via `tsx`)
- **API Pattern**: RESTful JSON API under `/api/` prefix. Routes defined in `server/routes.ts`.
- **Authentication**: Passport.js with Local Strategy, session-based auth stored in PostgreSQL via `connect-pg-simple`. Passwords hashed with scrypt.
- **Storage Layer**: `IStorage` interface in `server/storage.ts` with `DatabaseStorage` implementation using Drizzle ORM. This abstraction allows swapping storage backends.
- **Dev Server**: Vite dev server is integrated as middleware during development (`server/vite.ts`). In production, pre-built static files are served from `dist/public` (`server/static.ts`).

### Database
- **Database**: PostgreSQL (required, referenced by `DATABASE_URL` environment variable)
- **ORM**: Drizzle ORM with `drizzle-zod` for schema validation
- **Schema** (`shared/schema.ts`): Three main tables:
  - `users` — id (UUID), email, name, password hash, createdAt
  - `drafts` — id (UUID), userId (FK), title, various story metadata fields (recipient, theme, bookType, etc.), messages (JSONB array for chat history), photos (text array), step, progress, updatedAt
  - `books` — id (UUID), userId (FK), title, theme, style, format, status, pages (JSONB), createdAt
- **Migrations**: Use `drizzle-kit push` (`npm run db:push`) to sync schema to database

### API Routes
- `POST /api/auth/register` — Create account
- `POST /api/auth/login` — Log in
- `POST /api/auth/logout` — Log out
- `GET /api/auth/me` — Get current user
- `GET /api/drafts` — List user's drafts
- `POST /api/drafts` — Create draft
- `PATCH /api/drafts/:id` — Update draft
- `DELETE /api/drafts/:id` — Delete draft
- `GET /api/books` — List user's books
- `POST /api/books` — Create book

All draft/book routes require authentication via `requireAuth` middleware.

### Build System
- **Development**: `npm run dev` starts the Express server with Vite middleware for HMR
- **Production Build**: `npm run build` runs `script/build.ts` which builds the client with Vite and bundles the server with esbuild (output to `dist/`). Key dependencies are bundled to reduce cold start times.
- **Production Start**: `npm start` runs `node dist/index.cjs`

### Key Design Decisions
1. **Shared schema between client and server** — The `shared/` directory contains Drizzle schema and Zod validators used by both sides, ensuring type safety across the stack.
2. **Session-based auth over JWT** — Sessions stored in PostgreSQL for simplicity and security; no token refresh logic needed on the client.
3. **Monorepo with unified build** — Single `package.json` manages both client and server dependencies, simplifying deployment on Replit.
4. **Path aliases** — `@/` maps to `client/src/`, `@shared/` maps to `shared/`, configured in both `tsconfig.json` and `vite.config.ts`.

## External Dependencies

### Required Services
- **PostgreSQL Database** — Required. Connection string must be provided via `DATABASE_URL` environment variable. Used for all data storage and session management.

### Environment Variables
- `DATABASE_URL` — PostgreSQL connection string (required)
- `SESSION_SECRET` — Secret for session encryption (falls back to a dev default)

### Key NPM Dependencies
- **Frontend**: React, Wouter, TanStack React Query, Framer Motion, shadcn/ui (Radix UI), Tailwind CSS, embla-carousel-react, react-day-picker, recharts, vaul (drawer)
- **Backend**: Express 5, Passport.js, passport-local, express-session, connect-pg-simple, Drizzle ORM, pg (node-postgres), zod
- **Build Tools**: Vite, esbuild, tsx, drizzle-kit

### Potential AI Integrations
The build script references `@google/generative-ai` and `openai` packages in its allowlist, suggesting planned or existing AI story/illustration generation features, though the implementation details are not visible in the provided files.