import { Star } from "lucide-react";
import { motion } from "framer-motion";

const TESTIMONIALS = [
  {
    name: "Sarah M.",
    role: "Mother of two",
    text: "The look on my daughter's face when she realized the brave astronaut in the story was based on her was priceless. This is our new favorite bedtime book.",
    image: "/images/testimonial-1.jpg"
  },
  {
    name: "David T.",
    role: "Grandfather",
    text: "I wanted to share my gardening stories with my grandson, but I'm no writer. TaleWeaver took my rambling memories and turned them into a gorgeous, magical adventure.",
    image: "/images/testimonial-3.jpg"
  },
  {
    name: "Elena R.",
    role: "Aunt",
    text: "Truly one-in-a-million! I created a book about our family beach vacation, and the illustrations capture the exact feeling of those sunny days.",
    image: "/images/testimonial-2.jpg"
  }
];

export function Testimonials() {
  return (
    <section className="py-24 bg-primary/5">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-1 text-amber-500 mb-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <Star key={i} size={20} fill="currentColor" />
            ))}
          </div>
          <h2 className="font-heading text-4xl font-bold mb-4 text-primary-foreground">
            Truly One-in-a-Million ✨
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Join thousands of families who have already turned their memories into magical stories.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {TESTIMONIALS.map((testimonial, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-white rounded-2xl p-6 shadow-sm border border-border flex flex-col h-full"
            >
              <div className="w-full h-48 mb-6 overflow-hidden rounded-xl">
                <img 
                  src={testimonial.image} 
                  alt={testimonial.name}
                  className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="flex gap-1 text-amber-500 mb-4">
                 {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} size={14} fill="currentColor" />
                ))}
              </div>
              <p className="text-slate-700 italic mb-6 flex-1">
                "{testimonial.text}"
              </p>
              <div className="mt-auto border-t border-slate-100 pt-4">
                <p className="font-bold text-primary-foreground">{testimonial.name}</p>
                <p className="text-sm text-muted-foreground">{testimonial.role}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}