import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { BookOpen } from "lucide-react";

export function Navbar() {
  return (
    <nav className="w-full py-6 px-6 md:px-12 flex justify-between items-center bg-transparent relative z-10">
      <Link href="/">
        <a className="flex items-center gap-2 group cursor-pointer">
          <div className="bg-primary p-2 rounded-lg text-white group-hover:rotate-3 transition-transform">
            <BookOpen size={24} />
          </div>
          <span className="font-heading text-2xl font-bold text-primary-foreground tracking-tight">
            TaleWeaver
          </span>
        </a>
      </Link>

      <div className="hidden md:flex gap-8 items-center font-medium text-muted-foreground">
        <a href="#how-it-works" className="hover:text-primary transition-colors">How it Works</a>
        <a href="#examples" className="hover:text-primary transition-colors">Examples</a>
        <a href="#pricing" className="hover:text-primary transition-colors">Pricing</a>
      </div>

      <div className="flex gap-4">
        <Link href="/create">
          <Button className="rounded-full px-6 font-bold shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all hover:-translate-y-0.5">
            Create a Book
          </Button>
        </Link>
      </div>
    </nav>
  );
}