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
          <h2 className="font-heading text-4xl font-bold mb-4 text-primary-foreground">Discover the Magic</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Explore our most popular themes. Each book is uniquely written based on your family's real stories.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <BookCard 
            title="Mommy's Space Mission"
            description="Perfect for moms with careers in science, tech, or who just reach for the stars. A story about dreaming big."
            ageRange="Ages 3-8"
            theme="Space"
            image={coverSpace}
            delay={0}
          />
          <BookCard 
            title="Grandpa's Jungle Journey"
            description="For the adventurous grandparent. Turn their travel stories or backyard explorations into an epic safari."
            ageRange="Ages 4-10"
            theme="Adventure"
            image={coverJungle}
            delay={0.1}
          />
           <BookCard 
            title="Auntie's Secret Garden"
            description="A whimsical tale about nature, growth, and the magic found in everyday plants and flowers."
            ageRange="Ages 2-6"
            theme="Nature"
            image={coverSpace} // Placeholder reuse
            delay={0.2}
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