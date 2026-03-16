# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
# Setup (first time)
npm run setup           # install deps + prisma generate + migrate

# Development
npm run dev             # Start dev server with Turbopack at localhost:3000
npm run dev:daemon      # Run dev server in background (logs to logs.txt)

# Testing
npm run test            # Run Vitest

# Code quality
npm run lint            # Run ESLint

# Production
npm run build
npm run start

# Database
npm run db:reset        # Wipe and recreate the SQLite database
```

To run a single test file: `npx vitest run src/path/to/__tests__/file.test.tsx`

## Environment

Copy `.env` and set `ANTHROPIC_API_KEY` for real Claude responses. Without it, the app falls back to a mock language model with static responses. `JWT_SECRET` defaults to `"development-secret-key"` if unset.

The `NODE_OPTIONS='--require ./node-compat.cjs'` prefix in dev/build scripts patches a Node.js 25+ incompatibility with Web Storage APIs used in SSR.

## Architecture

UIGen is a Next.js 15 App Router app where users describe React components in chat and watch them generated live by Claude AI.

### Request flow

1. User types in `ChatInterface` → sent to `POST /api/chat`
2. `src/app/api/chat/route.ts` calls `streamText()` (Vercel AI SDK) with the Claude model from `src/lib/provider.ts`
3. Claude uses two tools: `str_replace_editor` (edit files) and `file_manager` (create/delete files/dirs)
4. Tool calls update the **virtual file system** (in-memory, never written to disk)
5. Changes stream back to the client, updating `FileTree`, `CodeEditor`, and `PreviewFrame` in real time
6. If the user is authenticated, the project (messages + file system snapshot) is persisted to SQLite via Prisma

### Virtual file system

`src/lib/file-system.ts` — `VirtualFileSystem` class stores an in-memory tree. The file system state is managed globally via `src/lib/contexts/file-system-context.tsx`. Files live in memory only; the serialized JSON is stored in the `Project.data` column for persistence.

### State management

- `src/lib/contexts/file-system-context.tsx` — file tree state + operations
- `src/lib/contexts/chat-context.tsx` — chat state using Vercel AI SDK's `useChat` hook

### Authentication

Server actions in `src/actions/index.ts` handle sign-up/in/out. Passwords are bcrypt-hashed; sessions use JWT (jose) stored in HTTP-only cookies with a 7-day expiration. `src/middleware.ts` protects `/api/projects` and `/api/filesystem` routes. Anonymous users can use the app; their in-progress work is flagged in localStorage via `anon-work-tracker.ts`.

### AI system prompt

`src/lib/prompts/generation.tsx` defines the generation rules given to Claude:
- Entrypoint is always `/App.jsx`
- Style with Tailwind CSS
- Use `@/` import alias for custom files
- Responses should be brief

### Database schema

Prisma + SQLite (`prisma/dev.db`). Two models:
- `User` — email/password auth
- `Project` — belongs to User (nullable for anonymous); stores `messages` and `data` (serialized `VirtualFileSystem`) as JSON strings

### UI layout

`src/app/main-content.tsx` — three resizable panels side by side: chat (`components/chat/`), Monaco code editor (`components/editor/`), and live preview (`components/preview/PreviewFrame.tsx`).

### Key path aliases

`@/*` → `src/*` (configured in `tsconfig.json` and `components.json`)
