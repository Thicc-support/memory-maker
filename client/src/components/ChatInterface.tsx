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
  type?: "text" | "recipient-select" | "recipient-detail-select" | "subject-select" | "theme-select" | "format-select" | "length-select" | "age-select" | "photo-upload" | "balance-select";
  options?: any;
}

interface ChatInterfaceProps {
  onComplete: () => void;
  onUpdateDraft: (data: any) => void;
}

const themeQuestions: Record<string, string[]> = {
  "Adventure": [
    "What is the biggest challenge they have overcome?",
    "Who is their favorite sidekick or companion?",
    "If they could explore any dangerous place, where would they go?",
    "What magical item would they take on their journey?"
  ],
  "Travel": [
    "What is the most memorable place they have visited?",
    "What's a funny thing that happened on a trip?",
    "What is their favorite way to travel (plane, train, boat, etc.)?",
    "If they could teleport anywhere right now, where would it be?"
  ],
  "Exploration": [
    "What kind of things do they like to discover or investigate?",
    "If they could explore anywhere, where would it be?",
    "What tools would they bring on an expedition?",
    "What mystery would they love to solve?"
  ],
  "My Career": [
    "What is their dream job or current profession?",
    "What do they love most about their work?",
    "What is a funny workplace story they tell?",
    "If they could do any job for one day, what would it be?"
  ],
  "My Hobbies": [
    "What is their absolute favorite hobby or pastime?",
    "How did they get started with this hobby?",
    "What is their proudest achievement in this hobby?",
    "If they could turn this hobby into a superpower, what would it be?"
  ],
  "Challenges": [
    "Tell me about a time they didn't give up.",
    "What motivates them to keep going?",
    "Who helped them when things got tough?",
    "How did they celebrate their success?"
  ],
  "Missions": [
    "If they were a secret agent, what would their mission be?",
    "What is their special skill or gadget?",
    "Who is their nemesis or rival?",
    "What is the code name for their secret operation?"
  ],
  "Quests": [
    "What is the 'treasure' they are always searching for?",
    "Who helps them on their quest?",
    "What obstacles stand in their way?",
    "Where does the map lead them?"
  ],
  "Fantasy": [
    "If they had a magic power, what would it be?",
    "What kind of magical creature would be their friend?",
    "If they had a castle, what would it look like?",
    "What spell would they cast most often?"
  ],
};

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
      content: "Who will this book be given to?",
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
    subject: "",
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
  const handleSelection = (key: string, value: string, nextStep: () => void, messageIndex?: number) => {
    // Handling edits to previous choices
    if (messageIndex !== undefined && messageIndex < messages.length - 1) {
      // Slice messages up to the point of change (keeping the question)
      setMessages(prev => prev.slice(0, messageIndex + 1));
      
      // Reset relevant draft parts might be complex, but overwriting via new flow handles most.
      // We'll let the new flow dictate the state.
      
      // Clear waiting state if any
      setWaitingForInput(null);
    }

    if (value === "Someone else") {
      addMessage({ id: Date.now().toString(), role: "user", content: "Someone else" });
      simulateTyping(() => {
         addMessage({ id: Date.now().toString(), role: "assistant", content: "No problem! Who is it for? (e.g. 'My Teacher', 'Best Friend')", type: "text" });
         setWaitingForInput(key === 'subject' ? "custom_subject" : "custom_recipient");
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

    // Special logic for "A Child" in recipient -> asks for specific relationship
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
    askSubject: () => {
      addMessage({
        id: "q-subject", role: "assistant", content: "And who is this book about? (The main character)", type: "subject-select"
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
        id: "q-age", role: "assistant", content: "And how old is the recipient? This helps us tailor the reading difficulty to match their age.", type: "age-select"
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
      
      const theme = draft.theme; // Captured from closure, might be slightly risky but likely ok due to rerender. Better to access via ref if needed, but draft state updates should trigger re-render.
      // Wait, draft state updates trigger re-render of ChatInterface. But startInterview is defined inside the component function scope.
      // When handleSelection calls simulateTyping(steps.askFormat), 'steps' is from the scope where handleSelection was defined (current render).
      // So 'draft' inside 'steps' refers to the draft state of the CURRENT render.
      // But draft is updated via setDraft which is async.
      // The 'nextStep' passed to handleSelection is executed after a timeout.
      // By the time the timeout fires, a re-render has likely happened, but the closure 'steps' is still the old one from the previous render.
      // This is a classic React closure trap.
      // However, for most simple flows it's fine. But for `startInterview` which depends on `draft.theme` set several steps ago, it should be fine because `draft.theme` was set way before `startInterview` is called.
      // Actually `startInterview` is called from the PhotoUpload button onClick.
      // That onClick is created during the render where "Done Uploading" is shown.
      // At that point, `draft.theme` is definitely set. So `draft.theme` here is correct.

      const questions = themeQuestions[theme] || ["Tell me one specific funny memory involving them."];
      const question = questions[0];

      setTimeout(() => {
        addMessage({
           id: "q-interview-1", role: "assistant", content: question, type: "text"
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
      simulateTyping(steps.askSubject);
      return;
    }

    if (waitingForInput === "custom_recipient_detail") {
      setDraft(prev => ({ ...prev, recipientRelationship: input }));
      setWaitingForInput(null);
      simulateTyping(steps.askSubject);
      return;
    }

    if (waitingForInput === "custom_subject") {
      setDraft(prev => ({ ...prev, subject: input }));
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
         // Check if we have a second question for the theme
         const theme = draft.theme; // This draft might be stale if inside closure of handleSend created earlier?
         // handleSend is recreated on every render.
         // But wait, if we are in the interview loop, `draft` hasn't changed recently. So it's fine.
         
         const questions = themeQuestions[theme] || ["Tell me one specific funny memory involving them."];
         
         // Basic logic to ask the second question if we haven't asked it yet?
         // We don't track which question was asked.
         // Let's just ask the second question if it exists and we are at a certain stage.
         // Current count > 2 means we are in interview.
         // Let's assume:
         // 1. Photo upload done -> startInterview -> Ask Question 1
         // 2. User answers Q1 -> handleSend -> Ask Question 2 (if exists) or "Special message"
         
         // We need to know how many interview questions we've asked.
         // A simple hack: check the last assistant message content? Or just use a simple counter based on total messages?
         // Let's use message count.
         // Messages length will be roughly:
         // Welcome (1) + Recipient Q (1) + Ans (1) + [Detail Q+A] + Subject Q(1) + Ans(1) + Theme Q(1) + Ans(1) + Format Q(1) + Ans(1) + Length Q(1) + Ans(1) + Name Q(1) + Ans(1) + Age Q(1) + Ans(1) + Photo Q(1) + Ans("Photos uploaded!")(1) + Start Interview Intro(1) + Interview Q1(1) = ~20 messages
         
         // This is getting complicated to count. Let's just look at the last assistant question.
         const lastAssistantMsg = messages.filter(m => m.role === "assistant").pop();
         
         if (lastAssistantMsg && questions.includes(lastAssistantMsg.content)) {
            // We just asked a theme question.
            const index = questions.indexOf(lastAssistantMsg.content);
            if (index < questions.length - 1) {
               addMessage({ id: Date.now().toString(), role: "assistant", content: questions[index + 1] });
               return;
            }
         }
         
         addMessage({ id: Date.now().toString(), role: "assistant", content: "That's wonderful! Is there a special message or dedication you'd like to include?" });
         
         // Only complete after dedication
         if (lastAssistantMsg?.content.includes("special message")) {
             setTimeout(onComplete, 4000);
         }
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
          {messages.map((msg, index) => (
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
                   {["A Child", "Mom", "Dad", "Grandparent", "Aunt", "Uncle", "Family Heritage", "Someone else"].map(opt => (
                     <Button 
                        key={opt} 
                        variant="outline" 
                        onClick={() => handleSelection("recipient", opt, steps.askSubject, index)}
                        className="justify-start h-auto py-3 px-4 hover:border-primary hover:bg-primary/5 transition-all text-left whitespace-normal"
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
                        onClick={() => handleSelection("recipientRelationship", opt, steps.askSubject, index)}
                        className="justify-start h-auto py-3 px-4 hover:border-primary hover:bg-primary/5 transition-all text-left whitespace-normal"
                     >
                       {opt}
                     </Button>
                   ))}
                   <Button 
                      variant="outline" 
                      onClick={() => {
                        // For "Someone else" button in edit mode, we just trigger it like a normal selection but with index
                         if (index < messages.length - 1) {
                            setMessages(prev => prev.slice(0, index + 1));
                            setWaitingForInput(null);
                         }
                        
                        addMessage({ id: Date.now().toString(), role: "user", content: "Someone else" });
                        simulateTyping(() => {
                           addMessage({ id: Date.now().toString(), role: "assistant", content: "Who is the recipient?", type: "text" });
                           setWaitingForInput("custom_recipient_detail");
                        });
                      }}
                      className="justify-start h-auto py-3 px-4 gap-2 hover:border-primary hover:bg-primary/5 transition-all col-span-1 sm:col-span-2"
                   >
                     <HelpCircle size={16} className="text-muted-foreground" />
                     Someone else
                   </Button>
                </div>
              )}

              {msg.type === "subject-select" && (
                <div className="ml-11 mt-3 grid grid-cols-2 sm:grid-cols-3 gap-2 w-full max-w-md">
                   {["A Child", "Mom", "Dad", "Grandparent", "Aunt", "Uncle", "Family Heritage", "Someone else"].map(opt => (
                     <Button 
                        key={opt} 
                        variant="outline" 
                        onClick={() => handleSelection("subject", opt, steps.askTheme, index)}
                        className="justify-start h-auto py-3 px-4 hover:border-primary hover:bg-primary/5 transition-all text-left whitespace-normal"
                     >
                       {opt}
                     </Button>
                   ))}
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
                        onClick={() => handleSelection("theme", opt.label, steps.askFormat, index)}
                        className="justify-start h-auto py-3 px-4 gap-2 hover:border-primary hover:bg-primary/5 transition-all"
                     >
                       <opt.icon size={16} className="text-primary" />
                       {opt.label}
                     </Button>
                   ))}
                   <Button 
                      variant="outline" 
                      onClick={() => handleSelection("theme", "Something else", steps.askFormat, index)}
                      className="justify-start h-auto py-3 px-4 gap-2 hover:border-primary hover:bg-primary/5 transition-all col-span-2"
                   >
                     <HelpCircle size={16} className="text-muted-foreground" />
                     Something else
                   </Button>
                </div>
              )}

              {msg.type === "format-select" && (
                <div className="ml-11 mt-3 flex flex-col gap-2 w-full max-w-xs">
                   <div 
                      onClick={() => handleSelection("bookType", "Story Book", steps.askLength, index)}
                      className="cursor-pointer bg-white border border-border p-3 rounded-xl hover:border-primary hover:bg-primary/5 transition-all flex gap-3 items-center"
                   >
                     <div className="bg-blue-100 text-blue-600 p-2 rounded-lg"><Book size={20} /></div>
                     <div>
                       <div className="font-bold text-sm">Story Book</div>
                       <div className="text-xs text-muted-foreground">Classic narrative structure</div>
                     </div>
                   </div>
                   <div 
                      onClick={() => handleSelection("bookType", "Poem Collection", steps.askLength, index)}
                      className="cursor-pointer bg-white border border-border p-3 rounded-xl hover:border-primary hover:bg-primary/5 transition-all flex gap-3 items-center"
                   >
                     <div className="bg-purple-100 text-purple-600 p-2 rounded-lg"><Feather size={20} /></div>
                     <div>
                       <div className="font-bold text-sm">Poem Collection</div>
                       <div className="text-xs text-muted-foreground">Rhyming verses</div>
                     </div>
                   </div>
                   <div 
                      onClick={() => handleSelection("bookType", "Something else", steps.askLength, index)}
                      className="cursor-pointer bg-white border border-border p-3 rounded-xl hover:border-primary hover:bg-primary/5 transition-all flex gap-3 items-center"
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
                        onClick={() => handleSelection("bookLength", opt.label, steps.askName, index)}
                        className="cursor-pointer bg-white border border-border p-3 rounded-xl hover:border-primary hover:bg-primary/5 transition-all flex gap-3 items-center"
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
                        onClick={() => handleSelection("recipientAge", opt, steps.askPhotos, index)}
                        className="justify-start h-auto py-3 px-4 hover:border-primary hover:bg-primary/5 transition-all text-left whitespace-normal"
                     >
                       {opt}
                     </Button>
                   ))}
                   <Button 
                      variant="outline" 
                      onClick={() => {
                        // Special edit handling for custom age button
                        if (index < messages.length - 1) {
                           setMessages(prev => prev.slice(0, index + 1));
                           setWaitingForInput(null);
                        }
                        
                        addMessage({ id: Date.now().toString(), role: "user", content: "Something else" });
                        simulateTyping(() => {
                           addMessage({ id: Date.now().toString(), role: "assistant", content: "Please enter the age:", type: "text" });
                           setWaitingForInput("custom_age");
                        });
                      }}
                      className="justify-start h-auto py-3 px-4 gap-2 hover:border-primary hover:bg-primary/5 transition-all"
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