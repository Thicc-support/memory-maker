import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ArrowRight, BookOpen } from "lucide-react";
import { Link } from "wouter";

interface BookPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  book: {
    title: string;
    description: string;
    image: string;
    pageImage: string;
    theme: string;
    pageText: string;
  } | null;
}

export function BookPreviewModal({ isOpen, onClose, book }: BookPreviewModalProps) {
  if (!book) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl w-[95vw] h-[80vh] flex flex-col p-0 overflow-hidden bg-[#fdfbf7]">
        <div className="flex-1 overflow-y-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 h-full">
            {/* Left Side: Cover & Info */}
            <div className="p-8 flex flex-col justify-center items-center bg-white border-r border-border/50">
              <div className="relative w-full max-w-sm aspect-[3/4] shadow-2xl rounded-lg overflow-hidden mb-8 transform hover:scale-105 transition-transform duration-500">
                <img 
                  src={book.image} 
                  alt={book.title} 
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-tr from-black/20 to-transparent pointer-events-none" />
              </div>
              
              <div className="text-center max-w-sm">
                <h2 className="font-heading text-3xl font-bold mb-3">{book.title}</h2>
                <p className="text-muted-foreground mb-6">{book.description}</p>
                <Link href={`/create?template=${book.theme.toLowerCase()}`}>
                  <Button className="w-full" size="lg">
                    Create This Book <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </Link>
              </div>
            </div>

            {/* Right Side: Page Preview */}
            <div className="p-8 flex flex-col bg-[#fdfbf7]">
              <div className="mb-6 flex items-center gap-2 text-primary font-semibold uppercase tracking-wider text-sm">
                <BookOpen size={16} />
                <span>Inside Preview</span>
              </div>
              
              <div className="flex-1 flex flex-col justify-center">
                <div className="bg-white p-6 shadow-sm border border-slate-100 rounded-sm aspect-[4/3] relative flex items-center justify-center overflow-hidden">
                   {/* Book crease shadow */}
                   <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-black/5 to-transparent z-10 pointer-events-none" />
                   
                   <div className="flex w-full h-full gap-8">
                      {/* Left Page (Text) */}
                      <div className="flex-1 flex items-center justify-center p-4">
                        <p className="font-heading text-xl leading-relaxed text-slate-700 text-center">
                          "{book.pageText}"
                        </p>
                      </div>
                      
                      {/* Right Page (Image) */}
                      <div className="flex-1 relative rounded overflow-hidden">
                        <img 
                          src={book.pageImage} 
                          alt="Page preview" 
                          className="absolute inset-0 w-full h-full object-cover"
                        />
                      </div>
                   </div>
                </div>
                <p className="text-center text-xs text-muted-foreground mt-4">
                  * All illustrations are AI-generated based on your story.
                </p>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
