import { useState, useEffect, useRef } from "react";
import { Navbar } from "@/components/Navbar";
import { ChatInterface } from "@/components/ChatInterface";
import { BookPreview } from "@/components/BookPreview";
import { AuthModal } from "@/components/AuthModal";
import { motion, AnimatePresence } from "framer-motion";
import { Save, CheckCircle, ArrowRight, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useAuth } from "@/lib/auth";

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
  const { user } = useAuth();
  
  const [draftData, setDraftData] = useState<any>({});

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

  return (
    <div className="min-h-screen bg-slate-50/50">
      <Navbar />
      <AuthModal 
        isOpen={showAuth} 
        onOpenChange={setShowAuth} 
        onLoginSuccess={() => {}} 
      />
      
      {/* Auto-Save Indicator */}
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
            ) : (
              <>
                <CheckCircle size={12} className="text-green-500" />
                Saved at {lastSaved}
              </>
            )}
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
            <h1 className="font-heading text-3xl font-bold mb-8 text-center">Tell us your story</h1>
            <div className="w-full">
              <ChatInterface 
                onComplete={() => setStep("style")} 
                onUpdateDraft={setDraftData}
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
              <h1 className="font-heading text-3xl font-bold mb-3">Choose your book's style</h1>
              <p className="text-muted-foreground text-lg">Select a visual theme that best fits your story.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
              {BOOK_STYLES.map((style) => (
                <div 
                  key={style.id}
                  onClick={() => setSelectedStyle(style.id)}
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
              >
                Back to Story
              </Button>
              <Button 
                size="lg"
                className="px-8"
                disabled={!selectedStyle}
                onClick={() => setStep("generating")}
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
             onAnimationComplete={() => setTimeout(() => setStep("preview"), 4000)}
             className="flex flex-col items-center justify-center min-h-[50vh] text-center"
          >
            <div className="relative w-32 h-32 mb-8">
              <div className="absolute inset-0 border-4 border-slate-200 rounded-full"></div>
              <div className="absolute inset-0 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
              <div className="absolute inset-0 flex items-center justify-center animate-pulse">
                <span className="text-4xl">✨</span>
              </div>
            </div>
            <h2 className="font-heading text-2xl font-bold mb-2">Weaving your tale...</h2>
            <p className="text-muted-foreground max-w-md">
              Our AI elves are writing the text, drawing the pictures, and binding the magic together.
            </p>
          </motion.div>
        )}

        {step === "preview" && (
           <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
           >
             <BookPreview />
           </motion.div>
        )}
      </div>
    </div>
  );
}