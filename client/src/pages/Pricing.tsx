import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Check, Sparkles, BookOpen, Crown, Loader2 } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";
import { AuthModal } from "@/components/AuthModal";

const plans = [
  {
    id: "free",
    name: "Free",
    price: "$0",
    interval: "forever",
    icon: BookOpen,
    description: "Try TaleWeaver risk-free",
    features: [
      "1 digital preview book",
      "AI-guided story interview",
      "AI-illustrated pages",
      "View in browser only",
      "No download",
    ],
    cta: "Start Free",
    tier: null,
  },
  {
    id: "storyteller",
    name: "Storyteller",
    price: "$14.99",
    interval: "month",
    icon: Sparkles,
    description: "For the regular storyteller",
    features: [
      "1 free digital book per month",
      "20% off all extra books",
      "All digital downloads (PDF)",
      "Story Profiles & AI Memory",
      "Cancel anytime",
    ],
    cta: "Subscribe",
    tier: "storyteller" as const,
    popular: true,
  },
  {
    id: "family",
    name: "Family Bundle",
    price: "$29.99",
    interval: "month",
    icon: Crown,
    description: "Best for growing families",
    features: [
      "3 free books per month",
      "30% off all extra books",
      "Priority generation",
      "All formats (digital, soft, hard)",
      "Story Profiles & AI Memory",
    ],
    cta: "Subscribe",
    tier: "family" as const,
  },
];

const individual = [
  { name: "Digital PDF", price: "$9.99", desc: "Download instantly" },
  { name: "Softcover", price: "$24.99", desc: "Premium 8x10 print, ships in 5–7 days" },
  { name: "Hardcover", price: "$34.99", desc: "Heirloom-quality keepsake" },
];

export default function Pricing() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [loading, setLoading] = useState<string | null>(null);
  const [showAuth, setShowAuth] = useState(false);

  const handleSubscribe = async (tier: "storyteller" | "family" | null) => {
    if (tier === null) {
      setLocation("/create");
      return;
    }
    if (!user) {
      setShowAuth(true);
      return;
    }
    setLoading(tier);
    try {
      const res = await fetch("/api/checkout/create-subscription", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ tier }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to start checkout");
      window.location.href = data.url;
    } catch (err: any) {
      toast({ title: "Could not start checkout", description: err.message, variant: "destructive" });
      setLoading(null);
    }
  };

  const openPortal = async () => {
    setLoading("portal");
    try {
      const res = await fetch("/api/checkout/portal", {
        method: "POST",
        credentials: "include",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      window.location.href = data.url;
    } catch (err: any) {
      toast({ title: "Could not open billing portal", description: err.message, variant: "destructive" });
      setLoading(null);
    }
  };

  return (
    <div className="min-h-screen">
      <AuthModal isOpen={showAuth} onOpenChange={setShowAuth} onLoginSuccess={() => {}} />
      <Navbar />

      <section className="py-20 container mx-auto px-6">
        <div className="text-center mb-16">
          <h1 className="font-heading text-5xl font-bold mb-4 text-primary-foreground" data-testid="text-pricing-page-title">
            Pricing built for families
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Subscribe for monthly books at the best price, or order individual books any time. No hidden fees.
          </p>
          {user && (
            <Button
              variant="outline"
              size="sm"
              className="mt-6 rounded-full"
              onClick={openPortal}
              disabled={loading === "portal"}
              data-testid="button-billing-portal"
            >
              {loading === "portal" ? <Loader2 size={14} className="mr-2 animate-spin" /> : null}
              Manage Billing
            </Button>
          )}
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-20">
          {plans.map((plan) => (
            <div
              key={plan.id}
              data-testid={`card-plan-${plan.id}`}
              className={`relative rounded-2xl border-2 p-8 bg-white ${
                plan.popular ? "border-primary shadow-xl scale-105" : "border-border shadow-sm"
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-white text-xs font-bold px-4 py-1.5 rounded-full shadow-lg">
                  Most Popular
                </div>
              )}
              <div className="flex items-center gap-3 mb-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${plan.popular ? "bg-primary text-white" : "bg-primary/10 text-primary"}`}>
                  <plan.icon size={24} />
                </div>
                <div>
                  <h3 className="font-heading text-xl font-bold">{plan.name}</h3>
                  <p className="text-xs text-muted-foreground">{plan.description}</p>
                </div>
              </div>

              <div className="mb-6">
                <span className="font-heading text-4xl font-bold">{plan.price}</span>
                <span className="text-muted-foreground text-sm"> / {plan.interval}</span>
              </div>

              <ul className="space-y-3 mb-8">
                {plan.features.map((f, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm">
                    <Check size={16} className="text-green-500 mt-0.5 shrink-0" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>

              <Button
                className={`w-full rounded-full font-bold ${plan.popular ? "shadow-lg shadow-primary/20" : ""}`}
                variant={plan.popular ? "default" : "outline"}
                size="lg"
                onClick={() => handleSubscribe(plan.tier)}
                disabled={loading === plan.tier}
                data-testid={`button-plan-${plan.id}`}
              >
                {loading === plan.tier ? <Loader2 size={16} className="mr-2 animate-spin" /> : null}
                {plan.cta}
              </Button>
            </div>
          ))}
        </div>

        <div className="max-w-4xl mx-auto bg-white/70 rounded-2xl border border-border p-8">
          <h2 className="font-heading text-2xl font-bold mb-2 text-center text-primary-foreground">Individual Book Pricing</h2>
          <p className="text-center text-muted-foreground mb-8 text-sm">No subscription? Pay per book. Subscribers get 20–30% off.</p>
          <div className="grid md:grid-cols-3 gap-4">
            {individual.map((p) => (
              <div key={p.name} className="rounded-xl border border-border p-5 text-center bg-white" data-testid={`card-individual-${p.name.toLowerCase().replace(/\s+/g, "-")}`}>
                <h3 className="font-bold mb-1">{p.name}</h3>
                <div className="font-heading text-3xl font-bold text-primary mb-2">{p.price}</div>
                <p className="text-xs text-muted-foreground">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
