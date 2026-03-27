# Manual Setup Checklist

This file is for you — the person setting up HWCopilot. Every step here requires a real account and some clicking around. Do these in order.

---

## Step 1: Create a Supabase Project

Supabase is the database and login system.

1. Go to [supabase.com](https://supabase.com) and create a free account
2. Click **New Project**
3. Give it a name (e.g. "hwcopilot"), pick a region close to you, set a database password (save this!)
4. Wait ~2 minutes for it to spin up
5. Go to **Settings → API**
6. Copy these three values into your `.env.local` file:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public key** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **service_role secret key** → `SUPABASE_SERVICE_ROLE_KEY` ⚠️ Never share this publicly

### Run the Database Schema

7. In Supabase, go to **SQL Editor** (left sidebar)
8. Click **New query**
9. Open the file `supabase/migration.sql` from this project
10. Copy the entire contents and paste it into the SQL Editor
11. Click **Run**
12. You should see "Success. No rows returned." — that's correct!

### Configure Auth

13. In Supabase, go to **Authentication → URL Configuration**
14. Set **Site URL** to your app URL (e.g. `https://your-app.vercel.app` or `http://localhost:3000` for local dev)
15. Under **Redirect URLs**, add:
    - `http://localhost:3000/auth/callback` (for local dev)
    - `https://your-app.vercel.app/auth/callback` (after you deploy to Vercel)

---

## Step 2: Create an Anthropic Account

This is what powers the AI worksheet generation.

1. Go to [console.anthropic.com](https://console.anthropic.com) and create an account
2. Click **API Keys** in the left sidebar
3. Click **Create Key**, give it a name (e.g. "hwcopilot")
4. Copy the key and save it as `ANTHROPIC_API_KEY` in your `.env.local`

⚠️ Note: You'll need to add a credit card and add credits to use the API. Worksheet generation costs roughly $0.01-0.03 per worksheet.

---

## Step 3: Create a Stripe Account

This handles payments for Pro subscriptions.

1. Go to [stripe.com](https://stripe.com) and create an account
2. Complete any business verification steps

### Get your API Keys

3. In the Stripe Dashboard, click **Developers → API keys**
4. Copy these into your `.env.local`:
   - **Publishable key** → `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
   - **Secret key** → `STRIPE_SECRET_KEY`

### Create the Product and Price

5. Go to **Product catalog → Products**
6. Click **Add product**
7. Set:
   - Name: `HWCopilot Pro`
   - Description: `250 worksheets/month, unlimited children, homework help`
8. Under **Pricing**, add a price:
   - Pricing model: **Recurring**
   - Price: `$12.00`
   - Billing period: **Monthly**
9. Save the product
10. Click on the price you just created and copy the **Price ID** (starts with `price_`)
11. Save it as `STRIPE_PRICE_ID_PRO` in your `.env.local`

### Configure Customer Portal

12. Go to **Settings → Billing → Customer portal**
13. Enable the portal
14. Under "Subscriptions", make sure "Cancel subscriptions" is enabled
15. Set the **Business name** and **Business URL**

### Set Up the Webhook (after Vercel deployment)

This step can only be done after you've deployed to Vercel and have a real URL.

16. Go to **Developers → Webhooks**
17. Click **Add endpoint**
18. Set the URL to: `https://your-vercel-app.vercel.app/api/webhooks/stripe`
19. Under **Events to listen to**, select:
    - `checkout.session.completed`
    - `customer.subscription.deleted`
    - `customer.subscription.updated`
20. Click **Add endpoint**
21. Copy the **Signing secret** (starts with `whsec_`)
22. Save it as `STRIPE_WEBHOOK_SECRET`

For local testing, use the [Stripe CLI](https://stripe.com/docs/stripe-cli):
```bash
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```
The CLI will output a webhook secret starting with `whsec_` — use that as your `STRIPE_WEBHOOK_SECRET` for local dev.

---

## Step 4: Deploy to Vercel

1. Push your code to a GitHub repository
2. Go to [vercel.com](https://vercel.com) and create a free account
3. Click **Add New Project**
4. Import your GitHub repository
5. Under **Environment Variables**, add all the variables from your `.env.local`:
   - `NEXT_PUBLIC_APP_URL` — set to your Vercel URL (e.g. `https://hwcopilot.vercel.app`)
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `ANTHROPIC_API_KEY`
   - `STRIPE_SECRET_KEY`
   - `STRIPE_WEBHOOK_SECRET`
   - `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
   - `STRIPE_PRICE_ID_PRO`
6. Click **Deploy**
7. Wait 2-3 minutes for the first deploy

### After Deploying

8. Go back to Supabase → **Authentication → URL Configuration** and add your Vercel URL to the Redirect URLs list
9. Go back to Stripe → **Webhooks** and add your real Vercel webhook URL (Step 3, item 18)

---

## Step 5: Test Everything

Run through this checklist after deploying:

- [ ] Visit your Vercel URL and see the landing page
- [ ] Click "Sign up" and create a test account
- [ ] Complete the onboarding flow (enter name, add a child)
- [ ] See the dashboard with usage bar
- [ ] Click "Generate Worksheet", fill out the form, and generate a worksheet
- [ ] View the worksheet and click "Print"
- [ ] Click "Show Answer Key" and verify it appears
- [ ] Go to Billing and click "Upgrade to Pro"
- [ ] Complete Stripe Checkout with test card `4242 4242 4242 4242`
- [ ] Return to dashboard and verify "Pro" badge appears
- [ ] Generate 6+ worksheets and verify the 250 limit doesn't trigger (it shouldn't)
- [ ] Go to Billing → "Manage Subscription" and cancel
- [ ] Verify the account reverts to Free

### Stripe Test Cards

Use these during testing:
- **Successful payment**: `4242 4242 4242 4242` (any future expiry, any CVC)
- **Declined payment**: `4000 0000 0000 0002`

---

## Environment Variable Reference

| Variable | Where to find it |
|----------|-----------------|
| `NEXT_PUBLIC_APP_URL` | Your Vercel URL |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase → Settings → API → Project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase → Settings → API → anon/public key |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase → Settings → API → service_role key |
| `ANTHROPIC_API_KEY` | Anthropic Console → API Keys |
| `STRIPE_SECRET_KEY` | Stripe → Developers → API Keys → Secret key |
| `STRIPE_WEBHOOK_SECRET` | Stripe → Developers → Webhooks → Signing secret |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Stripe → Developers → API Keys → Publishable key |
| `STRIPE_PRICE_ID_PRO` | Stripe → Product catalog → Your Pro price → Price ID |

---

## Got stuck?

- **Supabase issues**: Check [supabase.com/docs](https://supabase.com/docs)
- **Stripe issues**: Check [stripe.com/docs](https://stripe.com/docs)
- **Vercel issues**: Check [vercel.com/docs](https://vercel.com/docs)
- **Anthropic issues**: Check [docs.anthropic.com](https://docs.anthropic.com)
