import { Star } from "lucide-react";
import { motion } from "framer-motion";

const TESTIMONIALS = [
  {
    name: "Sarah M.",
    role: "Daughter creating a gift for Dad",
    text: "I wanted my kids to understand what their grandpa did for work. TaleWeaver turned his career stories into something warm, simple, and fun enough for bedtime.",
    image: "/images/page-career.png"
  },
  {
    name: "David T.",
    role: "Grandfather",
    text: "I had old service stories and a few photos, but I didn't know how to make them child-friendly. The book made my memories feel like something my grandson could hold onto.",
    image: "/images/page-hobby.png"
  },
  {
    name: "Elena R.",
    role: "Aunt",
    text: "I created a book about our Europe trip for my niece. It felt personal without being just a photo album — it told the adventure behind the pictures.",
    image: "/images/page-travel.png"
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
            Real memories, made readable for kids ✨
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Built for families who want to pass down stories, not just store photos on a phone.
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
