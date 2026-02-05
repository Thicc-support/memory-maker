import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar } from "@/components/ui/avatar";
import { Sparkles, Send, User, Bot } from "lucide-react";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

interface ChatInterfaceProps {
  onComplete: () => void;
  topic: string;
}

export function ChatInterface({ onComplete, topic }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content: `Hi there! I'm TaleWeaver. I'm so excited to help you write a story about ${topic}! First, who is this book for? (Child's name)`
    }
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Simulated conversation flow
  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input
    };

    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    // Simulate AI thinking and responding based on message count
    setTimeout(() => {
      let nextQuestion = "";
      const count = messages.length;

      if (count === 1) nextQuestion = `Nice to meet you! How old is the child? knowing their age helps me pick the right words.`;
      else if (count === 3) nextQuestion = `Got it! Now, let's talk about the adventure. What is one specific memory you have about ${topic} that you want to share?`;
      else if (count === 5) nextQuestion = `That's amazing! Do you want this story to be funny, sentimental, or adventurous?`;
      else if (count === 7) {
        nextQuestion = "Perfect! I have everything I need to weave your tale. Give me a moment to write and illustrate your book...";
        setTimeout(onComplete, 3000); // Trigger completion after this message
      }

      if (nextQuestion) {
        setMessages(prev => [...prev, {
          id: Date.now().toString(),
          role: "assistant",
          content: nextQuestion
        }]);
      }
      setIsTyping(false);
    }, 1500);
  };

  return (
    <div className="flex flex-col h-[600px] max-w-2xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden border border-border">
      {/* Header */}
      <div className="bg-primary/10 p-4 border-b border-border flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white">
          <Sparkles size={20} />
        </div>
        <div>
          <h3 className="font-bold text-primary-foreground">TaleWeaver AI</h3>
          <p className="text-xs text-muted-foreground">Weaving your story...</p>
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
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`flex gap-3 max-w-[80%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
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