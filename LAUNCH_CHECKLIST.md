# TaleWeaver Launch Checklist

## Product position
TaleWeaver sells story-first family keepsake books: real people, real memories, careers, service, trips, pets, and family adventures turned into child-friendly illustrated books. Photos are optional supporting references, not the whole product.

## Ready in code
- Landing page explains the story-first keepsake offer.
- Homepage shows concrete book ideas: Dad's career, Grandpa's military service, Aunt Judy's Europe adventure, family trips, legacy stories.
- Creation flow asks for title choice, cover direction, story category, helpful photo uploads, age/page length, and illustration style.
- Pricing is aligned across customer-facing pages and checkout:
  - Digital Keepsake: $19.99
  - Softcover Keepsake: $39.99
  - Hardcover Keepsake: $59.99
- Stripe checkout route creates payment sessions for digital/softcover/hardcover.
- Stripe success page verifies the checkout session and marks the order paid even if the webhook is delayed.
- Stripe shipping details are saved onto print orders when available.
- Printed orders say manual review before print fulfillment.

## Required Replit Secrets before taking real customers
Do not paste secret values into chat. Add them in Replit Secrets.

Required:
- `DATABASE_URL`
- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`
- `AI_INTEGRATIONS_OPENAI_API_KEY`
- `AI_INTEGRATIONS_OPENAI_BASE_URL` if using a non-default OpenAI-compatible endpoint

Optional / depending on provider choices:
- `STORY_PROVIDER` (`openai` or `anthropic`)
- `ANTHROPIC_API_KEY` if `STORY_PROVIDER=anthropic`
- `IMAGE_PROVIDER` (`openai` or `gemini`)
- `GEMINI_API_KEY` if `IMAGE_PROVIDER=gemini`

Later print fulfillment:
- `LULU_CLIENT_KEY`
- `LULU_CLIENT_SECRET`
- `LULU_API_BASE_URL=https://api.sandbox.lulu.com`

## Stripe setup needed
- Use test mode first.
- Add webhook endpoint: `/api/webhooks/stripe`.
- Listen for `checkout.session.completed`.
- Put the webhook signing secret into `STRIPE_WEBHOOK_SECRET`.
- Run one test purchase for each product type: digital, softcover, hardcover.

## Before public launch
- Confirm database migrations are pushed with `npm run db:push`.
- Confirm story generation works with real AI keys.
- Confirm image generation works with real AI keys.
- Confirm Stripe checkout redirects successfully.
- Confirm the success page shows order status as `paid`.
- Confirm print orders keep shipping address.
- Keep Lulu/manual print fulfillment in sandbox until PDF generation and manual review are tested.

## Recommended first sellable offer
Sell digital first while print fulfillment is guarded:

"Create a personalized digital storybook keepsake for $19.99. Turn Dad's career, Grandpa's service, Aunt Judy's trip, or your family adventure into a magical book children can read and remember."
