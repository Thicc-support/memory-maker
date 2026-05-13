# TaleWeaver — Project Vision & Handoff Document

> A complete handoff for the next developer/team picking up this project.
> Last updated: May 2026

---

## 1. The Vision

**TaleWeaver turns family memories into custom AI-illustrated children's books.**

The core idea: every family has stories worth telling — bedtime tales, grandparents' childhood adventures, the funny thing a toddler said last week, the values a parent wants to pass down. Most of those stories live in people's heads and disappear with them. TaleWeaver captures them, dresses them up as beautifully illustrated children's books, and prints them as keepsakes.

Think of it as the meeting point of:
- **StoryWorth** (interview-driven memory capture for grandparents)
- **Wonderbly / Lost My Name** (personalized children's books)
- **Midjourney / DALL·E** (AI illustration)

…but specifically aimed at **families who want to preserve memories AND give meaningful gifts** rather than just buy a generic personalized book off a shelf.

### The emotional promise
A user comes in with a vague memory ("my grandma used to tell me about her farm in Mexico") and walks out, an hour later, with a 20-page hardcover book in their cart that captures that exact story with custom illustrations of the actual person. The book arrives in the mail. They give it to their kid, their parent, or save it for themselves. It becomes a keepsake — not a toy.

### Who it's for
- **Parents** making bedtime stories starring their own kids
- **Grandchildren** preserving grandparents' life stories before they're lost
- **Aunts/uncles/godparents** giving birthday gifts that mean something
- **Couples / families** documenting shared memories as anniversary or holiday gifts
- **Schools / therapists / hospitals** (long-term — books to help kids process big emotions)

---

## 2. The User Experience (How It Works Today)

1. **Land on the home page.** Warm, storybook-feel design. Cream backgrounds, deep ink text, hand-drawn vibe. Clear value prop, sample books, pricing teaser.
2. **Sign up / log in** (email + password, session-based).
3. **Click "Create".** A guided **AI chat interview** begins. The AI asks:
   - Who is this book being given to? (child, parent, grandparent, partner, friend, etc.)
   - Who is the main character?
   - What theme? (adventure, bedtime, life lesson, family memory, holiday)
   - Format and tone (rhyming, narrative, comic-style)
   - How long?
   - The recipient's age (so reading level is right)
   - Photos to inspire the character (optional upload, up to 5)
   - The actual story content — the AI asks follow-up questions to draw it out
4. **The AI generates a draft book**: full story split into pages, plus a custom illustration for every page.
5. **The user previews the book** in a flippable digital reader. They can:
   - Edit page text inline
   - Regenerate any illustration they don't love
   - See the whole thing as the recipient will
6. **They order it** in their preferred format:
   - **Digital** PDF — $9.99
   - **Softcover** print — $24.99
   - **Hardcover** print — $34.99
7. **Stripe Checkout** handles payment. They get an order confirmation page.
8. **The book ships** (printing/fulfillment partner — see roadmap; Lulu xPress is the planned integration).

### Subscriptions (already wired up in code)
- **Free** — try the chat, see a sample, no checkout
- **Storyteller — $14.99/mo** — 1 book/mo + 20% off extra books
- **Family Bundle — $29.99/mo** — 3 books/mo + 30% off extras

### The "AI Memory" magic
This is the differentiator. TaleWeaver remembers each character across books. If you've made 3 books about your daughter Mia, the AI knows her personality, looks, favorite themes, and the plots of her past adventures. Book #4 references those past adventures, shows growth, and never repeats a plot. Stored in `story_profiles` and `customer_insights` tables — automatically updated as users create and order books.

---

## 3. What's Built (As of Today)

### ✅ Fully working
- Full React + Express + PostgreSQL app, monorepo, deployable on Replit
- Email/password auth (Passport.js, scrypt-hashed passwords, Postgres-backed sessions)
- Guided AI chat interview (OpenAI-powered, custom flow with branching by recipient type)
- Photo upload (up to 5, multipart, stored in `uploads` table)
- AI story generation (page-by-page narrative, age-appropriate)
- AI illustration generation (per-page, regenerable)
- Digital book preview (page-flip UI, inline text editing, single-page regenerate)
- Drafts system (auto-save chat progress so users can leave and come back)
- Story Profiles + Customer Insights (the AI memory system, auto-tracking preferences across books)
- **Stripe Checkout** for one-time book orders (Digital/Softcover/Hardcover)
- **Stripe Subscriptions** for Storyteller and Family Bundle tiers
- **Stripe Billing Portal** so users can manage their subscriptions
- **Stripe Webhook** (signature-verified, fail-closed, idempotent) that marks orders paid and syncs subscription state
- **Pricing page** with all tiers and a "Manage Billing" button for subscribers
- **Legal pages** — `/terms`, `/privacy`, `/refund` (COPPA-aware, AI disclaimers, 30-day defective-only refund policy for physical books)
- **Footer** sitewide with legal links and `support@taleweaver.com`
- Profile page (orders, drafts, favorites, story profiles)
- Order success page

### 🔧 Wired but needs the user to do something
- Stripe is fully coded; user needs to add three secrets in Replit: `STRIPE_SECRET_KEY`, `STRIPE_PUBLISHABLE_KEY`, `STRIPE_WEBHOOK_SECRET`. After that, payments are live.

---

## 4. What's Left to Finish (The Roadmap)

### 🚧 Critical for launch (blocking real revenue)
1. **Print fulfillment integration** — Lulu xPress API is the planned vendor. When a softcover/hardcover order is paid, the system needs to:
   - Send the generated book PDF to Lulu
   - Submit the customer's shipping address
   - Pull tracking info back into the order
   - Email the customer when it ships
   - This was deferred at the user's request and is the #1 next priority.
2. **Shipping address collection** — Stripe Checkout can collect this; the schema has `shippingAddress` JSONB on orders. Needs to be enabled in the Checkout session config and synced from the webhook.
3. **Transactional emails** — order confirmation, shipping notification, password reset. Recommend Resend or Postmark.
4. **Real domain + email** — `taleweaver.com` (or chosen final name), `support@` and `noreply@` mailboxes set up.
5. **Production deploy on Replit** — `suggest_deploy` is ready; just hasn't been pressed.

### 🎯 High-impact polish
6. **Replace the Testimonials component** with real reviews once they exist (the fake "10,000+ families" line was already removed from the Hero, but `Testimonials.tsx` may still have placeholder reviews — vet before launch).
7. **Sample books on the home page** — show 3–5 fully-rendered example books users can flip through. Hugely increases conversion.
8. **Onboarding tour** for first-time users explaining the chat flow.
9. **Better photo handling** — face-consistent illustrations across pages (currently each page is generated independently, so the "main character" can look slightly different page to page). This is a known limitation of single-shot image generation; solutions include using LoRA fine-tuning, IP-Adapter, or a service like Astria/PhotoAI.
10. **Print preview** showing exact trim, bleed, and how the book will look physically before they pay.

### 💡 Future / nice-to-have
- Audiobook version (text-to-speech narration in the user's own voice — ElevenLabs)
- Video version of the story (animated pages)
- Gift wrapping option for physical books
- Multi-language (start with Spanish — big market for Latino grandparent stories)
- "Ghostwriter" mode — user uploads a recorded audio of grandma telling a story, AI transcribes and turns it into a book
- Family library — multiple family members contribute to one shared collection
- School / nonprofit licensing tier
- Mobile app (React Native or Expo) once web traction is proven
- Affiliate / gift card program

---

## 5. Pricing & Business Model Summary

| Plan | Price | What you get |
|---|---|---|
| **Free** | $0 | Try the chat, view samples, no checkout |
| **Storyteller** | $14.99/mo | 1 book/mo + 20% off extra books |
| **Family Bundle** | $29.99/mo | 3 books/mo + 30% off extra books |
| **Digital book** | $9.99 | PDF download |
| **Softcover** | $24.99 | Printed and shipped |
| **Hardcover** | $34.99 | Premium printed and shipped |

**Refund policy:** 30 days, defective physical books only. Digital purchases non-refundable (since they're AI-generated to your spec). Subscriptions cancellable any time, no refund for partial months.

**Margins (rough estimates, validate before launch):**
- Digital: ~95% margin (only AI generation cost ~$0.30–$0.80)
- Softcover via Lulu: ~$10–14 cost → ~40–55% margin at $24.99
- Hardcover via Lulu: ~$18–22 cost → ~35–45% margin at $34.99

---

## 6. Technical Snapshot for the Next Developer

### Stack
- **Frontend**: React + TypeScript + Vite, Wouter routing, TanStack Query, Tailwind v4, shadcn/ui (Radix), Framer Motion. Fonts: DM Sans + Fraunces.
- **Backend**: Node + Express 5 (TypeScript via tsx), Passport local auth, Postgres-backed sessions
- **DB**: PostgreSQL via Drizzle ORM. Schema in `shared/schema.ts`. Migrations via `npm run db:push`.
- **AI**: OpenAI (`server/ai.ts`) for both story text and illustrations
- **Payments**: Stripe (`server/stripe.ts`) — Checkout, Subscriptions, Billing Portal, Webhook
- **Hosting**: Replit (dev + prod). Single `package.json`, single deploy.

### Repo layout
```
client/      React frontend (pages/, components/, lib/)
server/      Express API (routes.ts, stripe.ts, ai.ts, storage.ts, auth.ts)
shared/      Drizzle schema + Zod validators (used by both sides)
migrations/  Drizzle migrations
script/      Build scripts (Vite + esbuild bundling)
```

### Key files a new dev should read first
1. `replit.md` — high-level architecture and route inventory
2. `shared/schema.ts` — the data model (everything flows from here)
3. `server/routes.ts` — all API endpoints
4. `server/stripe.ts` — payments
5. `server/ai.ts` — AI prompts and generation logic
6. `client/src/components/ChatInterface.tsx` — the guided interview UX
7. `client/src/pages/Create.tsx` — orchestrates draft → book creation

### Required environment variables
- `DATABASE_URL` — Postgres (auto-provided by Replit)
- `SESSION_SECRET` — session cookie secret
- `OPENAI_API_KEY` — for AI generation
- `STRIPE_SECRET_KEY` — payments
- `STRIPE_PUBLISHABLE_KEY` — frontend (currently unused; checkout is server-redirect)
- `STRIPE_WEBHOOK_SECRET` — webhook signing (webhook fails closed without it)
- *(future)* `LULU_CLIENT_KEY` / `LULU_CLIENT_SECRET` — print fulfillment
- *(future)* `RESEND_API_KEY` — transactional email

### Database tables (in `shared/schema.ts`)
`users`, `drafts`, `books`, `orders`, `favorites`, `uploads`, `story_profiles`, `customer_insights`. Users table also has `stripeCustomerId`, `subscriptionId`, `subscriptionStatus`, `subscriptionTier`, `subscriptionPeriodEnd`.

### Build / run
- Dev: `npm run dev`
- DB migrate: `npm run db:push`
- Production build: `npm run build` (Vite + esbuild → `dist/`)
- Production start: `npm start` (`node dist/index.cjs`)

### GitHub
- Repo is connected via Replit's GitHub integration
- Remote name: `gitsafe-backup`
- Branch: `main`
- Push: `git push` from the Shell

---

## 7. Brand & Tone Guidance

- **Name**: TaleWeaver
- **Tagline ideas**: "Your family's stories, beautifully told." / "Custom storybooks for the people you love."
- **Visual feel**: Warm, hand-crafted, storybook. Cream/off-white backgrounds, deep ink text, occasional muted accents (terracotta, sage, dusty blue). NOT slick SaaS purple/blue gradients. NOT cartoony or childish — these are keepsakes for adults to give.
- **Voice**: Warm, sincere, a little literary. Speak to the emotional value, not the tech. Avoid "AI" as a feature in the headline — the AI is the magic behind the curtain, not the product. The product is the *story*.
- **Photography/illustration style**: Loose watercolor + ink line, slightly textured paper background. Avoid 3D Pixar look or generic anime.

---

## 8. Recommended Next 30 Days for the New Developer

**Week 1** — Get the env stood up
- Add Stripe keys, run an end-to-end purchase in Stripe test mode
- Set up Lulu xPress sandbox account and read their API docs
- Deploy to a `.replit.app` URL for staging

**Week 2** — Lulu integration
- Implement `server/lulu.ts`: create print job from book PDF + shipping address on `checkout.session.completed`
- Generate proper print-ready PDFs (with bleed/trim)
- Add shipping address collection in Checkout session

**Week 3** — Email + polish
- Wire Resend/Postmark for order confirmations and shipping notifications
- Replace placeholder testimonials with either real reviews or remove the section
- Add 3 sample books to the home page
- Tighten illustration consistency across pages (research IP-Adapter or character LoRA)

**Week 4** — Launch
- Set up real domain + email
- Switch Stripe to live mode
- Soft launch to friends + family (50 people), gather feedback
- Public launch on Product Hunt + a few parenting subreddits

---

## 9. Things the Original Founder Cares About

- **Quality over speed.** This is a keepsake business; a bad book in someone's hands hurts the brand far more than a slow launch.
- **Family-safe content.** AI must never produce anything inappropriate for a children's book. Strong content filters required.
- **Honest pricing.** No dark patterns, no fake scarcity, no fake "loved by 10,000 families" social proof until it's true.
- **Privacy of family stories.** These are deeply personal. Stored data must be secure, never used to train external models, and exportable/deletable on request.
- **The AI memory feature is the moat.** Competitors can do "personalized children's book" — only TaleWeaver remembers your family across books. Protect and grow this.

---

*This document is the working source of truth for the project's intent. Update it as the vision evolves.*
