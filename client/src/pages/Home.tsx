import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { ProcessSteps } from "@/components/ProcessSteps";
import { BookCard } from "@/components/BookCard";
import { BookPreviewModal } from "@/components/BookPreviewModal";

const EXAMPLE_BOOKS = [
  {
    title: "My Career Journey",
    description: "Document your professional path, lessons learned, and advice for the next generation.",
    ageRange: "Adults",
    theme: "Career",
    image: "/images/example-career.png",
    pageImage: "/images/page-career.png",
    pageText: "Even when gravity tries to pull you down, keep your eyes on the stars. The view from up here is worth every step of the climb."
  },
  {
    title: "The Master Gardener",
    description: "Capture the beauty of your garden and share your tips and tricks for a green thumb.",
    ageRange: "All Ages",
    theme: "Hobby",
    image: "/images/example-hobby.png",
    pageImage: "/images/page-hobby.png",
    pageText: "The secret to the biggest pumpkins isn't just water and sun—it's whispering kind words to them every morning!"
  },
  {
    title: "World Explorer",
    description: "A visual journey through all the places you've been and the adventures you've had.",
    ageRange: "All Ages",
    theme: "Travel",
    image: "/images/example-travel.png",
    pageImage: "/images/page-travel.png",
    pageText: "We packed our bags, grabbed our passports, and flew across the ocean to see the city of lights. Bonjour, Paris!"
  },
  {
    title: "Grandma's Kitchen",
    description: "Preserve family recipes and the stories behind them in a beautiful cookbook.",
    ageRange: "All Ages",
    theme: "Cooking",
    image: "/images/example-cooking.png",
    pageImage: "/images/page-cooking.png",
    pageText: "A little bit of flour on your nose means you're doing it right! Baking cookies is the tastiest kind of magic."
  }
];

export default function Home() {
  const [selectedBook, setSelectedBook] = useState<typeof EXAMPLE_BOOKS[0] | null>(null);

  return (
    <div className="min-h-screen">
      <Navbar />
      <Hero />
      <ProcessSteps />
      
      <section id="examples" className="py-24 container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="font-heading text-4xl font-bold mb-4 text-primary-foreground">Discover the Possibilities</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
             From professional journeys to cherished hobbies, turn any life experience into a beautiful book.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {EXAMPLE_BOOKS.map((book, index) => (
            <BookCard 
              key={index}
              {...book}
              delay={index * 0.1}
              onClick={() => setSelectedBook(book)}
            />
          ))}
        </div>
      </section>

      <BookPreviewModal 
        isOpen={!!selectedBook}
        onClose={() => setSelectedBook(null)}
        book={selectedBook}
      />

      <footer className="py-12 border-t border-border bg-white/50">
        <div className="container mx-auto px-6 text-center text-muted-foreground">
          <p>&copy; 2024 TaleWeaver. Making memories magical.</p>
        </div>
      </footer>
    </div>
  );
}