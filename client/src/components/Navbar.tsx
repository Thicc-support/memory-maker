import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { BookOpen, User, LogOut } from "lucide-react";
import { useState, useEffect } from "react";
import { AuthModal } from "./AuthModal";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function Navbar() {
  const [showAuth, setShowAuth] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [location, setLocation] = useLocation();

  useEffect(() => {
    // Check mock auth
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    setLocation("/");
  };

  return (
    <>
      <AuthModal 
        isOpen={showAuth} 
        onOpenChange={setShowAuth} 
        onLoginSuccess={() => {
          const storedUser = localStorage.getItem("user");
          if (storedUser) setUser(JSON.parse(storedUser));
        }} 
      />
      
      <nav className="w-full py-6 px-6 md:px-12 flex justify-between items-center bg-transparent relative z-10">
        <Link href="/">
          <a className="flex items-center gap-2 group cursor-pointer">
            <div className="bg-primary p-2 rounded-lg text-white group-hover:rotate-3 transition-transform">
              <BookOpen size={24} />
            </div>
            <span className="font-heading text-2xl font-bold text-primary-foreground tracking-tight">
              TaleWeaver
            </span>
          </a>
        </Link>

        <div className="hidden md:flex gap-8 items-center font-medium text-muted-foreground">
          <a href="/#how-it-works" className="hover:text-primary transition-colors">How it Works</a>
          <a href="/#examples" className="hover:text-primary transition-colors">Examples</a>
          <a href="/#pricing" className="hover:text-primary transition-colors">Pricing</a>
        </div>

        <div className="flex gap-4 items-center">
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="rounded-full px-4 border border-border hover:bg-white/50">
                  <User size={18} className="mr-2" />
                  <span className="max-w-[100px] truncate">{user.name}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 rounded-xl">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setLocation("/profile")}>
                  Profile & Books
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setLocation("/profile")}>
                  Drafts
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="text-destructive focus:text-destructive">
                  <LogOut size={16} className="mr-2" />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button variant="ghost" onClick={() => setShowAuth(true)} className="rounded-full hover:bg-white/50 text-muted-foreground hover:text-primary">
              Log In
            </Button>
          )}

          <Link href="/create">
            <Button className="rounded-full px-6 font-bold shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all hover:-translate-y-0.5">
              Create a Book
            </Button>
          </Link>
        </div>
      </nav>
    </>
  );
}