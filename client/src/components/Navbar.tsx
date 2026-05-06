import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { BookOpen, User, LogOut } from "lucide-react";
import { useState } from "react";
import { AuthModal } from "./AuthModal";
import { useAuth } from "@/lib/auth";
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
  const { user, logout } = useAuth();
  const [, setLocation] = useLocation();

  const handleLogout = async () => {
    await logout();
    setLocation("/");
  };

  return (
    <>
      <AuthModal 
        isOpen={showAuth} 
        onOpenChange={setShowAuth} 
        onLoginSuccess={() => {}} 
      />
      
      <nav className="w-full py-6 px-6 md:px-12 flex justify-between items-center bg-transparent relative z-10">
        <Link href="/" className="flex items-center gap-2 group cursor-pointer no-underline">
          <div className="bg-primary p-2 rounded-lg text-white group-hover:rotate-3 transition-transform">
            <BookOpen size={24} />
          </div>
          <span className="font-heading text-2xl font-bold text-primary-foreground tracking-tight">
            TaleWeaver
          </span>
        </Link>

        <div className="hidden md:flex gap-8 items-center font-medium text-muted-foreground">
          <Link href="/" className="hover:text-primary transition-colors no-underline">Home</Link>
          <a href="/#how-it-works" className="hover:text-primary transition-colors">How it Works</a>
          <a href="/#examples" className="hover:text-primary transition-colors">Examples</a>
          <Link href="/pricing" className="hover:text-primary transition-colors no-underline" data-testid="link-nav-pricing">Pricing</Link>
        </div>

        <div className="flex gap-4 items-center">
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="rounded-full px-4 border border-border hover:bg-white/50" data-testid="button-user-menu">
                  <User size={18} className="mr-2" />
                  <span className="max-w-[100px] truncate">{user.name.split(' ')[0]}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 rounded-xl">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setLocation("/profile")}>
                  Account
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setLocation("/profile")}>
                  Drafts
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setLocation("/profile")}>
                  My Books
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="text-destructive focus:text-destructive" data-testid="button-logout">
                  <LogOut size={16} className="mr-2" />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button variant="ghost" onClick={() => setShowAuth(true)} className="rounded-full hover:bg-white/50 text-muted-foreground hover:text-primary" data-testid="button-create-account">
              Create Account
            </Button>
          )}

          <Button className="rounded-full px-6 font-bold shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all hover:-translate-y-0.5" data-testid="button-create-book" onClick={() => setLocation("/create")}>
            Create a Book
          </Button>
        </div>
      </nav>
    </>
  );
}
