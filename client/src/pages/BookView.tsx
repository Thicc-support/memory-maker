import { useEffect, useState } from "react";
import { useParams } from "wouter";
import { Navbar } from "@/components/Navbar";
import { BookPreview } from "@/components/BookPreview";
import { useAuth } from "@/lib/auth";
import { Loader2 } from "lucide-react";

interface Book {
  id: string;
  title: string;
  pages: Array<{ text: string; image: string }>;
}

export default function BookView() {
  const params = useParams<{ id: string }>();
  const { user, loading: authLoading } = useAuth();
  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      setLoading(false);
      return;
    }
    fetch(`/api/books/${params.id}`, { credentials: "include" })
      .then(r => {
        if (r.ok) return r.json();
        throw new Error("Not found");
      })
      .then(setBook)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [params.id, user, authLoading]);

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-slate-50/50">
        <Navbar />
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader2 className="animate-spin text-primary" size={32} />
        </div>
      </div>
    );
  }

  if (!book) {
    return (
      <div className="min-h-screen bg-slate-50/50">
        <Navbar />
        <div className="flex items-center justify-center min-h-[60vh]">
          <p className="text-muted-foreground">Book not found</p>
        </div>
      </div>
    );
  }

  const handleFavorite = async () => {
    try {
      await fetch("/api/favorites", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookId: book.id }),
        credentials: "include",
      });
    } catch (err) {
      console.error("Failed to favorite:", err);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/50">
      <Navbar />
      <div className="container mx-auto px-6 py-12">
        <BookPreview
          bookId={book.id}
          title={book.title}
          pages={book.pages}
          onFavorite={handleFavorite}
        />
      </div>
    </div>
  );
}
