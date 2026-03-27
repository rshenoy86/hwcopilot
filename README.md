# HWCopilot — Personalized Homework Worksheets for K-8

HWCopilot is a consumer SaaS product that helps parents generate curriculum-aligned, personalized homework worksheets for their K-8 children using AI.

## Architecture Overview

HWCopilot is a **Next.js 16 App Router** application with a clear separation between server and client code. Server Components handle data fetching directly from Supabase; Client Components handle interactivity. Server Actions handle form submissions and mutations. API Routes handle AI generation and Stripe webhooks.

```
┌─────────────────────────────────────────────────────────┐
│  Browser (React Client Components)                        │
│  - Worksheet generator form, homework help chat          │
│  - Navigation, modals, interactive UI                    │
└──────────────────────┬──────────────────────────────────┘
                       │ fetch / Server Actions
┌──────────────────────▼──────────────────────────────────┐
│  Next.js App Router (Server Components + API Routes)      │
│  - Dashboard, children, worksheets (data fetching)       │
│  - /api/worksheets/generate (AI generation)              │
│  - /api/homework-help (AI tutoring)                      │
│  - /api/webhooks/stripe (payment events)                 │
└──────┬──────────────────────────┬───────────────────────┘
       │                          │
┌──────▼──────┐           ┌───────▼──────────┐
│  Supabase   │           │  External APIs   │
│  - Auth     │           │  - Anthropic     │
│  - Postgres │           │  - Stripe        │
│  - RLS      │           └──────────────────┘
└─────────────┘
```

## Tech Stack

- **Frontend**: Next.js 16 + TypeScript + Tailwind CSS + Radix UI components
- **Backend**: Next.js App Router (Server Components + Server Actions + API Routes)
- **Database**: Supabase (PostgreSQL with Row Level Security)
- **Auth**: Supabase Auth (email/password)
- **AI**: Anthropic Claude (claude-sonnet-4-20250514)
- **Payments**: Stripe Checkout + Customer Portal
- **Deployment**: Vercel

---

## Local Development Setup

### Prerequisites

You'll need Node.js 18+ installed. Download it from [nodejs.org](https://nodejs.org).

### 1. Clone the repository

```bash
git clone <your-repo-url>
cd hwcopilot
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

```bash
cp .env.example .env.local
```

Open `.env.local` and fill in all values. See **MANUAL_SETUP.md** for step-by-step instructions on getting each value.

### 4. Set up the database

Run the SQL in `supabase/migration.sql` against your Supabase project. See MANUAL_SETUP.md for instructions.

### 5. Start the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Environment Variables

See `.env.example` for all required variables. Each one is described in **MANUAL_SETUP.md**.

---

## Supabase Setup

1. Create a Supabase project at [supabase.com](https://supabase.com)
2. Go to SQL Editor > New Query
3. Copy/paste the contents of `supabase/migration.sql` and click Run
4. Configure Auth redirect URLs (see MANUAL_SETUP.md)

The schema creates 5 tables:
- `profiles` — one per user, tracks subscription status and worksheet usage
- `children` — child profiles (name, grade, subjects, interests)
- `worksheets` — generated worksheets with content and answer keys
- `homework_help_sessions` — saved AI tutoring conversations
- `stripe_events` — webhook event log for debugging

All tables have Row Level Security enabled — users can only access their own data.

---

## Stripe Setup

1. Create a Stripe account at [stripe.com](https://stripe.com)
2. Create a product called "HWCopilot Pro" with a $12/month recurring price
3. Copy the Price ID to `STRIPE_PRICE_ID_PRO`
4. After deploying to Vercel, add a webhook endpoint pointing to `/api/webhooks/stripe`
5. Listen for: `checkout.session.completed`, `customer.subscription.deleted`, `customer.subscription.updated`

See MANUAL_SETUP.md for detailed Stripe instructions.

---

## Deployment to Vercel

1. Push to GitHub
2. Go to [vercel.com](https://vercel.com) > New Project > Import your repo
3. Add all environment variables (same as `.env.local`)
4. Deploy

After deploying:
- Update `NEXT_PUBLIC_APP_URL` to your Vercel URL
- Update Supabase auth redirect URLs to include your Vercel domain
- Create the Stripe webhook endpoint pointing to your Vercel URL

---

## Known Limitations

1. **PDF download not implemented** — Print via browser (Ctrl+P / Cmd+P). Works well; PDF generation can be added later.
2. **Email notifications not implemented** — No welcome emails or usage alerts. V2 feature.
3. **No admin panel** — Use Supabase dashboard directly to view/modify data.
4. **OAuth login not supported** — Email/password only.
5. **US curriculum only** — Topics are hardcoded to US Common Core standards.
6. **No worksheet search/filter** — Worksheets list is chronological only.

---

## Next 10 Features to Build

1. PDF download (server-side with `@react-pdf/renderer`)
2. Google/Apple OAuth login
3. Email notifications (welcome email, monthly usage summary)
4. Worksheet sharing via link
5. Teacher/tutor tier with higher volume
6. Progress tracking across worksheets
7. Worksheet favorites / regeneration
8. Admin dashboard
9. Custom curriculum upload (paste textbook content)
10. Mobile app

---

## Project Structure

```
hwcopilot/
├── app/
│   ├── (auth)/           # Login, signup, reset password
│   ├── (dashboard)/      # Protected dashboard pages
│   ├── actions/          # Server Actions
│   ├── api/              # API Routes (AI, Stripe webhook)
│   ├── auth/             # Supabase auth callback
│   └── onboarding/       # First-time user flow
├── components/
│   ├── ui/               # Base UI components
│   ├── dashboard/        # Dashboard components
│   └── worksheets/       # Worksheet components
├── lib/
│   ├── ai/               # Anthropic API integration
│   ├── supabase/         # Supabase clients
│   ├── curriculum.ts     # Subject/topic map
│   ├── stripe.ts         # Stripe client
│   └── utils.ts          # Utilities
├── supabase/
│   └── migration.sql     # Schema + RLS policies
└── types/index.ts        # TypeScript types
```
