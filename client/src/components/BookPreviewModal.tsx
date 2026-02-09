import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ArrowRight, BookOpen, ChevronLeft, ChevronRight } from "lucide-react";
import { Link } from "wouter";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface BookPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  book: {
    title: string;
    description: string;
    image: string;
    theme: string;
    pages: Array<{
      text: string;
      image: string;
    }>;
  } | null;
}

export function BookPreviewModal({ isOpen, onClose, book }: BookPreviewModalProps) {
  const [currentPage, setCurrentPage] = useState(0);

  // Reset page when modal opens/closes or book changes
  useEffect(() => {
    if (isOpen) setCurrentPage(0);
  }, [isOpen, book]);

  if (!book) return null;

  const totalPages = book.pages.length;
  const currentContent = book.pages[currentPage];

  const nextPage = () => {
    if (currentPage < totalPages - 1) setCurrentPage(p => p + 1);
  };

  const prevPage = () => {
    if (currentPage > 0) setCurrentPage(p => p - 1);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl w-[95vw] h-[85vh] flex flex-col p-0 overflow-hidden bg-[#fdfbf7] border-none shadow-2xl">
        <div className="flex-1 overflow-hidden relative flex flex-col md:flex-row">
            
            {/* Left Side: Cover & Info - Hidden on mobile if viewing pages, or stacked */}
            <div className="hidden md:flex w-1/3 p-8 flex-col justify-center items-center bg-white border-r border-border/50 z-10">
              <div className="relative w-full max-w-[240px] aspect-[3/4] shadow-2xl rounded-lg overflow-hidden mb-8 transform hover:scale-105 transition-transform duration-500">
                <img 
                  src={book.image} 
                  alt={book.title} 
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-tr from-black/20 to-transparent pointer-events-none" />
              </div>
              
              <div className="text-center w-full">
                <h2 className="font-heading text-2xl font-bold mb-3">{book.title}</h2>
                <p className="text-muted-foreground text-sm mb-6 line-clamp-4">{book.description}</p>
                <Link href={`/create?template=${book.theme.toLowerCase()}`}>
                  <Button className="w-full rounded-full font-bold shadow-lg shadow-primary/20" size="lg">
                    Create This Book <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </Link>
              </div>
            </div>

            {/* Right Side: Page Preview */}
            <div className="flex-1 flex flex-col bg-[#fdfbf7] relative">
              {/* Header */}
              <div className="p-4 flex items-center justify-between border-b border-border/10 bg-white/50 backdrop-blur-sm">
                 <div className="flex items-center gap-2 text-primary font-bold uppercase tracking-wider text-xs">
                  <BookOpen size={16} />
                  <span>Previewing Page {currentPage + 1} of {totalPages}</span>
                </div>
                <div className="md:hidden">
                   {/* Mobile close button could go here if needed, but Dialog handles it */}
                </div>
              </div>
              
              {/* Book Content */}
              <div className="flex-1 flex flex-col justify-center items-center p-4 md:p-8 relative overflow-hidden">
                
                {/* Navigation Buttons */}
                <button 
                  onClick={prevPage}
                  disabled={currentPage === 0}
                  className="absolute left-2 md:left-4 z-20 p-2 rounded-full bg-white/80 shadow-md hover:bg-white disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                >
                  <ChevronLeft size={24} />
                </button>
                
                <button 
                  onClick={nextPage}
                  disabled={currentPage === totalPages - 1}
                  className="absolute right-2 md:right-4 z-20 p-2 rounded-full bg-white/80 shadow-md hover:bg-white disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                >
                  <ChevronRight size={24} />
                </button>

                <AnimatePresence mode="wait">
                  <motion.div 
                    key={currentPage}
                    initial={{ opacity: 0, scale: 0.95, x: 20 }}
                    animate={{ opacity: 1, scale: 1, x: 0 }}
                    exit={{ opacity: 0, scale: 0.95, x: -20 }}
                    transition={{ duration: 0.3 }}
                    className="w-full max-w-3xl bg-white shadow-xl border border-slate-200 rounded-sm aspect-[4/3] relative flex overflow-hidden mx-auto"
                  >
                     {/* Book crease shadow */}
                     <div className="absolute left-0 top-0 bottom-0 w-8 md:w-16 bg-gradient-to-r from-black/5 to-transparent z-10 pointer-events-none" />
                     <div className="absolute inset-x-0 bottom-0 h-px bg-slate-200 z-10" />

                     <div className="flex flex-col md:flex-row w-full h-full">
                        {/* Left Page (Text) */}
                        <div className="flex-1 flex items-center justify-center p-6 md:p-10 bg-[#fffdf9]">
                          <p className="font-heading text-lg md:text-xl leading-relaxed text-slate-700 text-center font-medium">
                            "{currentContent.text}"
                          </p>
                          <span className="absolute bottom-4 left-4 md:left-8 text-[10px] text-slate-300 font-mono">{currentPage * 2 + 1}</span>
                        </div>
                        
                        {/* Right Page (Image) */}
                        <div className="flex-1 relative overflow-hidden border-t md:border-t-0 md:border-l border-slate-100">
                          <img 
                            src={currentContent.image} 
                            alt={`Page ${currentPage + 1}`} 
                            className="absolute inset-0 w-full h-full object-cover"
                          />
                          <span className="absolute bottom-4 right-4 md:right-8 text-[10px] text-white/80 font-mono drop-shadow-md">{currentPage * 2 + 2}</span>
                        </div>
                     </div>
                  </motion.div>
                </AnimatePresence>
                
                <div className="mt-6 flex gap-2">
                  {book.pages.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentPage(idx)}
                      className={`w-2 h-2 rounded-full transition-all ${idx === currentPage ? 'bg-primary w-4' : 'bg-slate-300 hover:bg-slate-400'}`}
                    />
                  ))}
                </div>

                <p className="text-center text-xs text-muted-foreground mt-4 select-none">
                  * AI-generated content based on your story
                </p>
              </div>
            </div>
          </div>
      </DialogContent>
    </Dialog>
  );
}
