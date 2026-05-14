import Stripe from "stripe";
import type { Express, Request, Response, NextFunction } from "express";
import express from "express";
import { storage } from "./storage";


function routeParam(req: Request, name: string): string {
  const value = req.params[name];
  return Array.isArray(value) ? value[0] ?? "" : value ?? "";
}

const stripeKey = process.env.STRIPE_SECRET_KEY;
export const stripe = stripeKey ? new Stripe(stripeKey) : null;

export const BOOK_PRICES = {
  digital: { amount: 999, name: "Digital PDF" },
  softcover: { amount: 2499, name: "Softcover Book" },
  hardcover: { amount: 3499, name: "Hardcover Book" },
} as const;

export const SUBSCRIPTION_TIERS = {
  storyteller: {
    name: "Storyteller",
    amount: 1499,
    interval: "month" as const,
    description: "1 free book/month + 20% off extras + all digital downloads",
  },
  family: {
    name: "Family Bundle",
    amount: 2999,
    interval: "month" as const,
    description: "3 free books/month + 30% off extras + priority generation + all formats",
  },
} as const;

function requireAuth(req: any, res: any, next: any) {
  if (!req.isAuthenticated || !req.isAuthenticated()) {
    return res.status(401).json({ message: "Not authenticated" });
  }
  next();
}

function requireStripe(_req: Request, res: Response, next: NextFunction) {
  if (!stripe) {
    return res.status(503).json({ message: "Stripe is not configured. Set STRIPE_SECRET_KEY in Secrets." });
  }
  next();
}

async function ensureStripeCustomer(userId: string): Promise<string> {
  const user = await storage.getUser(userId);
  if (!user) throw new Error("User not found");
  if (user.stripeCustomerId) return user.stripeCustomerId;
  const customer = await stripe!.customers.create({
    email: user.email,
    name: user.name,
    metadata: { userId: user.id },
  });
  await storage.updateUser(userId, { stripeCustomerId: customer.id });
  return customer.id;
}

function getOrigin(req: Request): string {
  const proto = (req.headers["x-forwarded-proto"] as string) || req.protocol;
  const host = req.get("host");
  return `${proto}://${host}`;
}

