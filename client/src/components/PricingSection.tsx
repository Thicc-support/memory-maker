import { Button } from "@/components/ui/button";
import { Check, Sparkles, BookOpen, Crown } from "lucide-react";
import { useLocation } from "wouter";
import { cn } from "@/lib/utils";

const plans = [
  {
    id: "digital",
    name: "Digital",
    price: "$14.99",
    icon: BookOpen,
    description: "Perfect for sharing digitally",
    features: [
      "8+ custom AI-illustrated pages",
      "High-resolution PDF download",
      "Instant delivery",
      "Share via email or link",
      "Print at home anytime",
    ],
    popular: false,
  },
  {
    id: "softcover",
    name: "Softcover",
    price: "$29.99",
    icon: Sparkles,
    description: "Beautiful & affordable",
    features: [
      "Everything in Digital",
      "Professional printing",
      "8x10 inch premium paper",
      "Glossy full-color pages",
      "Ships in 5-7 days",
    ],
    popular: true,
  },
  {
    id: "hardcover",
    name: "Hardcover",
    price: "$39.99",
    icon: Crown,
    description: "Heirloom quality keepsake",
    features: [
      "Everything in Softcover",
      "Casebound hard cover",
      "Lay-flat binding",
      "Dust jacket included",
      "Gift box packaging",
    ],
    popular: false,
  },
];

export function PricingSection() {
  const [, setLocation] = useLocation();
  return (
    <section id="pricing" className="py-24 bg-white/50">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="font-heading text-4xl font-bold mb-4 text-primary-foreground" data-testid="text-pricing-title">
            Simple, Transparent Pricing
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Every book is crafted with AI-powered storytelling and custom illustrations. Choose the format that's right for you.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {plans.map((plan) => (
            <div
              key={plan.id}
              data-testid={`card-pricing-${plan.id}`}
              className={cn(
                "relative rounded-2xl border-2 p-8 transition-all duration-300 bg-white",
                plan.popular
                  ? "border-primary shadow-xl scale-105 z-10"
                  : "border-border shadow-sm hover:shadow-md hover:border-primary/30"
              )}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-white text-xs font-bold px-4 py-1.5 rounded-full shadow-lg">
                  Most Popular
                </div>
              )}

              <div className="flex items-center gap-3 mb-4">
                <div className={cn(
                  "w-12 h-12 rounded-xl flex items-center justify-center",
                  plan.popular ? "bg-primary text-white" : "bg-primary/10 text-primary"
                )}>
                  <plan.icon size={24} />
                </div>
                <div>
                  <h3 className="font-heading text-xl font-bold">{plan.name}</h3>
                  <p className="text-xs text-muted-foreground">{plan.description}</p>
                </div>
              </div>

              <div className="mb-6">
                <span className="font-heading text-4xl font-bold">{plan.price}</span>
                <span className="text-muted-foreground text-sm"> / book</span>
              </div>

              <ul className="space-y-3 mb-8">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm">
                    <Check size={16} className="text-green-500 mt-0.5 shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <Button
                data-testid={`button-pricing-${plan.id}`}
                className={cn(
                  "w-full rounded-full font-bold",
                  plan.popular
                    ? "shadow-lg shadow-primary/20"
                    : "bg-white text-primary border-2 border-primary hover:bg-primary hover:text-white"
                )}
                variant={plan.popular ? "default" : "outline"}
                size="lg"
                onClick={() => setLocation("/create")}
              >
                Get Started
              </Button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
