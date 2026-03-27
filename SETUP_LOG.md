# HWCopilot Setup Log

## 2026-03-27 — Initial Build

### Project Initialization
- Created Next.js 16.2.1 project with App Router, TypeScript, Tailwind CSS
- Installed core dependencies: @supabase/supabase-js, @supabase/ssr, @anthropic-ai/sdk, stripe, zod, react-hook-form, lucide-react, class-variance-authority, clsx, tailwind-merge
- Installed Radix UI components: dialog, dropdown-menu, label, progress, select, separator, slot, tabs, toast, checkbox, avatar, popover

### Architecture Decisions
- Used Next.js 16 proxy.ts (renamed from middleware.ts) for auth route protection
- Server Components for all data-fetching pages; Client Components only where interactivity required
- Server Actions for mutations (signup, onboarding, child management, billing)
- API Routes for AI generation and Stripe webhooks (require raw request body access)
- Lazy initialization for Anthropic and Stripe clients to avoid build-time failures

### Phase 1: Foundation
- [x] Project setup with proper TypeScript config
- [x] Tailwind CSS with warm orange/amber color palette
- [x] Supabase browser + server clients with SSR cookie handling
- [x] Route protection proxy (proxy.ts)
- [x] .env.example with all required variables

### Phase 2: Authentication
- [x] Email/password signup with Supabase Auth
- [x] Email/password login with redirect to dashboard or onboarding
- [x] Password reset flow (send email + update password)
- [x] Auth callback route for Supabase redirect flow
- [x] Protected route proxy redirecting unauthenticated users to /login

### Phase 3: Onboarding
- [x] 3-step onboarding flow (name → child info → confirmation)
- [x] Progress indicator
- [x] Grade-filtered subject selection with checkboxes
- [x] Interests and learning notes fields
- [x] Creates profile + first child record on completion

### Phase 4: Dashboard
- [x] Welcome message with parent first name
- [x] Worksheet usage progress bar (used/limit with reset date)
- [x] Upgrade prompt at 4/5 free worksheets
- [x] Pro limit message with reset date
- [x] Child cards with grade badges and quick worksheet creation
- [x] Recent worksheets list
- [x] Responsive navigation with mobile menu

### Phase 5: Child Profile Management
- [x] Children page with grid of child cards
- [x] Add child dialog (modal form with grade-filtered subjects)
- [x] Edit child dialog
- [x] Soft-delete (set active=false) with confirmation
- [x] Pro gate for adding 2+ children

### Phase 6: Worksheet Generator
- [x] Generator form with child/subject/topic/difficulty/question count fields
- [x] Dynamic topic filtering based on grade + subject
- [x] Pre-selects child from URL query param (?child=uuid)
- [x] AI generation via Anthropic claude-sonnet-4-20250514
- [x] JSON-structured prompt with child interests woven in
- [x] Worksheet display with Learn It / Worked Example / Problems / Challenge sections
- [x] Grade-appropriate font sizes (K-2: larger, 3-5: standard, 6-8: denser)
- [x] Answer key toggle
- [x] Print-optimized CSS (hides nav, sets paper-friendly styles)
- [x] Monthly usage tracking + limit enforcement
- [x] Automatic monthly counter reset when month changes
- [x] Rate limiting (10 AI calls/minute per user, in-memory)

### Phase 7: Homework Help
- [x] Pro-gated with upgrade prompt for free users
- [x] Child selector for grade-appropriate explanations
- [x] "Explain it simply" toggle
- [x] Structured AI response format (What This Is About / Steps / Answer / Tips)
- [x] Response rendering with bold headers
- [x] Session history with click-to-reload
- [x] Saved to homework_help_sessions table

### Phase 8: Stripe Integration
- [x] createCheckoutSession server action → Stripe Checkout redirect
- [x] createPortalSession server action → Stripe Customer Portal redirect
- [x] Webhook endpoint at /api/webhooks/stripe with signature verification
- [x] Handles checkout.session.completed → sets profile to pro, stores customer/subscription IDs
- [x] Handles customer.subscription.deleted → reverts to free
- [x] Handles customer.subscription.updated → syncs status for failed payments
- [x] All events logged to stripe_events table
- [x] Billing page with usage bar, plan display, upgrade/manage buttons
- [x] Success/canceled query param feedback messages

### Phase 9: Landing Page
- [x] Full marketing homepage with hero, how-it-works, features, pricing, FAQ, CTA, footer
- [x] Warm orange color palette
- [x] Mobile responsive
- [x] Sticky navigation with sign in/get started CTAs

### Phase 10: Database
- [x] Complete migration SQL with all 5 tables
- [x] RLS policies (users can only read/write their own data)
- [x] Indexes for performance
- [x] updated_at trigger on profiles table
- [x] Service role bypass for Stripe webhook

### Documentation
- [x] README.md with architecture overview, setup guide, deployment instructions
- [x] MANUAL_SETUP.md with step-by-step non-engineer instructions
- [x] .env.example with all environment variables

### Build Status
- TypeScript: passing (no errors)
- Next.js build: passing (18 routes, clean)
- No deprecated patterns (using proxy.ts, not middleware.ts)

---

## Pending (needs credentials)

- Supabase project creation and schema run
- Stripe product/price creation
- Anthropic API key setup
- Vercel deployment
- Stripe webhook configuration after deployment
