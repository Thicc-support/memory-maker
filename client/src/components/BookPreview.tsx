import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, ShoppingCart, Truck, Edit3, RefreshCw, Check, X, Loader2, Heart } from "lucide-react";
import { FormatSelector, FormatType } from "@/components/FormatSelector";
import { useToast } from "@/hooks/use-toast";

interface BookPage {
  text: string;
  image: string;
}

interface BookPreviewProps {
  bookId?: string;
  title?: string;
  pages?: BookPage[];
  onOrder?: (format: string) => void;
  onFavorite?: () => void;
}

export function BookPreview({ bookId, title = "Your Story", pages: initialPages, onOrder, onFavorite }: BookPreviewProps) {
  const [page, setPage] = useState(0);
  const [format, setFormat] = useState<FormatType>("hardcover");
  const [editingPage, setEditingPage] = useState<number | null>(null);
  const [editText, setEditText] = useState("");
  const [regenerating, setRegenerating] = useState<number | null>(null);
  const [pages, setPages] = useState<BookPage[]>(initialPages || []);
  const [ordering, setOrdering] = useState(false);
  const { toast } = useToast();

  const currentPages = pages.length > 0 ? pages : [
    { text: "Your story is being created...", image: "" }
  ];

  const handleEditStart = (idx: number) => {
    setEditingPage(idx);
    setEditText(currentPages[idx].text);
  };

  const handleEditSave = async () => {
    if (editingPage === null || !bookId) return;

    try {
      const res = await fetch(`/api/books/${bookId}/page/${editingPage}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: editText }),
        credentials: "include",
      });
      if (res.ok) {
        const updated = await res.json();
        setPages(updated.pages);
        toast({ title: "Page updated" });
      }
    } catch (err) {
      toast({ title: "Failed to save", variant: "destructive" });
    }
    setEditingPage(null);
  };

  const handleRegenerate = async (idx: number) => {
    if (!bookId) return;
    setRegenerating(idx);

    try {
      const res = await fetch(`/api/books/${bookId}/regenerate-page`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pageIndex: idx }),
        credentials: "include",
      });
      if (res.ok) {
        const updated = await res.json();
        setPages(updated.pages);
        toast({ title: "Illustration regenerated" });
      }
    } catch (err) {
      toast({ title: "Failed to regenerate", variant: "destructive" });
    }
    setRegenerating(null);
  };

  const handleOrder = async () => {
    if (!bookId) return;
    setOrdering(true);

    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookId, format }),
        credentials: "include",
      });
      if (res.ok) {
        toast({ title: "Order placed!", description: format === "digital" ? "Your download will be ready shortly." : "Your book will ship in 5-7 business days." });
        onOrder?.(format);
      }
    } catch (err) {
      toast({ title: "Order failed", variant: "destructive" });
    }
    setOrdering(false);
  };

  return (
    <div className="w-full max-w-5xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="font-heading text-4xl font-bold mb-2" data-testid="text-book-title">Here is your story!</h2>
        <p className="text-muted-foreground" data-testid="text-book-subtitle">Previewing "{title}"</p>
        <p className="text-xs text-muted-foreground mt-1">Page {page + 1} of {currentPages.length}</p>
      </div>

      <div className="bg-white rounded-lg shadow-2xl overflow-hidden aspect-[16/9] md:aspect-[2/1] relative flex border-8 border-[#3d3126]" data-testid="book-viewer">
        <div className="absolute left-1/2 top-0 bottom-0 w-8 bg-gradient-to-r from-neutral-200 to-neutral-300 z-20 -translate-x-1/2 shadow-inner" />

        <div className="w-1/2 bg-[#FDFBF7] p-8 md:p-12 flex flex-col justify-center items-center relative border-r border-neutral-200">
          <div className="absolute inset-0 bg-gradient-to-r from-black/5 to-transparent pointer-events-none" />

          {editingPage === page ? (
            <div className="relative z-10 w-full">
              <textarea
                value={editText}
                onChange={(e) => setEditText(e.target.value)}
                className="w-full h-40 p-3 border rounded-lg text-sm resize-none focus:ring-2 focus:ring-primary focus:outline-none"
                data-testid="input-edit-page-text"
              />
              <div className="flex gap-2 mt-2 justify-end">
                <Button size="sm" variant="ghost" onClick={() => setEditingPage(null)} data-testid="button-cancel-edit">
                  <X size={14} className="mr-1" /> Cancel
                </Button>
                <Button size="sm" onClick={handleEditSave} data-testid="button-save-edit">
                  <Check size={14} className="mr-1" /> Save
                </Button>
              </div>
            </div>
          ) : (
            <>
              <p className="font-heading text-xl md:text-2xl leading-relaxed text-slate-800 relative z-10" data-testid="text-page-content">
                {currentPages[page]?.text}
              </p>
              {bookId && (
                <div className="absolute top-4 right-4 z-10 flex gap-1">
                  <button
                    onClick={() => handleEditStart(page)}
                    className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-primary transition-colors"
                    title="Edit text"
                    data-testid="button-edit-page"
                  >
                    <Edit3 size={14} />
                  </button>
                </div>
              )}
            </>
          )}
          <span className="absolute bottom-6 text-slate-400 font-serif italic text-sm">
            {page * 2 + 1}
          </span>
        </div>

        <div className="w-1/2 bg-white relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-l from-black/5 to-transparent pointer-events-none z-10" />
          {currentPages[page]?.image ? (
            <img
              src={currentPages[page].image}
              alt="Page illustration"
              className="w-full h-full object-cover p-4 md:p-8"
              data-testid="img-page-illustration"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-muted-foreground">
              <Loader2 className="animate-spin" size={32} />
            </div>
          )}
          {bookId && (
            <div className="absolute top-4 right-4 z-20">
              <button
                onClick={() => handleRegenerate(page)}
                disabled={regenerating === page}
                className="p-1.5 rounded-lg bg-white/80 hover:bg-white text-slate-400 hover:text-primary transition-colors shadow-sm"
                title="Regenerate illustration"
                data-testid="button-regenerate-illustration"
              >
                {regenerating === page ? <Loader2 size={14} className="animate-spin" /> : <RefreshCw size={14} />}
              </button>
            </div>
          )}
          <span className="absolute bottom-6 right-8 text-slate-400 font-serif italic text-sm z-20">
            {page * 2 + 2}
          </span>
        </div>

        <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-4 z-30">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage(p => Math.max(0, p - 1))}
            disabled={page === 0}
            className="rounded-full bg-white/80 backdrop-blur"
            data-testid="button-prev-page"
          >
            <ChevronLeft size={16} className="mr-1" /> Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage(p => Math.min(currentPages.length - 1, p + 1))}
            disabled={page === currentPages.length - 1}
            className="rounded-full bg-white/80 backdrop-blur"
            data-testid="button-next-page"
          >
            Next <ChevronRight size={16} className="ml-1" />
          </Button>
        </div>
      </div>

      <div className="mt-12 bg-white p-8 rounded-2xl shadow-lg border border-border">
        <h3 className="font-bold text-xl mb-6">Choose your edition</h3>
        <FormatSelector selected={format} onChange={setFormat} />

        <div className="mt-8 flex flex-col md:flex-row items-center justify-between gap-6 pt-8 border-t border-border">
          <div className="text-muted-foreground text-sm flex items-center gap-2">
            <Truck size={16} /> Estimated delivery: {format === "digital" ? "Instant" : "5-7 business days"}
          </div>

          <div className="flex gap-3">
            {onFavorite && (
              <Button variant="outline" size="lg" className="rounded-full" onClick={onFavorite} data-testid="button-favorite-book">
                <Heart size={18} className="mr-2" /> Favorite
              </Button>
            )}
            <Button
              size="lg"
              className="rounded-full px-8 font-bold shadow-lg shadow-primary/20"
              onClick={handleOrder}
              disabled={ordering}
              data-testid="button-order-book"
            >
              {ordering ? (
                <Loader2 size={18} className="mr-2 animate-spin" />
              ) : (
                <ShoppingCart size={18} className="mr-2" />
              )}
              Order {format === "digital" ? "Digital Copy" : format === "softcover" ? "Softcover" : "Hardcover"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
