import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { BookOpen } from "lucide-react";
import { useAuth } from "@/lib/auth";

interface AuthModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onLoginSuccess: () => void;
}

export function AuthModal({ isOpen, onOpenChange, onLoginSuccess }: AuthModalProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const { login, register } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    
    try {
      if (isLogin) {
        await login(email, password);
      } else {
        await register(email, name || email.split("@")[0], password);
      }
      onLoginSuccess();
      onOpenChange(false);
      setEmail("");
      setName("");
      setPassword("");
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="flex flex-col items-center text-center">
          <div className="bg-primary/10 p-3 rounded-full mb-4 text-primary">
            <BookOpen size={32} />
          </div>
          <DialogTitle className="font-heading text-2xl">
            {isLogin ? "Welcome Back!" : "Create your Account"}
          </DialogTitle>
          <DialogDescription>
            {isLogin 
              ? "Sign in to access your saved stories and drafts." 
              : "Sign up to save your progress and create magical books."}
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          {error && (
            <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-lg text-center">
              {error}
            </div>
          )}
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input 
              id="email" 
              type="email" 
              placeholder="mom@example.com" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              data-testid="input-email"
              required 
            />
          </div>
          {!isLogin && (
            <div className="space-y-2">
              <Label htmlFor="name">Your Name</Label>
              <Input 
                id="name" 
                type="text" 
                placeholder="Jane Doe" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                data-testid="input-name"
              />
            </div>
          )}
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input 
              id="password" 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              data-testid="input-password"
              required 
            />
          </div>
          
          <Button type="submit" className="w-full font-bold" disabled={isLoading} data-testid="button-submit-auth">
            {isLoading ? "Please wait..." : (isLogin ? "Sign In" : "Create Account")}
          </Button>
          
          <div className="text-center text-sm">
            <span className="text-muted-foreground">
              {isLogin ? "Don't have an account? " : "Already have an account? "}
            </span>
            <button 
              type="button"
              className="font-bold text-primary hover:underline"
              onClick={() => { setIsLogin(!isLogin); setError(""); }}
              data-testid="button-toggle-auth"
            >
              {isLogin ? "Sign up" : "Log in"}
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
