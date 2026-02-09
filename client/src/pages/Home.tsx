import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { ProcessSteps } from "@/components/ProcessSteps";
import { BookCard } from "@/components/BookCard";
import coverSpace from "@/assets/images/book-cover-space.png";
import coverJungle from "@/assets/images/book-cover-jungle.png";

export default function Home() {
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
          <BookCard 
            title="My Career Journey"
            description="Document your professional path, lessons learned, and advice for the next generation."
            ageRange="Adults"
            theme="Career"
            image="/images/example-career.png"
            delay={0}
          />
          <BookCard 
            title="The Master Gardener"
            description="Capture the beauty of your garden and share your tips and tricks for a green thumb."
            ageRange="All Ages"
            theme="Hobby"
            image="/images/example-hobby.png"
            delay={0.1}
          />
           <BookCard 
            title="World Explorer"
            description="A visual journey through all the places you've been and the adventures you've had."
            ageRange="All Ages"
            theme="Travel"
            image="/images/example-travel.png"
            delay={0.2}
          />
          <BookCard 
            title="Grandma's Kitchen"
            description="Preserve family recipes and the stories behind them in a beautiful cookbook."
            ageRange="All Ages"
            theme="Cooking"
            image="/images/example-cooking.png"
            delay={0.3}
          />
        </div>
      </section>

      <footer className="py-12 border-t border-border bg-white/50">
        <div className="container mx-auto px-6 text-center text-muted-foreground">
          <p>&copy; 2024 TaleWeaver. Making memories magical.</p>
        </div>
      </footer>
    </div>
  );
}