export function registerStripeRoutes(app: Express) {
  // Webhook MUST use raw body, mounted before any json parser would touch it
  app.post(
    "/api/webhooks/stripe",
    express.raw({ type: "application/json" }),
    async (req: Request, res: Response) => {
      if (!stripe) return res.status(503).send("Stripe not configured");
      const sig = req.headers["stripe-signature"] as string | undefined;
      const secret = process.env.STRIPE_WEBHOOK_SECRET;

      // Fail closed: webhooks must be signed.
      if (!secret) {
        console.error("STRIPE_WEBHOOK_SECRET not configured; rejecting webhook.");
        return res.status(503).send("Webhook secret not configured");
      }
      if (!sig) return res.status(400).send("Missing stripe-signature header");

      let event: Stripe.Event;
      try {
        event = stripe.webhooks.constructEvent(req.body, sig, secret);
      } catch (err: any) {
        console.error("Webhook signature verification failed:", err.message);
        return res.status(400).send(`Webhook Error: ${err.message}`);
      }

      try {
        switch (event.type) {
          case "checkout.session.completed": {
            const session = event.data.object as Stripe.Checkout.Session;
            const orderId = session.metadata?.orderId;
            const userId = session.metadata?.userId;
            const tier = session.metadata?.subscriptionTier;

            if (orderId && userId) {
              const order = await storage.getOrder(orderId);
              // Validate ownership and idempotency
              if (order && order.userId === userId && order.status !== "paid") {
                await storage.updateOrder(orderId, {
                  status: "paid",
                  stripeSessionId: session.id,
                  stripePaymentId: (session.payment_intent as string) || null,
                });
              }
            }

            if (tier && userId && session.subscription) {
              const subId = session.subscription as string;
              const sub = await stripe.subscriptions.retrieve(subId);
              const user = await storage.getUser(userId);
              // Validate the subscription's customer belongs to the metadata user
              if (user && user.stripeCustomerId === (sub.customer as string)) {
                await storage.updateUser(userId, {
                  subscriptionId: subId,
                  subscriptionStatus: sub.status,
                  subscriptionTier: tier,
                  subscriptionPeriodEnd: new Date((sub as any).current_period_end * 1000),
                });
              }
            }
            break;
          }
          case "customer.subscription.updated":
          case "customer.subscription.deleted": {
            const sub = event.data.object as Stripe.Subscription;
            const customerId = sub.customer as string;
            const user = await storage.getUserByStripeCustomerId(customerId);
            if (user) {
              await storage.updateUser(user.id, {
                subscriptionStatus: sub.status,
                subscriptionPeriodEnd: new Date((sub as any).current_period_end * 1000),
                ...(sub.status === "canceled" || event.type === "customer.subscription.deleted"
                  ? { subscriptionTier: null, subscriptionId: null }
                  : {}),
              });
            }
            break;
          }
        }
      } catch (err) {
        console.error("Webhook handler error:", err);
      }

      res.json({ received: true });
    },
  );

  // Create checkout session for a book order
  app.post(
    "/api/checkout/create-session",
    requireStripe,
    requireAuth,
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const { bookId, format, shippingAddress } = req.body as {
          bookId: string;
          format: keyof typeof BOOK_PRICES;
          shippingAddress?: any;
        };

        if (!bookId || !format || !BOOK_PRICES[format]) {
          return res.status(400).json({ message: "bookId and a valid format are required" });
        }

        const book = await storage.getBook(bookId);
        if (!book || book.userId !== (req.user as any).id) {
          return res.status(404).json({ message: "Book not found" });
        }

        const user = await storage.getUser((req.user as any).id);
        const priceInfo = BOOK_PRICES[format];

        // Apply subscription discount if any
        let amount: number = priceInfo.amount;
        if (user?.subscriptionTier === "storyteller") amount = Math.round(amount * 0.8);
        if (user?.subscriptionTier === "family") amount = Math.round(amount * 0.7);

        const order = await storage.createOrder({
          userId: user!.id,
          bookId,
          format,
          status: "pending",
          amount,
          shippingAddress: shippingAddress || null,
          stripeSessionId: null,
          stripePaymentId: null,
        });

        const customerId = await ensureStripeCustomer(user!.id);
        const origin = getOrigin(req);

        const session = await stripe!.checkout.sessions.create({
          mode: "payment",
          customer: customerId,
          line_items: [
            {
              price_data: {
                currency: "usd",
                product_data: {
                  name: `${book.title} — ${priceInfo.name}`,
                  description: `Custom AI-illustrated book for ${book.recipientName || "you"}`,
                },
                unit_amount: amount,
              },
              quantity: 1,
            },
          ],
          shipping_address_collection: format === "digital" ? undefined : {
            allowed_countries: ["US", "CA", "GB", "AU", "DE", "FR", "NL", "IE"],
          },
          metadata: { orderId: order.id, userId: user!.id, bookId, format },
          success_url: `${origin}/order/success?session_id={CHECKOUT_SESSION_ID}&order_id=${order.id}`,
          cancel_url: `${origin}/book/${bookId}?checkout=cancelled`,
        });

        await storage.updateOrder(order.id, { stripeSessionId: session.id });
        res.json({ url: session.url, sessionId: session.id, orderId: order.id });
      } catch (err) {
        next(err);
      }
    },
  );

  // Create subscription checkout
  app.post(
    "/api/checkout/create-subscription",
    requireStripe,
    requireAuth,
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const { tier } = req.body as { tier: keyof typeof SUBSCRIPTION_TIERS };
        if (!tier || !SUBSCRIPTION_TIERS[tier]) {
          return res.status(400).json({ message: "Invalid subscription tier" });
        }

        const user = (req.user as any);
        const customerId = await ensureStripeCustomer(user.id);
        const plan = SUBSCRIPTION_TIERS[tier];
        const origin = getOrigin(req);

        const session = await stripe!.checkout.sessions.create({
          mode: "subscription",
          customer: customerId,
          line_items: [
            {
              price_data: {
                currency: "usd",
                recurring: { interval: plan.interval },
                product_data: {
                  name: `TaleWeaver ${plan.name}`,
                  description: plan.description,
                },
                unit_amount: plan.amount,
              },
              quantity: 1,
            },
          ],
          metadata: { userId: user.id, subscriptionTier: tier },
          success_url: `${origin}/order/success?subscription=true&tier=${tier}`,
          cancel_url: `${origin}/pricing?subscription=cancelled`,
        });

        res.json({ url: session.url });
      } catch (err) {
        next(err);
      }
    },
  );

  // Stripe Billing Portal
  app.post(
    "/api/checkout/portal",
    requireStripe,
    requireAuth,
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const user = await storage.getUser((req.user as any).id);
        if (!user?.stripeCustomerId) {
          return res.status(400).json({ message: "No billing account found" });
        }
        const portal = await stripe!.billingPortal.sessions.create({
          customer: user.stripeCustomerId,
          return_url: `${getOrigin(req)}/profile`,
        });
        res.json({ url: portal.url });
      } catch (err) {
        next(err);
      }
    },
  );

  // Get order by id (for success page)
  app.get(
    "/api/orders/:id",
    requireAuth,
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const order = await storage.getOrder(routeParam(req, "id"));
        if (!order || order.userId !== (req.user as any).id) {
          return res.status(404).json({ message: "Order not found" });
        }
        res.json(order);
      } catch (err) {
        next(err);
      }
    },
  );
}
