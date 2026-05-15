import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Check, Sparkles, BookOpen, Crown } from "lucide-react";
import { useLocation } from "wouter";

const individual = [
  {
    id: "digital",
    name: "Digital Keepsake",
    price: "$19.99",
    icon: BookOpen,
    desc: "Best way to launch and share quickly",
    features: [
      "Personalized story-first book",
      "10–24 illustrated pages",
      "Choose title and cover direction",
      "Preview and edit before ordering",
      "Instant digital access after payment",
    ],
  },
  {
    id: "softcover",
    name: "Softcover Keepsake",
    price: "$39.99",
    icon: Sparkles,
    desc: "A gift-ready printed family story",
    features: [
      "Everything in Digital",
      "Premium color pages",
      "Shipping address collected at checkout",
      "Manual review before print fulfillment",
      "Great for birthdays and holidays",
    ],
    popular: true,
  },
  {
    id: "hardcover",
    name: "Hardcover Keepsake",
    price: "$59.99",
    icon: Crown,
    desc: "Premium family legacy gift",
    features: [
      "Everything in Softcover",
      "Premium hardcover keepsake",
      "Best for parents and grandparents",
      "Manual review before print fulfillment",
      "Made for stories worth passing down",
    ],
  },
];

export default function Pricing() {
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen">
      <Navbar />

      <section className="py-20 container mx-auto px-6">
        <div className="text-center mb-16">
          <h1 className="font-heading text-5xl font-bold mb-4 text-primary-foreground" data-testid="text-pricing-page-title">
            Simple pricing for family storybooks
          </h1>
          <p className="text-muted-foreground text-lg max-w-3xl mx-auto">
            Create a story-first keepsake about a real person, memory, trip, career, service, or family adventure. Start digital now, then order print when the book looks right.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-12">
          {individual.map((plan) => (
            <div
              key={plan.id}
              data-testid={`card-individual-${plan.id}`}
              className={`relative rounded-2xl border-2 p-8 bg-white ${
                plan.popular ? "border-primary shadow-xl scale-105" : "border-border shadow-sm"
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-white text-xs font-bold px-4 py-1.5 rounded-full shadow-lg">
                  Most Popular Gift
                </div>
              )}
              <div className="flex items-center gap-3 mb-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${plan.popular ? "bg-primary text-white" : "bg-primary/10 text-primary"}`}>
                  <plan.icon size={24} />
                </div>
                <div>
                  <h3 className="font-heading text-xl font-bold">{plan.name}</h3>
                  <p className="text-xs text-muted-foreground">{plan.desc}</p>
                </div>
              </div>

              <div className="mb-6">
                <span className="font-heading text-4xl font-bold">{plan.price}</span>
                <span className="text-muted-foreground text-sm"> / book</span>
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
                onClick={() => setLocation("/create")}
                data-testid={`button-plan-${plan.id}`}
              >
                Start Creating
              </Button>
            </div>
          ))}
        </div>

        <div className="max-w-4xl mx-auto bg-white/70 rounded-2xl border border-border p-8 text-center">
          <h2 className="font-heading text-2xl font-bold mb-2 text-primary-foreground">What customers are buying</h2>
          <p className="text-muted-foreground mb-6">
            Not a generic photo book. Not a random AI fairy tale. A personal children’s book about someone real — written from the memories, details, and photos the customer shares.
          </p>
          <div className="grid md:grid-cols-3 gap-4 text-sm">
            <div className="rounded-xl bg-primary/5 border border-primary/10 p-4">Dad's career story</div>
            <div className="rounded-xl bg-primary/5 border border-primary/10 p-4">Grandpa's military service</div>
            <div className="rounded-xl bg-primary/5 border border-primary/10 p-4">A family adventure</div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
