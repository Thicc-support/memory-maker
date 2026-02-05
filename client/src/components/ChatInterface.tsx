import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sparkles, Send, User, Bot, Globe, Briefcase, Heart, Star, Book, Feather, Upload, Image as ImageIcon, HelpCircle, Map, Compass, Trophy, Target, Scroll, Clock, Hourglass } from "lucide-react";
import { PhotoUpload } from "@/components/PhotoUpload";
import { Slider } from "@/components/ui/slider";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  type?: "text" | "recipient-select" | "recipient-detail-select" | "theme-select" | "format-select" | "length-select" | "age-select" | "photo-upload" | "balance-select";
  options?: any;
}

interface ChatInterfaceProps {
  onComplete: () => void;
  onUpdateDraft: (data: any) => void;
}

export function ChatInterface({ onComplete, onUpdateDraft }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content: "Hi! I'm TaleWeaver. I'm going to help you create a magical custom book. Let's start with the most important question:",
      type: "text"
    },
    {
      id: "q1",
      role: "assistant",
      content: "Who is this book about?",
      type: "recipient-select"
    }
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [waitingForInput, setWaitingForInput] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Draft State
  const [draft, setDraft] = useState({
    recipient: "",
    recipientRelationship: "",
    theme: "",
    bookType: "",
    bookLength: "",
    recipientName: "",
    recipientAge: "",
    photos: [] as string[]
  });

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  useEffect(() => {
    onUpdateDraft(draft);
  }, [draft, onUpdateDraft]);

  const addMessage = (msg: Message) => {
    setMessages(prev => [...prev, msg]);
  };

  const simulateTyping = (callback: () => void) => {
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      callback();
    }, 1200);
  };

  // Interaction Handlers
  const handleSelection = (key: string, value: string, nextStep: () => void) => {
    if (value === "Someone else") {
      addMessage({ id: Date.now().toString(), role: "user", content: "Someone else" });
      simulateTyping(() => {
         addMessage({ id: Date.now().toString(), role: "assistant", content: "No problem! Who is it for? (e.g. 'My Teacher', 'Best Friend')", type: "text" });
         setWaitingForInput("custom_recipient");
      });
      return;
    }

    if (value === "Something else") {
      addMessage({ id: Date.now().toString(), role: "user", content: "Something else" });
      simulateTyping(() => {
         addMessage({ id: Date.now().toString(), role: "assistant", content: key === 'theme' ? "How exciting! What theme do you have in mind?" : "I see! Describe the format you'd like.", type: "text" });
         setWaitingForInput(key === 'theme' ? "custom_theme" : "custom_format");
      });
      return;
    }

    // Special logic for "A Child" -> asks for specific relationship
    if (key === "recipient" && value === "A Child") {
      setDraft(prev => ({ ...prev, [key]: value }));
      addMessage({ id: Date.now().toString(), role: "user", content: value });
      simulateTyping(steps.askRecipientDetail);
      return;
    }

    // Standard flow
    setDraft(prev => ({ ...prev, [key]: value }));
    addMessage({ id: Date.now().toString(), role: "user", content: value });
    if (waitingForInput) setWaitingForInput(null);
    simulateTyping(nextStep);
  };

  const steps = {
    askRecipientDetail: () => {
      addMessage({
        id: "q-recipient-detail", role: "assistant", content: "How special! Who is the recipient?", type: "recipient-detail-select"
      });
    },
    askTheme: () => {
      addMessage({
        id: "q-theme", role: "assistant", content: "Wonderful choice! Now, what kind of adventure should we go on?", type: "theme-select"
      });
    },
    askFormat: () => {
      addMessage({
        id: "q-format", role: "assistant", content: "Ooh, I love that theme! How should we tell this story?", type: "format-select"
      });
    },
    askLength: () => {
       addMessage({
        id: "q-length", role: "assistant", content: "Got it! How long would you like this story to be?", type: "length-select"
      });
    },
    askName: () => {
      addMessage({
        id: "q-name", role: "assistant", content: "Perfect. Now, what is the name of the person this book is for?", type: "text"
      });
      setWaitingForInput("recipient_name");
    },
    askAge: () => {
      addMessage({
        id: "q-age", role: "assistant", content: "And how old are they? This helps us tailor the reading difficulty.", type: "age-select"
      });
    },
    askPhotos: () => {
      addMessage({
        id: "q-photos", role: "assistant", content: "Almost there! To make the illustrations look just right, could you upload a photo of the main character?", type: "photo-upload"
      });
    },
    startInterview: () => {
      addMessage({
        id: "q-interview-start", role: "assistant", content: "Thanks! Now the fun part begins. I'm going to ask you a few questions to write the story.", type: "text"
      });
      setTimeout(() => {
        addMessage({
           id: "q-interview-1", role: "assistant", content: "Tell me one specific funny memory involving them.", type: "text"
        });
      }, 1500);
    }
  };

  const handleSend = () => {
    if (!input.trim()) return;
    
    addMessage({ id: Date.now().toString(), role: "user", content: input });
    setInput("");

    if (waitingForInput === "custom_recipient") {
      setDraft(prev => ({ ...prev, recipient: input }));
      setWaitingForInput(null);
      simulateTyping(steps.askTheme);
      return;
    }

    if (waitingForInput === "custom_recipient_detail") {
      setDraft(prev => ({ ...prev, recipientRelationship: input }));
      setWaitingForInput(null);
      simulateTyping(steps.askTheme);
      return;
    }

    if (waitingForInput === "custom_theme") {
      setDraft(prev => ({ ...prev, theme: input }));
      setWaitingForInput(null);
      simulateTyping(steps.askFormat);
      return;
    }

    if (waitingForInput === "custom_format") {
      setDraft(prev => ({ ...prev, bookType: input }));
      setWaitingForInput(null);
      simulateTyping(steps.askLength);
      return;
    }

    if (waitingForInput === "recipient_name") {
      setDraft(prev => ({ ...prev, recipientName: input }));
      setWaitingForInput(null);
      simulateTyping(steps.askAge);
      return;
    }
    
    if (waitingForInput === "custom_age") {
      setDraft(prev => ({ ...prev, recipientAge: input }));
      setWaitingForInput(null);
      simulateTyping(steps.askPhotos);
      return;
    }

    // Simple logic for the interview phase
    simulateTyping(() => {
      const count = messages.filter(m => m.role === "user").length;
      if (count > 2) { // Just continue interview
         addMessage({ id: Date.now().toString(), role: "assistant", content: "That's wonderful! Is there a special message or dedication you'd like to include?" });
         if (count > 4) setTimeout(onComplete, 4000);
      }
    });
  };

  return (
    <div className="flex flex-col h-[700px] max-w-2xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden border border-border">
      {/* Header */}
      <div className="bg-primary/10 p-4 border-b border-border flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white">
          <Sparkles size={20} />
        </div>
        <div>
          <h3 className="font-bold text-primary-foreground">TaleWeaver AI</h3>
          <p className="text-xs text-muted-foreground">Designing your book...</p>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50">
        <AnimatePresence>
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
            >
              <div className={`flex gap-3 max-w-[85%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                  msg.role === 'user' ? 'bg-slate-200 text-slate-600' : 'bg-primary text-white'
                }`}>
                  {msg.role === 'user' ? <User size={16} /> : <Bot size={16} />}
                </div>
                
                <div className={`p-4 rounded-2xl text-sm leading-relaxed ${
                  msg.role === 'user' 
                    ? 'bg-slate-800 text-white rounded-tr-none' 
                    : 'bg-white border border-border shadow-sm rounded-tl-none text-slate-800'
                }`}>
                  {msg.content}
                </div>
              </div>

              {/* Interactive Elements (Only show for latest assistant message) */}
              {msg.type === "recipient-select" && (
                <div className="ml-11 mt-3 grid grid-cols-2 sm:grid-cols-3 gap-2 w-full max-w-md">
                   {["Mom", "Dad", "Grandparent", "Aunt", "Uncle", "Family Heritage", "A Child", "Someone else"].map(opt => (
                     <Button 
                        key={opt} 
                        variant="outline" 
                        onClick={() => handleSelection("recipient", opt, steps.askTheme)}
                        className="justify-start h-auto py-3 px-4 hover:border-primary hover:bg-primary/5 transition-all text-left whitespace-normal"
                        disabled={messages.indexOf(msg) !== messages.length - 1 && !(msg.type === "recipient-select" && waitingForInput === "custom_recipient")} // Allow if waiting for custom recipient
                     >
                       {opt}
                     </Button>
                   ))}
                </div>
              )}

              {msg.type === "recipient-detail-select" && (
                <div className="ml-11 mt-3 grid grid-cols-2 sm:grid-cols-3 gap-2 w-full max-w-md">
                   {["Son", "Daughter", "Niece", "Nephew", "Cousin", "Grandchild"].map(opt => (
                     <Button 
                        key={opt} 
                        variant="outline" 
                        onClick={() => handleSelection("recipientRelationship", opt, steps.askTheme)}
                        className="justify-start h-auto py-3 px-4 hover:border-primary hover:bg-primary/5 transition-all text-left whitespace-normal"
                        disabled={messages.indexOf(msg) !== messages.length - 1 && !(msg.type === "recipient-detail-select" && waitingForInput === "custom_recipient_detail")}
                     >
                       {opt}
                     </Button>
                   ))}
                   <Button 
                      variant="outline" 
                      onClick={() => {
                        addMessage({ id: Date.now().toString(), role: "user", content: "Something else" });
                        simulateTyping(() => {
                           addMessage({ id: Date.now().toString(), role: "assistant", content: "Who is the recipient?", type: "text" });
                           setWaitingForInput("custom_recipient_detail");
                        });
                      }}
                      className="justify-start h-auto py-3 px-4 gap-2 hover:border-primary hover:bg-primary/5 transition-all col-span-1 sm:col-span-2"
                      disabled={messages.indexOf(msg) !== messages.length - 1 && !(msg.type === "recipient-detail-select" && waitingForInput === "custom_recipient_detail")}
                   >
                     <HelpCircle size={16} className="text-muted-foreground" />
                     Something else
                   </Button>
                </div>
              )}

              {msg.type === "theme-select" && (
                <div className="ml-11 mt-3 grid grid-cols-2 gap-2 w-full max-w-md">
                   {[
                      { id: "adventure", icon: Globe, label: "Adventure" },
                      { id: "travel", icon: Map, label: "Travel" },
                      { id: "exploration", icon: Compass, label: "Exploration" },
                      { id: "career", icon: Briefcase, label: "My Career" },
                      { id: "hobby", icon: Heart, label: "My Hobbies" },
                      { id: "challenges", icon: Trophy, label: "Challenges" },
                      { id: "missions", icon: Target, label: "Missions" },
                      { id: "quests", icon: Scroll, label: "Quests" },
                      { id: "fantasy", icon: Star, label: "Fantasy" },
                    ].map(opt => (
                     <Button 
                        key={opt.id} 
                        variant="outline" 
                        onClick={() => handleSelection("theme", opt.label, steps.askFormat)}
                        className="justify-start h-auto py-3 px-4 gap-2 hover:border-primary hover:bg-primary/5 transition-all"
                        disabled={messages.indexOf(msg) !== messages.length - 1 && !(msg.type === "theme-select" && waitingForInput === "custom_theme")}
                     >
                       <opt.icon size={16} className="text-primary" />
                       {opt.label}
                     </Button>
                   ))}
                   <Button 
                      variant="outline" 
                      onClick={() => handleSelection("theme", "Something else", steps.askFormat)}
                      className="justify-start h-auto py-3 px-4 gap-2 hover:border-primary hover:bg-primary/5 transition-all col-span-2"
                      disabled={messages.indexOf(msg) !== messages.length - 1 && !(msg.type === "theme-select" && waitingForInput === "custom_theme")}
                   >
                     <HelpCircle size={16} className="text-muted-foreground" />
                     Something else
                   </Button>
                </div>
              )}

              {msg.type === "format-select" && (
                <div className="ml-11 mt-3 flex flex-col gap-2 w-full max-w-xs">
                   <div 
                      onClick={() => handleSelection("bookType", "Story Book", steps.askLength)}
                      className={`cursor-pointer bg-white border border-border p-3 rounded-xl hover:border-primary hover:bg-primary/5 transition-all flex gap-3 items-center ${messages.indexOf(msg) !== messages.length - 1 && !(msg.type === "format-select" && waitingForInput === "custom_format") ? "pointer-events-none opacity-50" : ""}`}
                   >
                     <div className="bg-blue-100 text-blue-600 p-2 rounded-lg"><Book size={20} /></div>
                     <div>
                       <div className="font-bold text-sm">Story Book</div>
                       <div className="text-xs text-muted-foreground">Classic narrative structure</div>
                     </div>
                   </div>
                   <div 
                      onClick={() => handleSelection("bookType", "Poem Collection", steps.askLength)}
                      className={`cursor-pointer bg-white border border-border p-3 rounded-xl hover:border-primary hover:bg-primary/5 transition-all flex gap-3 items-center ${messages.indexOf(msg) !== messages.length - 1 && !(msg.type === "format-select" && waitingForInput === "custom_format") ? "pointer-events-none opacity-50" : ""}`}
                   >
                     <div className="bg-purple-100 text-purple-600 p-2 rounded-lg"><Feather size={20} /></div>
                     <div>
                       <div className="font-bold text-sm">Poem Collection</div>
                       <div className="text-xs text-muted-foreground">Rhyming verses</div>
                     </div>
                   </div>
                   <div 
                      onClick={() => handleSelection("bookType", "Something else", steps.askLength)}
                      className={`cursor-pointer bg-white border border-border p-3 rounded-xl hover:border-primary hover:bg-primary/5 transition-all flex gap-3 items-center ${messages.indexOf(msg) !== messages.length - 1 && !(msg.type === "format-select" && waitingForInput === "custom_format") ? "pointer-events-none opacity-50" : ""}`}
                   >
                     <div className="bg-slate-100 text-slate-600 p-2 rounded-lg"><HelpCircle size={20} /></div>
                     <div>
                       <div className="font-bold text-sm">Something else</div>
                       <div className="text-xs text-muted-foreground">Custom format</div>
                     </div>
                   </div>
                </div>
              )}

              {msg.type === "length-select" && (
                <div className="ml-11 mt-3 flex flex-col gap-2 w-full max-w-xs">
                   {[
                      { id: "short", icon: Clock, label: "Short & Sweet", desc: "5 minute read" },
                      { id: "standard", icon: Book, label: "Standard Story", desc: "10 minute read" },
                      { id: "epic", icon: Hourglass, label: "Epic Adventure", desc: "20 minute read" }
                   ].map(opt => (
                     <div 
                        key={opt.id}
                        onClick={() => handleSelection("bookLength", opt.label, steps.askName)}
                        className={`cursor-pointer bg-white border border-border p-3 rounded-xl hover:border-primary hover:bg-primary/5 transition-all flex gap-3 items-center ${messages.indexOf(msg) !== messages.length - 1 ? "pointer-events-none opacity-50" : ""}`}
                     >
                       <div className="bg-orange-100 text-orange-600 p-2 rounded-lg"><opt.icon size={20} /></div>
                       <div>
                         <div className="font-bold text-sm">{opt.label}</div>
                         <div className="text-xs text-muted-foreground">{opt.desc}</div>
                       </div>
                     </div>
                   ))}
                </div>
              )}

              {msg.type === "age-select" && (
                <div className="ml-11 mt-3 grid grid-cols-2 gap-2 w-full max-w-md">
                   {["0-3 years", "4-7 years", "8-12 years", "13+ years", "Adult"].map(opt => (
                     <Button 
                        key={opt} 
                        variant="outline" 
                        onClick={() => handleSelection("recipientAge", opt, steps.askPhotos)}
                        className="justify-start h-auto py-3 px-4 hover:border-primary hover:bg-primary/5 transition-all text-left whitespace-normal"
                        disabled={messages.indexOf(msg) !== messages.length - 1 && !(msg.type === "age-select" && waitingForInput === "custom_age")}
                     >
                       {opt}
                     </Button>
                   ))}
                   <Button 
                      variant="outline" 
                      onClick={() => {
                        addMessage({ id: Date.now().toString(), role: "user", content: "Something else" });
                        simulateTyping(() => {
                           addMessage({ id: Date.now().toString(), role: "assistant", content: "Please enter the age:", type: "text" });
                           setWaitingForInput("custom_age");
                        });
                      }}
                      className="justify-start h-auto py-3 px-4 gap-2 hover:border-primary hover:bg-primary/5 transition-all"
                      disabled={messages.indexOf(msg) !== messages.length - 1 && !(msg.type === "age-select" && waitingForInput === "custom_age")}
                   >
                     <HelpCircle size={16} className="text-muted-foreground" />
                     Custom Age
                   </Button>
                </div>
              )}

              {msg.type === "photo-upload" && messages.indexOf(msg) === messages.length - 1 && (
                <div className="ml-11 mt-3 w-full max-w-md bg-white p-4 rounded-xl border border-border">
                  <PhotoUpload label="Upload Photo" description="Clear face photo works best" />
                  <Button size="sm" onClick={() => {
                    addMessage({ id: Date.now().toString(), role: "user", content: "Photos uploaded!" });
                    simulateTyping(steps.startInterview);
                  }} className="mt-4 w-full rounded-full">
                    Done Uploading
                  </Button>
                </div>
              )}

            </motion.div>
          ))}
        </AnimatePresence>
        
        {isTyping && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-3">
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center shrink-0 text-white">
              <Bot size={16} />
            </div>
            <div className="bg-white border border-border shadow-sm p-4 rounded-2xl rounded-tl-none flex gap-1 items-center">
              <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
              <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
              <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
            </div>
          </motion.div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 bg-white border-t border-border">
        <form 
          onSubmit={(e) => { e.preventDefault(); handleSend(); }}
          className="flex gap-2"
        >
          <Input 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your answer here..."
            className="flex-1 rounded-full border-slate-200 focus:ring-primary bg-slate-50"
            autoFocus
            disabled={isTyping} 
          />
          <Button 
            type="submit" 
            size="icon" 
            className="rounded-full w-10 h-10 shrink-0"
            disabled={!input.trim() || isTyping}
          >
            <Send size={18} />
          </Button>
        </form>
      </div>
    </div>
  );
}