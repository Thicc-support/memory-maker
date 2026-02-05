import { useState, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { ChatInterface } from "@/components/ChatInterface";
import { BookPreview } from "@/components/BookPreview";
import { AuthModal } from "@/components/AuthModal";
import { motion, AnimatePresence } from "framer-motion";
import { Save, CheckCircle } from "lucide-react";

export default function Create() {
  const [step, setStep] = useState<"chat" | "generating" | "preview">("chat");
  const [showAuth, setShowAuth] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [lastSaved, setLastSaved] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  
  // Draft Data State (Managed by ChatInterface now)
  const [draftData, setDraftData] = useState<any>({});

  useEffect(() => {
    // Check auth status mock
    const user = localStorage.getItem("user");
    if (user) setIsAuthenticated(true);
  }, []);

  // Auto-Save Logic
  useEffect(() => {
    if (!isAuthenticated || Object.keys(draftData).length === 0) return;

    const saveData = async () => {
      setIsSaving(true);
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const currentData = {
        ...draftData,
        updatedAt: new Date().toISOString()
      };
      
      localStorage.setItem("currentDraft", JSON.stringify(currentData));
      setLastSaved(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
      setIsSaving(false);
    };

    const timer = setTimeout(saveData, 2000);
    return () => clearTimeout(timer);
  }, [draftData, isAuthenticated]);

  return (
    <div className="min-h-screen bg-slate-50/50">
      <Navbar />
      <AuthModal 
        isOpen={showAuth} 
        onOpenChange={setShowAuth} 
        onLoginSuccess={() => setIsAuthenticated(true)} 
      />
      
      {/* Auto-Save Indicator */}
      <AnimatePresence>
        {isAuthenticated && step === "chat" && (
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
                onComplete={() => setStep("generating")} 
                onUpdateDraft={setDraftData}
              />
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