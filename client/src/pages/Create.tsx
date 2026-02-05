import { useState, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { ChatInterface } from "@/components/ChatInterface";
import { BookPreview } from "@/components/BookPreview";
import { PhotoUpload } from "@/components/PhotoUpload";
import { motion } from "framer-motion";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { ArrowRight, Book, Feather, Image as ImageIcon, AlignLeft } from "lucide-react";

export default function Create() {
  const [step, setStep] = useState<"setup" | "chat" | "generating" | "preview">("setup");
  const [params] = useLocation();
  
  // State for Book Configuration
  const [bookType, setBookType] = useState("story");
  const [textBalance, setTextBalance] = useState([50]); // 0 = Pics, 100 = Words
  const [topic, setTopic] = useState("Space Adventure");

  useEffect(() => {
    if (step === "generating") {
      const timer = setTimeout(() => setStep("preview"), 4000);
      return () => clearTimeout(timer);
    }
  }, [step]);

  return (
    <div className="min-h-screen bg-slate-50/50">
      <Navbar />
      
      <div className="container mx-auto px-6 py-12">
        
        {/* SETUP STEP (NEW) */}
        {step === "setup" && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl mx-auto"
          >
            <div className="text-center mb-10">
              <h1 className="font-heading text-4xl font-bold mb-4">Design Your Book</h1>
              <p className="text-muted-foreground text-lg">Customize the style and format before we start writing.</p>
            </div>

            <div className="bg-white rounded-3xl shadow-xl border border-border overflow-hidden">
              <div className="p-8 space-y-10">
                
                {/* 1. Book Format */}
                <div className="space-y-4">
                  <h3 className="font-heading text-xl font-bold flex items-center gap-2">
                    <span className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm">1</span>
                    Choose Format
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div 
                      onClick={() => setBookType("story")}
                      className={`cursor-pointer border-2 rounded-xl p-4 flex gap-4 items-start transition-all ${bookType === "story" ? "border-primary bg-primary/5" : "border-border hover:border-primary/30"}`}
                    >
                      <div className="p-3 bg-white rounded-lg shadow-sm text-primary">
                        <Book size={24} />
                      </div>
                      <div>
                        <h4 className="font-bold">Story Book</h4>
                        <p className="text-sm text-muted-foreground">Classic narrative structure with characters and plot.</p>
                      </div>
                    </div>

                    <div 
                      onClick={() => setBookType("poem")}
                      className={`cursor-pointer border-2 rounded-xl p-4 flex gap-4 items-start transition-all ${bookType === "poem" ? "border-primary bg-primary/5" : "border-border hover:border-primary/30"}`}
                    >
                      <div className="p-3 bg-white rounded-lg shadow-sm text-accent-foreground">
                        <Feather size={24} />
                      </div>
                      <div>
                        <h4 className="font-bold">Poem Collection</h4>
                        <p className="text-sm text-muted-foreground">Rhyming verses and lyrical storytelling.</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 2. Content Balance */}
                <div className="space-y-4">
                  <h3 className="font-heading text-xl font-bold flex items-center gap-2">
                    <span className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm">2</span>
                    Text vs. Picture Balance
                  </h3>
                  <div className="bg-slate-50 p-6 rounded-xl border border-border">
                    <div className="flex justify-between text-sm font-bold text-muted-foreground mb-4">
                      <span className="flex items-center gap-1"><ImageIcon size={16} /> More Pictures</span>
                      <span className="flex items-center gap-1">Balanced</span>
                      <span className="flex items-center gap-1">More Words <AlignLeft size={16} /></span>
                    </div>
                    <Slider 
                      value={textBalance} 
                      onValueChange={setTextBalance} 
                      max={100} 
                      step={25} 
                      className="py-4"
                    />
                    <p className="text-center text-sm text-primary font-medium mt-2">
                      {textBalance[0] < 30 ? "Visual focus with short captions." : 
                       textBalance[0] > 70 ? "Rich storytelling with fewer illustrations." : 
                       "Perfect mix of story and art."}
                    </p>
                  </div>
                </div>

                {/* 3. Personalization */}
                <div className="space-y-4">
                  <h3 className="font-heading text-xl font-bold flex items-center gap-2">
                    <span className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm">3</span>
                    Make it Personal
                  </h3>
                  <div className="grid md:grid-cols-2 gap-8">
                    <PhotoUpload 
                      label="Create an AI Avatar" 
                      description="Upload a clear photo of the main character (child, mom, etc.) to feature them in illustrations."
                    />
                    <PhotoUpload 
                      label="Cartoonize Real Photos" 
                      description="Upload real family photos to be turned into storybook illustrations included in the book."
                    />
                  </div>
                </div>

              </div>

              <div className="p-6 bg-slate-50 border-t border-border flex justify-end">
                <Button size="lg" onClick={() => setStep("chat")} className="rounded-full px-8 shadow-lg shadow-primary/20">
                  Start Interview <ArrowRight className="ml-2" />
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
                topic={topic} 
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
              <br/>
              <span className="text-sm italic opacity-70 mt-2 block">
                Applying style: {textBalance[0] < 30 ? "Heavy Illustration" : textBalance[0] > 70 ? "Text Heavy" : "Balanced"}
              </span>
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