import { useState, useEffect, useRef } from "react";
import { Navbar } from "@/components/Navbar";
import { ChatInterface } from "@/components/ChatInterface";
import { BookPreview } from "@/components/BookPreview";
import { AuthModal } from "@/components/AuthModal";
import { motion, AnimatePresence } from "framer-motion";
import { Save, CheckCircle, ArrowRight, Check, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useAuth } from "@/lib/auth";
import { useSearch } from "wouter";

const BOOK_STYLES = [
  {
    id: "classic",
    title: "Classic Timeless",
    description: "Elegant leather-bound aesthetic with serif typography.",
    image: "/images/style-classic.png",
  },
  {
    id: "whimsical",
    title: "Playful & Whimsical",
    description: "Bright colors and fun illustrations perfect for kids.",
    image: "/images/style-whimsical.png",
  },
  {
    id: "modern",
    title: "Clean Modern",
    description: "Minimalist design with bold shapes and ample whitespace.",
    image: "/images/style-modern.png",
  },
  {
    id: "fantasy",
    title: "Epic Fantasy",
    description: "Magical atmosphere with dramatic lighting and detail.",
    image: "/images/style-fantasy.png",
  },
  {
    id: "family",
    title: "Family Memories",
    description: "Warm, nostalgic scrapbook style perfect for real-life adventures.",
    image: "/images/style-family.png",
  },
];

