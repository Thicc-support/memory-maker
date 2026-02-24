import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { ProcessSteps } from "@/components/ProcessSteps";
import { BookCard } from "@/components/BookCard";
import { BookPreviewModal } from "@/components/BookPreviewModal";
import { Testimonials } from "@/components/Testimonials";
import { FAQ } from "@/components/FAQ";

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
      },
      {
        text: "Floating in zero gravity is the best feeling ever! It's like swimming through the air, surrounded by sparkling stars and colorful planets.",
        image: "/images/page-career-4.png"
      },
      {
        text: "Dinner time in space is tricky! Chasing floating blobs of soup with a spoon is a fun game we play every night.",
        image: "/images/page-career-5.png"
      },
      {
        text: "We met a friendly green alien today. He didn't speak our language, but a high-five means 'hello' in every galaxy!",
        image: "/images/page-career-6.png"
      },
      {
        text: "Before we left, we helped our new friends build a giant, colorful rocket ship out of space blocks so they could visit us someday.",
        image: "/images/page-career-7.png"
      },
      {
        text: "Time for bed in our cozy space bunks. Drifting off to sleep while watching the milky way spin outside the window. Goodnight, universe.",
        image: "/images/page-career-8.png"
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
      },
      {
        text: "Every morning, I take my little blue watering can and give all the thirsty sprouts a cool drink to start their day.",
        image: "/images/page-hobby-4.png"
      },
      {
        text: "We have lots of tiny helpers in the garden! Friendly ladybugs and fuzzy caterpillars keep our leaves safe from bad bugs.",
        image: "/images/page-hobby-5.png"
      },
      {
        text: "Harvest day is the best day! My basket is overflowing with giant, crunchy carrots and the reddest tomatoes you've ever seen.",
        image: "/images/page-hobby-6.png"
      },
      {
        text: "The sunflowers grew so tall they touch the sky! I have to stand on my tiptoes just to smell them while the bees buzz happily.",
        image: "/images/page-hobby-7.png"
      },
      {
        text: "As the sun sets, the garden glows golden. I sit quietly with my watering can, thankful for the magic that grows from the dirt.",
        image: "/images/page-hobby-8.png"
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
      },
      {
        text: "Looking out the airplane window feels like flying on a magic carpet. The fluffy white clouds look like mountains of cotton candy below us.",
        image: "/images/page-travel-4.png"
      },
      {
        text: "Choo choo! Riding the fast red train through the tall, green mountains is thrilling. We zip past trees and rivers in a flash.",
        image: "/images/page-travel-5.png"
      },
      {
        text: "Today we sailed on a little boat across the bright blue ocean. A family of friendly dolphins raced beside us, jumping high in the air!",
        image: "/images/page-travel-6.png"
      },
      {
        text: "We climbed up, up, up to the top of a snowy mountain peak. It was chilly, but our colorful scarves kept us warm and snug.",
        image: "/images/page-travel-7.png"
      },
      {
        text: "After a long day of exploring, we pitched our cozy tent under a huge starry sky. The crickets sang us a lullaby as we fell asleep.",
        image: "/images/page-travel-8.png"
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
      },
      {
        text: "Our cooking adventure starts at the farmer's market! Grandma lets me help carry the bags full of colorful, fresh vegetables and fruits.",
        image: "/images/page-cooking-4.png"
      },
      {
        text: "Chop, chop, chop! I'm learning how to carefully slice the giant carrots with my special plastic knife. Grandma says I'm a natural chef.",
        image: "/images/page-cooking-5.png"
      },
      {
        text: "Now it's time to stir the big, bubbling pot of soup. The delicious smelling steam tickles my nose and makes my tummy rumble!",
        image: "/images/page-cooking-6.png"
      },
      {
        text: "The best part of baking is watching through the oven door. The flat dough magically puffs up into perfect, warm chocolate chip cookies.",
        image: "/images/page-cooking-7.png"
      },
      {
        text: "Even washing the dishes is fun when we do it together! Grandma and I make giant soap bubble mountains in the sink.",
        image: "/images/page-cooking-8.png"
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

      <Testimonials />
      <FAQ />

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