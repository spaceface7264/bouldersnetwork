# Context-Aware Campaign Landing Page Generator (MVP)

This repository contains a Next.js SaaS starter that enables marketers to create, edit, and publish branded landing pages without touching code. Campaigns are stored in Postgres via Prisma, rendered using a schema-driven section library, and captured leads are persisted with optional webhook delivery.

## Features

- **Next.js App Router** with server actions and incremental static regeneration (landing pages revalidate every 60 seconds).
- **Prisma models** for `Workspace`, `Page`, `FormSubmission`, and `User` (via NextAuth adapter).
- **Schema-driven renderer** supporting hero, benefits, locations, FAQ, form, and footer sections with design tokens.
- **Admin dashboard** for quick edits, JSON schema editing, preview links, and draft/publish workflow.
- **Lead capture**: submissions stored in the database and optionally forwarded to workspace webhooks.
- **AI SEO assistant** endpoint for generating title/description/keywords using OpenAI.
- **Google authentication** powered by NextAuth.
- **Design tokens** defined in `app/globals.css` for consistent colors, spacing, and typography.

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```
2. Configure environment variables:
   ```bash
   cp .env.example .env
   ```
   Update `DATABASE_URL` for your Postgres instance (Neon/Supabase recommended) and set Google + OpenAI credentials.
3. Apply database migrations and seed example content:
   ```bash
   npx prisma migrate dev
   npx prisma db seed
   ```
   The seed creates an `acme-co` workspace with a published sample campaign.
4. Start the development server:
   ```bash
   npm run dev
   ```
   Visit http://localhost:3000 to explore the marketing homepage and `/admin` (after Google sign-in) for campaign management.

## Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the Next.js dev server |
| `npm run build` | Create an optimized production build |
| `npm run start` | Run the production server |
| `npm run lint` | Run ESLint |
| `npm run prisma:generate` | Generate Prisma client |
| `npm run prisma:migrate` | Run Prisma migrations in development |
| `npm run prisma:deploy` | Deploy Prisma migrations in production |

## Testing

Automated test coverage is limited to static analysis at this stage of the MVP. Run ESLint locally (or in CI) to ensure code quality:

```bash
npm test
```

The command is an alias for `npm run lint` and will exit with a non-zero status if any lint errors are detected.

## Architecture

- `app/` – App Router routes including `/p/[slug]` for published landing pages, `/admin` for the dashboard, `/api` for serverless endpoints, and `/signin` for auth.
- `components/` – Admin experience (quick edit, JSON editor) and section renderer.
- `lib/` – Prisma client, schema typing, server actions, and auth configuration.
- `prisma/schema.prisma` – Database schema with relations between workspaces, pages, users, and form submissions.

## Form Submission Flow

1. `SectionRenderer` renders dynamic forms defined in the page schema.
2. Submitting the form calls the `SubmitLeadForm` server action to persist data.
3. Workspaces may define a `webhookUrl`; submissions will be POSTed asynchronously.
4. Admin dashboards surface recent submissions for marketers.

## AI SEO Endpoint

`POST /api/seo` accepts `{ brand, offer, audience?, tone? }` and returns a JSON payload with suggested title, description, and keywords. An OpenAI API key is required.

## Deployment Notes

- **Hosting**: Designed for Vercel. Set environment variables in the project dashboard and configure Prisma migrations via Neon/Supabase.
- **Revalidation**: Published landing pages revalidate automatically within 60 seconds. Admin actions trigger `revalidatePath` for instant updates.
- **Authentication**: Only Google OAuth is enabled. Invite-only access can be managed via workspace membership records.

## Operational Runbook

See [`docs/campaign-guide.md`](docs/campaign-guide.md) for a marketer-friendly walkthrough on creating and publishing a campaign in under 10 minutes.
