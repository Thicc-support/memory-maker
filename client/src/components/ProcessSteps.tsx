import { MessageSquare, BookText, Gift } from "lucide-react";

export function ProcessSteps() {
  const steps = [
    {
      icon: <MessageSquare size={32} />,
      title: "1. Chat with AI",
      description: "Answer fun questions about your memories and adventures. It's like chatting with a friend!"
    },
    {
      icon: <BookText size={32} />,
      title: "2. We Write & Illustrate",
      description: "Our magical engine turns your answers into a custom story with beautiful artwork."
    },
    {
      icon: <Gift size={32} />,
      title: "3. Get Your Book",
      description: "We print your one-of-a-kind hardcover book and ship it directly to your door."
    }
  ];

  return (
    <section id="how-it-works" className="py-24 bg-white/50">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="font-heading text-4xl font-bold mb-4">How It Works</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">Creating a timeless family keepsake has never been easier.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-12 relative">
          {/* Connector Line */}
          <div className="hidden md:block absolute top-12 left-1/6 right-1/6 h-0.5 bg-border -z-10 border-t-2 border-dashed border-muted-foreground/30" />

          {steps.map((step, i) => (
            <div key={i} className="flex flex-col items-center text-center">
              <div className="w-24 h-24 rounded-full bg-secondary flex items-center justify-center text-primary-foreground mb-6 shadow-inner border-4 border-white relative z-10">
                {step.icon}
              </div>
              <h3 className="font-heading text-xl font-bold mb-3">{step.title}</h3>
              <p className="text-muted-foreground leading-relaxed px-4">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}