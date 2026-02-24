import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookOpen, Heart, Play, Trash2, Plus } from "lucide-react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/lib/auth";
import { useEffect, useState } from "react";

interface Draft {
  id: string;
  title: string;
  theme: string | null;
  step: string;
  progress: number;
  updatedAt: string | null;
}

interface Book {
  id: string;
  title: string;
  theme: string | null;
  style: string | null;
  format: string;
  status: string;
  createdAt: string | null;
  pages: Array<{ text: string; image: string }>;
}

export default function Profile() {
  const { user, loading } = useAuth();
  const [, setLocation] = useLocation();
  const [drafts, setDrafts] = useState<Draft[]>([]);
  const [books, setBooks] = useState<Book[]>([]);

  useEffect(() => {
    if (!loading && !user) {
      setLocation("/");
      return;
    }
    if (user) {
      fetch("/api/drafts", { credentials: "include" })
        .then(r => r.json())
        .then(setDrafts)
        .catch(() => {});
      fetch("/api/books", { credentials: "include" })
        .then(r => r.json())
        .then(setBooks)
        .catch(() => {});
    }
  }, [user, loading, setLocation]);

  const handleDeleteDraft = async (id: string) => {
    await fetch(`/api/drafts/${id}`, { method: "DELETE", credentials: "include" });
    setDrafts(prev => prev.filter(d => d.id !== id));
  };

  if (loading) return null;
  if (!user) return null;

  const initials = user.name.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase();

  return (
    <div className="min-h-screen bg-slate-50/50">
      <Navbar />
      
      <div className="container mx-auto px-6 py-12">
        <div className="flex flex-col md:flex-row items-center gap-8 mb-12 bg-white p-8 rounded-3xl shadow-sm border border-border">
          <Avatar className="w-24 h-24 border-4 border-white shadow-lg">
            <AvatarFallback className="text-2xl font-bold bg-primary/10 text-primary">{initials}</AvatarFallback>
          </Avatar>
          
          <div className="flex-1 text-center md:text-left">
            <h1 className="font-heading text-3xl font-bold mb-2" data-testid="text-profile-name">{user.name}</h1>
            <p className="text-muted-foreground mb-4" data-testid="text-profile-email">{user.email}</p>
            <p className="text-sm text-muted-foreground">{books.length} Books Created · {drafts.length} Drafts</p>
          </div>

          <Link href="/create">
            <Button className="rounded-full shadow-lg shadow-primary/20" data-testid="button-create-new">
              <Plus size={16} className="mr-2" /> Create New Story
            </Button>
          </Link>
        </div>

        <Tabs defaultValue="books" className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-3 mb-8 bg-white border border-border p-1 rounded-full mx-auto md:mx-0">
            <TabsTrigger value="books" className="rounded-full">My Books</TabsTrigger>
            <TabsTrigger value="drafts" className="rounded-full">Drafts</TabsTrigger>
            <TabsTrigger value="favorites" className="rounded-full">Favorites</TabsTrigger>
          </TabsList>
          
          <TabsContent value="books" className="mt-0">
            {books.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-dashed border-border">
                <BookOpen size={48} className="text-muted-foreground mb-4 opacity-50" />
                <h3 className="font-heading text-xl font-bold mb-2">No books yet</h3>
                <p className="text-muted-foreground mb-6">Create your first story to see it here!</p>
                <Link href="/create">
                  <Button className="rounded-full">Create a Book</Button>
                </Link>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {books.map(book => (
                  <div key={book.id} className="bg-white p-6 rounded-2xl border border-border shadow-sm">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                        <BookOpen size={24} />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-heading font-bold">{book.title}</h3>
                        <p className="text-xs text-muted-foreground">{book.theme} · {book.format}</p>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground">{book.pages.length} pages</p>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="drafts">
            {drafts.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-dashed border-border">
                <BookOpen size={48} className="text-muted-foreground mb-4 opacity-50" />
                <h3 className="font-heading text-xl font-bold mb-2">No drafts yet</h3>
                <p className="text-muted-foreground">Start creating a story and your progress will be saved here.</p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 gap-6">
                {drafts.map(draft => (
                  <div key={draft.id} className="bg-white p-6 rounded-2xl border border-border shadow-sm flex gap-4 items-center">
                    <div className="w-16 h-16 rounded-lg bg-primary/10 flex items-center justify-center text-primary shrink-0">
                      <BookOpen size={28} />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <h3 className="font-heading text-lg font-bold">{draft.title}</h3>
                        <span className="text-xs text-muted-foreground bg-slate-100 px-2 py-1 rounded-full">{draft.progress}%</span>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">{draft.step} · {draft.theme || "No theme"}</p>
                      <div className="flex gap-2">
                        <Link href={`/create?draft=${draft.id}`}>
                          <Button size="sm" className="rounded-full h-8 text-xs">
                            <Play size={12} className="mr-1" /> Continue
                          </Button>
                        </Link>
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          className="rounded-full h-8 w-8 p-0 text-muted-foreground hover:text-destructive"
                          onClick={() => handleDeleteDraft(draft.id)}
                        >
                          <Trash2 size={14} />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="favorites">
            <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-dashed border-border">
              <Heart size={48} className="text-muted-foreground mb-4 opacity-50" />
              <h3 className="font-heading text-xl font-bold mb-2">Save your favorite themes</h3>
              <p className="text-muted-foreground">Bookmark themes to use them later.</p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
