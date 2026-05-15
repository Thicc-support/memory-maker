import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Sparkles, Send, User, Bot, Globe, Briefcase, Heart, Star, Book, Feather, Upload, Image as ImageIcon, HelpCircle, Map, Compass, Trophy, Target, Scroll, Clock, Hourglass } from "lucide-react";
import { PhotoUpload } from "@/components/PhotoUpload";
import { Slider } from "@/components/ui/slider";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  type?: "text" | "recipient-select" | "recipient-detail-select" | "subject-select" | "theme-select" | "format-select" | "length-select" | "age-select" | "title-select" | "cover-mood-select" | "cover-setting-select" | "photo-upload" | "balance-select";
  options?: any;
}

interface ChatInterfaceProps {
  onComplete: () => void;
  onUpdateDraft: (data: any) => void;
  initialDraft?: any;
}

const themeQuestions: Record<string, string[]> = {
  "Career Story": [
    "What kind of work, career, or calling is this person known for?",
    "What moment from their work life would make a child proud or excited to read about?",
    "What did this person teach others through their work?",
    "What feeling should the child have about this person by the end of the book?"
  ],
  "Military / Service": [
    "What branch, role, or kind of service should the story honor?",
    "What place, uniform, object, or memory should be included?",
    "What values did this person show — courage, sacrifice, loyalty, leadership, or something else?",
    "How should we explain their service in a child-friendly way?"
  ],
  "Travel Adventure": [
    "Where did this adventure happen?",
    "What was the most memorable place, meal, person, or surprise from the trip?",
    "Who was there, and what made the trip special?",
    "What should the child learn or feel from this adventure?"
  ],
  "Family Adventure": [
    "What family adventure or tradition should this book be about?",
    "Who was there, and what role did each person play?",
    "What funny, sweet, or unforgettable moment should be included?",
    "What makes this family special?"
  ],
  "Childhood Memories": [
    "Where did this person grow up, and what was life like there?",
    "What childhood memory should become a scene in the book?",
    "Who helped shape them when they were young?",
    "What lesson from their childhood should be passed down?"
  ],
  "Life Lessons": [
    "What lesson or value should this story pass down?",
    "What real moment shows that lesson best?",
    "Who helped this person become who they are?",
    "What words of wisdom should the child remember?"
  ],
  "Love Story": [
    "Who is this love story about?",
    "How did they meet or become close?",
    "What small details make their relationship special?",
    "How should this love story be told for a child?"
  ],
  "Pet Story": [
    "What is the pet’s name and personality?",
    "What funny or sweet memory with the pet should be included?",
    "Who is the pet closest to?",
    "What adventure should the pet go on in the book?"
  ],
  "Big Achievement": [
    "What achievement should this book celebrate?",
    "What challenge did they have to overcome?",
    "Who supported them along the way?",
    "How should the ending celebrate their hard work?"
  ],
};

