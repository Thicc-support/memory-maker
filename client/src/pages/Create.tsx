import { useState, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { ChatInterface } from "@/components/ChatInterface";
import { BookPreview } from "@/components/BookPreview";
import { motion } from "framer-motion";
import { useLocation } from "wouter";

export default function Create() {
  const [step, setStep] = useState<"select" | "chat" | "generating" | "preview">("chat");
  const [params] = useLocation();
  
  // In a real app we'd parse the query param for the template
  const topic = "Space Adventure"; 

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
            <h2 className="font-heading text-2xl font-bold mb-2">Weaving your tale...</h2>
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