export default function Create() {
  const [step, setStep] = useState<"chat" | "style" | "generating" | "preview">("chat");
  const [showAuth, setShowAuth] = useState(false);
  const [lastSaved, setLastSaved] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [selectedStyle, setSelectedStyle] = useState<string | null>(null);
  const [draftId, setDraftId] = useState<string | null>(null);
  const [loadedDraft, setLoadedDraft] = useState<any>(null);
  const [generationError, setGenerationError] = useState<string | null>(null);
  const [generatedBook, setGeneratedBook] = useState<any>(null);
  const [generationProgress, setGenerationProgress] = useState(0);
  const [selectedProfileId, setSelectedProfileId] = useState<string | null>(null);
  const [selectedProfile, setSelectedProfile] = useState<any>(null);
  const [availableProfiles, setAvailableProfiles] = useState<any[]>([]);
  const { user } = useAuth();
  const searchString = useSearch();

  const [draftData, setDraftData] = useState<any>({});

  useEffect(() => {
    if (!user) return;
    fetch("/api/story-profiles", { credentials: "include" })
      .then(r => r.json())
      .then(setAvailableProfiles)
      .catch(() => {});
  }, [user]);

  useEffect(() => {
    const params = new URLSearchParams(searchString);
    const draftParam = params.get("draft");
    const profileParam = params.get("profile");

    if (profileParam && user) {
      setSelectedProfileId(profileParam);
      fetch(`/api/story-profiles/${profileParam}`, { credentials: "include" })
        .then(r => r.ok ? r.json() : null)
        .then(profile => {
          if (profile) {
            setSelectedProfile(profile);
            setDraftData((prev: any) => ({
              ...prev,
              recipientName: profile.name,
              recipientAge: profile.age || "",
              subject: profile.name,
            }));
          }
        })
        .catch(() => {});
    }

    if (draftParam && user) {
      setDraftId(draftParam);
      fetch(`/api/drafts/${draftParam}`, { credentials: "include" })
        .then(r => {
          if (r.ok) return r.json();
          throw new Error("Draft not found");
        })
        .then(draft => {
          setLoadedDraft(draft);
          setDraftData({
            recipient: draft.recipient,
            recipientRelationship: draft.recipientRelationship,
            subject: draft.subject,
            theme: draft.theme,
            bookType: draft.bookType,
            bookLength: draft.bookLength,
            recipientName: draft.recipientName,
            recipientAge: draft.recipientAge,
          });
          if (draft.selectedStyle) {
            setSelectedStyle(draft.selectedStyle);
          }
          if (draft.step === "style" || draft.step === "generating" || draft.step === "preview") {
            setStep("style");
          }
        })
        .catch(() => {});
    }
  }, [searchString, user]);

  useEffect(() => {
    if (!user || Object.keys(draftData).length === 0) return;

    const saveData = async () => {
      setIsSaving(true);
      try {
        const body = {
          title: draftData.recipientName ? `Book for ${draftData.recipientName}` : "Untitled Story",
          recipient: draftData.recipient,
          recipientRelationship: draftData.recipientRelationship,
          subject: draftData.subject,
          theme: draftData.theme,
          bookType: draftData.bookType,
          bookLength: draftData.bookLength,
          recipientName: draftData.recipientName,
          recipientAge: draftData.recipientAge,
          selectedStyle,
          step,
          progress: step === "chat" ? 30 : step === "style" ? 60 : 90,
          interviewAnswers: draftData.interviewAnswers || {},
          messages: draftData.messages || [],
        };

        if (draftId) {
          await fetch(`/api/drafts/${draftId}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
            credentials: "include",
          });
        } else {
          const res = await fetch("/api/drafts", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
            credentials: "include",
          });
          const created = await res.json();
          setDraftId(created.id);
        }
        setLastSaved(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
      } catch (err) {
        console.error("Save failed:", err);
      } finally {
        setIsSaving(false);
      }
    };

    const timer = setTimeout(saveData, 2000);
    return () => clearTimeout(timer);
  }, [draftData, user, selectedStyle, step]);

  const handleGenerateBook = async () => {
    setStep("generating");
    setGenerationError(null);
    setGenerationProgress(0);

    const progressInterval = setInterval(() => {
      setGenerationProgress(prev => {
        if (prev >= 90) return 90;
        return prev + Math.random() * 8;
      });
    }, 3000);

    try {
      const res = await fetch("/api/generate/book", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          draftId,
          selectedStyle: selectedStyle || "whimsical",
          recipientName: draftData.recipientName,
          recipientAge: draftData.recipientAge,
          theme: draftData.theme,
          subject: draftData.subject,
          bookType: draftData.bookType,
          interviewAnswers: draftData.interviewAnswers || {},
          messages: draftData.messages || [],
          title: draftData.recipientName ? `Book for ${draftData.recipientName}` : "Untitled Story",
          profileId: selectedProfileId,
        }),
        credentials: "include",
      });

      clearInterval(progressInterval);

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Generation failed");
      }

      const book = await res.json();
      setGeneratedBook(book);
      setGenerationProgress(100);
      setTimeout(() => setStep("preview"), 500);
    } catch (err: any) {
      clearInterval(progressInterval);
      setGenerationError(err.message || "Something went wrong during generation");
      setGenerationProgress(0);
    }
  };

  const handleFavorite = async () => {
    if (!generatedBook) return;
    try {
      await fetch("/api/favorites", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookId: generatedBook.id }),
        credentials: "include",
      });
    } catch (err) {
      console.error("Failed to favorite:", err);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/50">
      <Navbar />
      <AuthModal
        isOpen={showAuth}
        onOpenChange={setShowAuth}
        onLoginSuccess={() => {}}
      />

      <AnimatePresence>
        {user && (step === "chat" || step === "style") && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="fixed top-24 right-6 z-20 bg-white/80 backdrop-blur border border-border px-3 py-1.5 rounded-full shadow-sm flex items-center gap-2 text-xs font-medium text-muted-foreground"
          >
            {isSaving ? (
              <>
                <Save size={12} className="animate-pulse" />
                Saving...
              </>
            ) : lastSaved ? (
              <>
                <CheckCircle size={12} className="text-green-500" />
                Saved at {lastSaved}
              </>
            ) : null}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="container mx-auto px-6 py-12">
        {step === "chat" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center"
          >
            <h1 className="font-heading text-3xl font-bold mb-8 text-center" data-testid="text-create-title">Tell us your story</h1>
            <div className="w-full">
              <ChatInterface
                onComplete={() => setStep("style")}
                onUpdateDraft={setDraftData}
                initialDraft={loadedDraft}
              />
            </div>
          </motion.div>
        )}

        {step === "style" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-5xl mx-auto"
          >
            <div className="text-center mb-12">
              <h1 className="font-heading text-3xl font-bold mb-3" data-testid="text-style-title">Choose your book's style</h1>
              <p className="text-muted-foreground text-lg">Select a visual theme that best fits your story.</p>
            </div>

            {availableProfiles.length > 0 && (
              <div className="mb-8 bg-white p-6 rounded-2xl border border-border shadow-sm max-w-2xl mx-auto">
                <h3 className="font-heading font-bold text-lg mb-2">Create this book for a Story Profile?</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Select a profile so the AI remembers their personality and continues their story.
                </p>
                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={() => { setSelectedProfileId(null); setSelectedProfile(null); }}
                    className={cn(
                      "px-4 py-2 rounded-full border text-sm font-medium transition-all",
                      !selectedProfileId ? "border-primary bg-primary/10 text-primary" : "border-border hover:border-slate-300"
                    )}
                    data-testid="button-no-profile"
                  >
                    No profile
                  </button>
                  {availableProfiles.map(p => (
                    <button
                      key={p.id}
                      onClick={() => {
                        setSelectedProfileId(p.id);
                        setSelectedProfile(p);
                        if (!draftData.recipientName) {
                          setDraftData((prev: any) => ({ ...prev, recipientName: p.name, subject: p.name }));
                        }
                      }}
                      className={cn(
                        "px-4 py-2 rounded-full border text-sm font-medium transition-all",
                        selectedProfileId === p.id ? "border-primary bg-primary/10 text-primary" : "border-border hover:border-slate-300"
                      )}
                      data-testid={`button-select-profile-${p.id}`}
                    >
                      {p.name} ({p.relationship})
                      {(p.storyHistory || []).length > 0 && (
                        <span className="ml-1 text-xs opacity-70">· {(p.storyHistory || []).length} books</span>
                      )}
                    </button>
                  ))}
                </div>
                {selectedProfile && (selectedProfile.storyHistory || []).length > 0 && (
                  <p className="text-xs text-muted-foreground mt-3">
                    The AI will reference {selectedProfile.name}'s {(selectedProfile.storyHistory || []).length} previous adventure{(selectedProfile.storyHistory || []).length !== 1 ? "s" : ""} and continue their story.
                  </p>
                )}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
              {BOOK_STYLES.map((style) => (
                <div
                  key={style.id}
                  onClick={() => setSelectedStyle(style.id)}
                  data-testid={`card-style-${style.id}`}
                  className={cn(
                    "group cursor-pointer rounded-xl border-2 overflow-hidden transition-all duration-300 relative bg-white",
                    selectedStyle === style.id
                      ? "border-primary ring-4 ring-primary/10 scale-[1.02] shadow-xl"
                      : "border-transparent hover:border-slate-200 hover:shadow-lg shadow-sm"
                  )}
                >
                  <div className="aspect-[2/3] relative overflow-hidden bg-slate-100">
                    <img
                      src={style.image}
                      alt={style.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    {selectedStyle === style.id && (
                      <div className="absolute inset-0 bg-primary/20 flex items-center justify-center backdrop-blur-[1px]">
                        <div className="bg-white rounded-full p-2 shadow-lg">
                          <Check className="w-6 h-6 text-primary" strokeWidth={3} />
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="font-heading font-semibold text-lg mb-1 group-hover:text-primary transition-colors">
                      {style.title}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {style.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-center gap-4">
              <Button
                variant="outline"
                size="lg"
                onClick={() => setStep("chat")}
                data-testid="button-back-to-story"
              >
                Back to Story
              </Button>
              <Button
                size="lg"
                className="px-8"
                disabled={!selectedStyle}
                onClick={handleGenerateBook}
                data-testid="button-create-book"
              >
                Create My Book <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </div>
          </motion.div>
        )}

        {step === "generating" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center min-h-[50vh] text-center"
          >
            {generationError ? (
              <>
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-6">
                  <span className="text-2xl">😞</span>
                </div>
                <h2 className="font-heading text-2xl font-bold mb-2" data-testid="text-generation-error">Something went wrong</h2>
                <p className="text-muted-foreground max-w-md mb-6">{generationError}</p>
                <div className="flex gap-4">
                  <Button variant="outline" onClick={() => setStep("style")} data-testid="button-back-to-style">
                    Go Back
                  </Button>
                  <Button onClick={handleGenerateBook} data-testid="button-retry-generation">
                    Try Again
                  </Button>
                </div>
              </>
            ) : (
              <>
                <div className="relative w-32 h-32 mb-8">
                  <div className="absolute inset-0 border-4 border-slate-200 rounded-full"></div>
                  <div className="absolute inset-0 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-2xl font-bold text-primary">{Math.round(generationProgress)}%</span>
                  </div>
                </div>
                <h2 className="font-heading text-2xl font-bold mb-2" data-testid="text-generating">Weaving your tale...</h2>
                <p className="text-muted-foreground max-w-md mb-4">
                  Our AI is writing the story and creating custom illustrations for each page. This may take a minute or two.
                </p>
                <div className="w-64 h-2 bg-slate-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary rounded-full transition-all duration-500"
                    style={{ width: `${generationProgress}%` }}
                  />
                </div>
              </>
            )}
          </motion.div>
        )}

        {step === "preview" && generatedBook && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <BookPreview
              bookId={generatedBook.id}
              title={generatedBook.title}
              pages={generatedBook.pages}
              onFavorite={handleFavorite}
            />
          </motion.div>
        )}
      </div>
    </div>
  );
}