export function ChatInterface({ onComplete, onUpdateDraft, initialDraft }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content: "Hi! I'm TaleWeaver. I'm going to help you turn a real person, memory, trip, career, or family story into a magical children's book. Let's start with the most important question:",
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
  
  const [draft, setDraft] = useState({
    recipient: "",
    recipientRelationship: "",
    subject: "",
    theme: "",
    bookType: "",
    bookLength: "",
    recipientName: "",
    recipientAge: "",
    title: "",
    coverSubject: "",
    coverMood: "",
    coverSetting: "",
    photos: [] as string[],
    interviewAnswers: {} as Record<string, string>,
    messages: [] as any[],
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
        id: "q-subject", role: "assistant", content: "Who or what is this book mainly about?", type: "subject-select"
      });
    },
    askTheme: () => {
      addMessage({
        id: "q-theme", role: "assistant", content: "Wonderful choice! What kind of real-life story should this become?", type: "theme-select"
      });
    },
    askFormat: () => {
      addMessage({
        id: "q-format", role: "assistant", content: "I love that direction. How should we tell this story?", type: "format-select"
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
    askTitle: () => {
      addMessage({
        id: "q-title", role: "assistant", content: "What title do you like best for the book? You can pick one or write your own.", type: "title-select"
      });
    },
    askCoverSubject: () => {
      addMessage({
        id: "q-cover-subject", role: "assistant", content: "Now let’s design the cover. What should be on the cover? For example: the child with Grandpa under an oak tree, the family pet, a magical doorway, or a favorite memory scene.", type: "text"
      });
      setWaitingForInput("cover_subject");
    },
    askCoverMood: () => {
      addMessage({
        id: "q-cover-mood", role: "assistant", content: "What feeling should the cover have?", type: "cover-mood-select"
      });
    },
    askCoverSetting: () => {
      addMessage({
        id: "q-cover-setting", role: "assistant", content: "What background or setting should the cover show?", type: "cover-setting-select"
      });
    },
    askPhotos: () => {
      addMessage({
        id: "q-photos", role: "assistant", content: "Almost there! Upload any helpful photos if you have them — the person, family, places, uniforms, travel photos, pets, or meaningful objects. These are references for the storybook, not the whole product.", type: "photo-upload"
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
      simulateTyping(steps.askTitle);
      return;
    }

    if (waitingForInput === "custom_title") {
      setDraft(prev => ({ ...prev, title: input }));
      setWaitingForInput(null);
      simulateTyping(steps.askCoverSubject);
      return;
    }

    if (waitingForInput === "cover_subject") {
      setDraft(prev => ({ ...prev, coverSubject: input }));
      setWaitingForInput(null);
      simulateTyping(steps.askCoverMood);
      return;
    }

    if (waitingForInput === "custom_cover_setting") {
      setDraft(prev => ({ ...prev, coverSetting: input }));
      setWaitingForInput(null);
      simulateTyping(steps.askPhotos);
      return;
    }

    const userAnswer = input;
    simulateTyping(() => {
      const theme = draft.theme;
      const questions = themeQuestions[theme] || ["Tell me one specific funny memory involving them."];
      const lastAssistantMsg = messages.filter(m => m.role === "assistant").pop();

      if (lastAssistantMsg) {
        setDraft(prev => ({
          ...prev,
          interviewAnswers: { ...prev.interviewAnswers, [lastAssistantMsg.content]: userAnswer },
          messages: [...messages, { id: Date.now().toString(), role: "user", content: userAnswer }],
        }));
      }

      if (lastAssistantMsg && questions.includes(lastAssistantMsg.content)) {
        const index = questions.indexOf(lastAssistantMsg.content);
        if (index < questions.length - 1) {
          addMessage({ id: Date.now().toString(), role: "assistant", content: questions[index + 1] });
          return;
        }
      }

      if (lastAssistantMsg?.content.includes("special message")) {
        addMessage({ id: Date.now().toString(), role: "assistant", content: "Perfect! I have everything I need to create your book. Click the button below to continue to style selection!" });
        setTimeout(onComplete, 2000);
        return;
      }

      addMessage({ id: Date.now().toString(), role: "assistant", content: "That's wonderful! Is there a special message or dedication you'd like to include?" });
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
                   {["A Child", "Mom", "Dad", "Grandparent", "Aunt", "Uncle", "The Whole Family", "Family Heritage", "A Pet", "Someone else"].map(opt => (
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
                      { id: "career", icon: Briefcase, label: "Career Story" },
                      { id: "service", icon: Star, label: "Military / Service" },
                      { id: "travel", icon: Map, label: "Travel Adventure" },
                      { id: "family", icon: Heart, label: "Family Adventure" },
                      { id: "childhood", icon: Compass, label: "Childhood Memories" },
                      { id: "lessons", icon: Scroll, label: "Life Lessons" },
                      { id: "love", icon: Heart, label: "Love Story" },
                      { id: "pet", icon: Target, label: "Pet Story" },
                      { id: "achievement", icon: Trophy, label: "Big Achievement" },
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
                      onClick={() => handleSelection("bookType", "Storybook", steps.askLength, index)}
                      className="cursor-pointer bg-white border border-border p-3 rounded-xl hover:border-primary hover:bg-primary/5 transition-all flex gap-3 items-center"
                   >
                     <div className="bg-blue-100 text-blue-600 p-2 rounded-lg"><Book size={20} /></div>
                     <div>
                       <div className="font-bold text-sm">Storybook</div>
                       <div className="text-xs text-muted-foreground">A warm children’s story based on real memories</div>
                     </div>
                   </div>
                   <div 
                      onClick={() => handleSelection("bookType", "Rhyming Story", steps.askLength, index)}
                      className="cursor-pointer bg-white border border-border p-3 rounded-xl hover:border-primary hover:bg-primary/5 transition-all flex gap-3 items-center"
                   >
                     <div className="bg-purple-100 text-purple-600 p-2 rounded-lg"><Feather size={20} /></div>
                     <div>
                       <div className="font-bold text-sm">Rhyming Story</div>
                       <div className="text-xs text-muted-foreground">A poem-like story with gentle rhythm</div>
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
                      { id: "mini", icon: Clock, label: "Mini Keepsake", desc: "10 pages · best for toddlers or simple gifts" },
                      { id: "standard", icon: Book, label: "Standard Story", desc: "16 pages · best starting point" },
                      { id: "premium", icon: Hourglass, label: "Premium Keepsake", desc: "24 pages · deeper story for older kids or family legacy" }
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
                        onClick={() => handleSelection("recipientAge", opt, steps.askTitle, index)}
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

              {msg.type === "title-select" && (
                <div className="ml-11 mt-3 flex flex-col gap-2 w-full max-w-md">
                   {[
                      `${draft.recipientName || "My Child"}'s Magical Memory`,
                      `The Day ${draft.recipientName || "We"} Became the Hero`,
                      `A Story for ${draft.recipientName || "Someone Special"}`,
                   ].map(opt => (
                     <div
                        key={opt}
                        onClick={() => handleSelection("title", opt, steps.askCoverSubject, index)}
                        className="cursor-pointer bg-white border border-border p-3 rounded-xl hover:border-primary hover:bg-primary/5 transition-all"
                     >
                       <div className="font-bold text-sm">{opt}</div>
                       <div className="text-xs text-muted-foreground">Use this as the book title</div>
                     </div>
                   ))}
                   <Button
                      variant="outline"
                      onClick={() => {
                        addMessage({ id: Date.now().toString(), role: "user", content: "I want to write my own title" });
                        simulateTyping(() => {
                          addMessage({ id: Date.now().toString(), role: "assistant", content: "Great — what should the title be?", type: "text" });
                          setWaitingForInput("custom_title");
                        });
                      }}
                      className="justify-start h-auto py-3 px-4 gap-2 hover:border-primary hover:bg-primary/5 transition-all"
                   >
                     <HelpCircle size={16} className="text-muted-foreground" />
                     Write my own title
                   </Button>
                </div>
              )}

              {msg.type === "cover-mood-select" && (
                <div className="ml-11 mt-3 grid grid-cols-2 gap-2 w-full max-w-md">
                   {["Warm and cozy", "Magical and whimsical", "Adventurous", "Funny and playful", "Classic storybook", "Emotional keepsake"].map(opt => (
                     <Button
                        key={opt}
                        variant="outline"
                        onClick={() => handleSelection("coverMood", opt, steps.askCoverSetting, index)}
                        className="justify-start h-auto py-3 px-4 hover:border-primary hover:bg-primary/5 transition-all text-left whitespace-normal"
                     >
                       {opt}
                     </Button>
                   ))}
                </div>
              )}

              {msg.type === "cover-setting-select" && (
                <div className="ml-11 mt-3 grid grid-cols-2 gap-2 w-full max-w-md">
                   {["Bedroom / bedtime", "Forest", "Beach", "Backyard", "Grandparents' house", "Fantasy world", "Let AI decide"].map(opt => (
                     <Button
                        key={opt}
                        variant="outline"
                        onClick={() => handleSelection("coverSetting", opt, steps.askPhotos, index)}
                        className="justify-start h-auto py-3 px-4 hover:border-primary hover:bg-primary/5 transition-all text-left whitespace-normal"
                     >
                       {opt}
                     </Button>
                   ))}
                   <Button
                      variant="outline"
                      onClick={() => {
                        addMessage({ id: Date.now().toString(), role: "user", content: "Something else" });
                        simulateTyping(() => {
                          addMessage({ id: Date.now().toString(), role: "assistant", content: "What setting should the cover show?", type: "text" });
                          setWaitingForInput("custom_cover_setting");
                        });
                      }}
                      className="justify-start h-auto py-3 px-4 gap-2 hover:border-primary hover:bg-primary/5 transition-all"
                   >
                     <HelpCircle size={16} className="text-muted-foreground" />
                     Something else
                   </Button>
                </div>
              )}

              {msg.type === "photo-upload" && messages.indexOf(msg) === messages.length - 1 && (
                <div className="ml-11 mt-3 w-full max-w-md bg-white p-4 rounded-xl border border-border">
                  <PhotoUpload label="Upload helpful photos" description="People, places, uniforms, pets, trips, homes, or meaningful objects" />
                  <Button size="sm" onClick={() => {
                    addMessage({ id: Date.now().toString(), role: "user", content: "Photos added or skipped" });
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
          className="flex gap-2 items-end"
        >
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            placeholder="Type your answer here..."
            className="flex-1 min-h-[44px] max-h-32 resize-none rounded-2xl border-slate-200 focus:ring-primary bg-slate-50"
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