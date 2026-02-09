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
    pages: [
      {
        text: "Even when gravity tries to pull you down, keep your eyes on the stars. The view from up here is worth every step of the climb.",
        image: "/images/page-career.png"
      },
      {
        text: "Training to be an astronaut takes hard work! Lifting heavy weights and studying star maps is how we prepare for lift-off.",
        image: "/images/page-career-2.png"
      },
      {
        text: "We finally made it! Planting our flag on a new world, we wave hello to our new alien friends. Mission accomplished!",
        image: "/images/page-career-3.png"
      }
    ]
  },
  {
    title: "The Master Gardener",
    description: "Capture the beauty of your garden and share your tips and tricks for a green thumb.",
    ageRange: "All Ages",
    theme: "Hobby",
    image: "/images/example-hobby.png",
    pages: [
      {
        text: "The secret to the biggest pumpkins isn't just water and sun—it's whispering kind words to them every morning!",
        image: "/images/page-hobby.png"
      },
      {
        text: "First, we dig a little hole and tuck the seeds into their cozy bed. The rain clouds come to give them a drink.",
        image: "/images/page-hobby-2.png"
      },
      {
        text: "Look what grew! A giant prize-winning pumpkin. I'm going to need a bigger wheelbarrow for this one!",
        image: "/images/page-hobby-3.png"
      }
    ]
  },
  {
    title: "World Explorer",
    description: "A visual journey through all the places you've been and the adventures you've had.",
    ageRange: "All Ages",
    theme: "Travel",
    image: "/images/example-travel.png",
    pages: [
      {
        text: "We packed our bags, grabbed our passports, and flew across the ocean to see the city of lights. Bonjour, Paris!",
        image: "/images/page-travel.png"
      },
      {
        text: "Checking the map is part of the adventure. Are we lost? No, we're just taking the scenic route!",
        image: "/images/page-travel-2.png"
      },
      {
        text: "Finally, time to relax on the beach. The sun is warm, the coconut water is sweet, and the waves are singing to us.",
        image: "/images/page-travel-3.png"
      }
    ]
  },
  {
    title: "Grandma's Kitchen",
    description: "Preserve family recipes and the stories behind them in a beautiful cookbook.",
    ageRange: "All Ages",
    theme: "Cooking",
    image: "/images/example-cooking.png",
    pages: [
      {
        text: "A little bit of flour on your nose means you're doing it right! Baking cookies is the tastiest kind of magic.",
        image: "/images/page-cooking.png"
      },
      {
        text: "Mix, mix, swirl! The batter is getting thick and sticky. Watch out for flying spoons!",
        image: "/images/page-cooking-2.png"
      },
      {
        text: "Dinner is served! The best part of cooking is sharing a big meal with everyone we love.",
        image: "/images/page-cooking-3.png"
      }
    ]
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