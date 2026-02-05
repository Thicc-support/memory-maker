import { useState, useEffect, useRef } from "react";
import { Navbar } from "@/components/Navbar";
import { ChatInterface } from "@/components/ChatInterface";
import { BookPreview } from "@/components/BookPreview";
import { PhotoUpload } from "@/components/PhotoUpload";
import { AuthModal } from "@/components/AuthModal";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { 
  ArrowRight, Book, Feather, Image as ImageIcon, 
  AlignLeft, Plus, Briefcase, Heart, Globe, Star, Save, CheckCircle
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function Create() {
  const [step, setStep] = useState<"setup" | "chat" | "generating" | "preview">("setup");
  const [showAuth, setShowAuth] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [lastSaved, setLastSaved] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  
  // Book Configuration State
  const [bookType, setBookType] = useState("story");
  const [textBalance, setTextBalance] = useState([50]);
  const [theme, setTheme] = useState("adventure");
  
  // Custom Content State
  const [customInfo, setCustomInfo] = useState("");
  const [customQuestions, setCustomQuestions] = useState<string[]>([]);
  const [newQuestion, setNewQuestion] = useState("");

  // Refs for Auto-Save
  const draftDataRef = useRef({
    bookType,
    textBalance,
    theme,
    customInfo,
    customQuestions
  });

  // Update ref whenever state changes
  useEffect(() => {
    draftDataRef.current = {
      bookType,
      textBalance,
      theme,
      customInfo,
      customQuestions
    };
  }, [bookType, textBalance, theme, customInfo, customQuestions]);

  useEffect(() => {
    // Check auth status mock
    const user = localStorage.getItem("user");
    if (user) setIsAuthenticated(true);

    if (step === "generating") {
      const timer = setTimeout(() => setStep("preview"), 4000);
      return () => clearTimeout(timer);
    }
  }, [step]);

  // Simulated Auto-Save Logic (Interval based - 15 seconds)
  useEffect(() => {
    if (!isAuthenticated) return;

    const intervalId = setInterval(async () => {
      setIsSaving(true);
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const currentData = {
        ...draftDataRef.current,
        updatedAt: new Date().toISOString()
      };
      
      localStorage.setItem("currentDraft", JSON.stringify(currentData));
      
      setLastSaved(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
      setIsSaving(false);
    }, 15000); // 15 seconds

    return () => clearInterval(intervalId);

  }, [isAuthenticated]); // Only re-run if auth status changes

  const handleStart = () => {
    if (!isAuthenticated) {
      setShowAuth(true);
    } else {
      setStep("chat");
    }
  };

  const addQuestion = () => {
    if (newQuestion.trim()) {
      setCustomQuestions([...customQuestions, newQuestion]);
      setNewQuestion("");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/50">
      <Navbar />
      <AuthModal 
        isOpen={showAuth} 
        onOpenChange={setShowAuth} 
        onLoginSuccess={() => {
          setIsAuthenticated(true);
          setStep("chat");
        }} 
      />
      
      {/* Auto-Save Indicator */}
      <AnimatePresence>
        {isAuthenticated && (step === "setup" || step === "chat") && (
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
        
        {step === "setup" && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl mx-auto"
          >
            <div className="text-center mb-10">
              <h1 className="font-heading text-4xl font-bold mb-4">Design Your Book</h1>
              <p className="text-muted-foreground text-lg">Customize every detail before we start writing.</p>
            </div>

            <div className="bg-white rounded-3xl shadow-xl border border-border overflow-hidden">
              <div className="p-8 space-y-12">
                
                {/* 1. Theme Selection */}
                <div className="space-y-4">
                  <h3 className="font-heading text-xl font-bold flex items-center gap-2">
                    <span className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm">1</span>
                    Choose a Theme
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                      { id: "adventure", icon: Globe, label: "Adventure" },
                      { id: "career", icon: Briefcase, label: "My Career" },
                      { id: "hobby", icon: Heart, label: "My Hobbies" },
                      { id: "fantasy", icon: Star, label: "Fantasy" },
                    ].map((t) => (
                      <div 
                        key={t.id}
                        onClick={() => setTheme(t.id)}
                        className={`cursor-pointer border-2 rounded-xl p-4 flex flex-col items-center gap-3 text-center transition-all ${theme === t.id ? "border-primary bg-primary/5" : "border-border hover:border-primary/30"}`}
                      >
                        <div className={`p-3 rounded-full ${theme === t.id ? "bg-primary text-white" : "bg-slate-100 text-slate-500"}`}>
                          <t.icon size={24} />
                        </div>
                        <span className="font-bold text-sm">{t.label}</span>
                      </div>
                    ))}
                  </div>

                  {theme === "career" && (
                    <Input placeholder="e.g. Doctor, Firefighter, Software Engineer..." className="mt-2" />
                  )}
                  {theme === "hobby" && (
                     <Input placeholder="e.g. Gardening, Painting, Surfing..." className="mt-2" />
                  )}
                </div>

                {/* 2. Format & Balance */}
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <h3 className="font-heading text-xl font-bold flex items-center gap-2">
                      <span className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm">2</span>
                      Book Format
                    </h3>
                    <div className="flex flex-col gap-3">
                      <div 
                        onClick={() => setBookType("story")}
                        className={`cursor-pointer border-2 rounded-xl p-3 flex gap-3 items-center transition-all ${bookType === "story" ? "border-primary bg-primary/5" : "border-border hover:border-primary/30"}`}
                      >
                        <Book size={20} className="text-primary" />
                        <div>
                          <h4 className="font-bold text-sm">Story Book</h4>
                          <p className="text-xs text-muted-foreground">Classic narrative structure.</p>
                        </div>
                      </div>
                      <div 
                        onClick={() => setBookType("poem")}
                        className={`cursor-pointer border-2 rounded-xl p-3 flex gap-3 items-center transition-all ${bookType === "poem" ? "border-primary bg-primary/5" : "border-border hover:border-primary/30"}`}
                      >
                        <Feather size={20} className="text-accent-foreground" />
                        <div>
                          <h4 className="font-bold text-sm">Poem Collection</h4>
                          <p className="text-xs text-muted-foreground">Rhyming verses.</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="font-heading text-xl font-bold flex items-center gap-2">
                      <span className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm">3</span>
                      Visual Balance
                    </h3>
                    <div className="bg-slate-50 p-6 rounded-xl border border-border h-full flex flex-col justify-center">
                      <div className="flex justify-between text-xs font-bold text-muted-foreground mb-4">
                        <span>More Pics</span>
                        <span>Balanced</span>
                        <span>More Text</span>
                      </div>
                      <Slider 
                        value={textBalance} 
                        onValueChange={setTextBalance} 
                        max={100} 
                        step={25} 
                      />
                    </div>
                  </div>
                </div>

                {/* 3. Custom Info & Questions */}
                <div className="space-y-4">
                  <h3 className="font-heading text-xl font-bold flex items-center gap-2">
                    <span className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm">4</span>
                    Add Your Details
                  </h3>
                  
                  <div className="space-y-2">
                    <Label>Specific Details (Optional)</Label>
                    <Textarea 
                      placeholder="Add any specific names, dates, or memories you definitely want included..."
                      value={customInfo}
                      onChange={(e) => setCustomInfo(e.target.value)}
                      className="bg-slate-50"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Add Your Own Interview Questions (Optional)</Label>
                    <div className="flex gap-2">
                      <Input 
                        placeholder="e.g. What was your favorite toy?" 
                        value={newQuestion}
                        onChange={(e) => setNewQuestion(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && addQuestion()}
                      />
                      <Button variant="outline" onClick={addQuestion} type="button">
                        <Plus size={18} />
                      </Button>
                    </div>
                    
                    {customQuestions.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-2">
                        {customQuestions.map((q, i) => (
                          <div key={i} className="bg-secondary/50 text-secondary-foreground text-xs px-3 py-1 rounded-full flex items-center gap-2">
                            {q}
                            <button onClick={() => setCustomQuestions(customQuestions.filter((_, idx) => idx !== i))} className="hover:text-red-500">×</button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* 4. Photos */}
                <div className="space-y-4">
                  <h3 className="font-heading text-xl font-bold flex items-center gap-2">
                    <span className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm">5</span>
                    Photos
                  </h3>
                  <div className="grid md:grid-cols-2 gap-8">
                    <PhotoUpload 
                      label="Main Character Avatar" 
                      description="Upload photo for AI avatar generation."
                    />
                    <PhotoUpload 
                      label="Story Illustrations" 
                      description="Photos to cartoonize for the book."
                    />
                  </div>
                </div>

              </div>

              <div className="p-6 bg-slate-50 border-t border-border flex justify-end items-center gap-4">
                {!isAuthenticated && (
                  <span className="text-sm text-muted-foreground">
                    You'll be asked to create an account to save your draft.
                  </span>
                )}
                <Button size="lg" onClick={handleStart} className="rounded-full px-8 shadow-lg shadow-primary/20">
                  {isAuthenticated ? "Start Interview" : "Save & Start"} <ArrowRight className="ml-2" />
                </Button>
              </div>
            </div>
          </motion.div>
        )}

        {step === "chat" && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center"
          >
            <h1 className="font-heading text-3xl font-bold mb-8 text-center">Tell us your story</h1>
            <div className="w-full">
              <ChatInterface 
                topic={theme} 
                onComplete={() => setStep("generating")} 
              />
            </div>
          </motion.div>
        )}

        {step === "generating" && (
          <div className="flex flex-col items-center justify-center min-h-[50vh] text-center">
            <div className="relative w-32 h-32 mb-8">
              <div className="absolute inset-0 border-4 border-slate-200 rounded-full"></div>
              <div className="absolute inset-0 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
              <div className="absolute inset-0 flex items-center justify-center animate-pulse">
                <span className="text-4xl">✨</span>
              </div>
            </div>
            <h2 className="font-heading text-2xl font-bold mb-2">Weaving your {bookType}...</h2>
            <p className="text-muted-foreground max-w-md">
              Our AI elves are writing the text, drawing the pictures, and binding the magic together.
            </p>
          </div>
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