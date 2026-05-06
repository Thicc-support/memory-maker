import { Link } from "wouter";
import { BookOpen, Mail } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-border bg-white/60 mt-12">
      <div className="container mx-auto px-6 py-12">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-3">
              <div className="bg-primary p-2 rounded-lg text-white">
                <BookOpen size={20} />
              </div>
              <span className="font-heading text-xl font-bold text-primary-foreground">TaleWeaver</span>
            </div>
            <p className="text-sm text-muted-foreground max-w-sm">
              Custom AI-illustrated children's books crafted from your family's stories and memories.
            </p>
            <a
              href="mailto:support@taleweaver.com"
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary mt-4"
              data-testid="link-contact-email"
            >
              <Mail size={14} /> support@taleweaver.com
            </a>
          </div>

          <div>
            <h4 className="font-bold text-sm mb-3 text-primary-foreground">Product</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/create" className="hover:text-primary" data-testid="link-footer-create">Create a Book</Link></li>
              <li><Link href="/pricing" className="hover:text-primary" data-testid="link-footer-pricing">Pricing</Link></li>
              <li><Link href="/profile" className="hover:text-primary" data-testid="link-footer-profile">My Account</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-sm mb-3 text-primary-foreground">Legal</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/terms" className="hover:text-primary" data-testid="link-footer-terms">Terms of Service</Link></li>
              <li><Link href="/privacy" className="hover:text-primary" data-testid="link-footer-privacy">Privacy Policy</Link></li>
              <li><Link href="/refund" className="hover:text-primary" data-testid="link-footer-refund">Refund Policy</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border pt-6 flex flex-col md:flex-row justify-between gap-3 text-xs text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} TaleWeaver. All rights reserved.</p>
          <p>Books and illustrations are AI-generated. Made with care for families.</p>
        </div>
      </div>
    </footer>
  );
}
