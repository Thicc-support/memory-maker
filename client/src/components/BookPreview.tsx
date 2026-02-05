import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, ShoppingCart, Truck } from "lucide-react";
import illustrationSpace from "@/assets/images/book-cover-space.png";

export function BookPreview() {
  const [page, setPage] = useState(0);

  const pages = [
    {
      text: "Once upon a time, there was a brave mom named Sarah who loved to look at the stars. Every night, she would tell little Leo, 'One day, I'm going to fly up there!'",
      image: illustrationSpace
    },
    {
      text: "Leo giggled. 'Can I come too?' he asked, hugging his teddy bear. 'Of course!' said Mom. 'We need a co-pilot for the biggest rocket ship ever built.'",
      image: illustrationSpace // Reusing for mock, ideally would be different
    },
    {
      text: "They put on their shiny silver helmets and counted down... 3... 2... 1... BLAST OFF! The rocket roared with a friendly rumble as they soared past the moon.",
      image: illustrationSpace // Reusing for mock
    }
  ];

  return (
    <div className="w-full max-w-5xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="font-heading text-4xl font-bold mb-2">Here is your story!</h2>
        <p className="text-muted-foreground">Previewing "Mommy's Mission to Mars"</p>
      </div>

      {/* Book Container */}
      <div className="bg-white rounded-lg shadow-2xl overflow-hidden aspect-[16/9] md:aspect-[2/1] relative flex border-8 border-[#3d3126]">
        {/* Spine */}
        <div className="absolute left-1/2 top-0 bottom-0 w-8 bg-gradient-to-r from-neutral-200 to-neutral-300 z-20 -translate-x-1/2 shadow-inner" />

        {/* Left Page */}
        <div className="w-1/2 bg-[#FDFBF7] p-8 md:p-12 flex flex-col justify-center items-center relative border-r border-neutral-200">
          <div className="absolute inset-0 bg-gradient-to-r from-black/5 to-transparent pointer-events-none" />
          <p className="font-heading text-xl md:text-2xl leading-relaxed text-slate-800">
            {pages[page].text}
          </p>
          <span className="absolute bottom-6 text-slate-400 font-serif italic text-sm">
            {page * 2 + 1}
          </span>
        </div>

        {/* Right Page (Illustration) */}
        <div className="w-1/2 bg-white relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-l from-black/5 to-transparent pointer-events-none z-10" />
          <img 
            src={pages[page].image} 
            alt="Page illustration" 
            className="w-full h-full object-cover p-4 md:p-8"
          />
           <span className="absolute bottom-6 right-8 text-slate-400 font-serif italic text-sm z-20">
            {page * 2 + 2}
          </span>
        </div>

        {/* Navigation Controls */}
        <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-4 z-30">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setPage(p => Math.max(0, p - 1))}
            disabled={page === 0}
            className="rounded-full bg-white/80 backdrop-blur"
          >
            <ChevronLeft size={16} className="mr-1" /> Previous
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setPage(p => Math.min(pages.length - 1, p + 1))}
            disabled={page === pages.length - 1}
             className="rounded-full bg-white/80 backdrop-blur"
          >
            Next <ChevronRight size={16} className="ml-1" />
          </Button>
        </div>
      </div>

      {/* Order Section */}
      <div className="mt-12 bg-white p-8 rounded-2xl shadow-lg border border-border flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <h3 className="font-bold text-xl mb-1">Ready to print?</h3>
          <p className="text-muted-foreground text-sm flex items-center gap-2">
            <Truck size={16} /> Estimated delivery: 5-7 business days
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right mr-4">
            <div className="text-sm text-muted-foreground line-through">$39.99</div>
            <div className="text-2xl font-bold text-primary">$29.99</div>
          </div>
          <Button size="lg" className="rounded-full px-8 font-bold shadow-lg shadow-primary/20">
            <ShoppingCart size={18} className="mr-2" />
            Order Hardcover
          </Button>
        </div>
      </div>
    </div>
  );
}