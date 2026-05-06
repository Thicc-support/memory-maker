import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

export default function Privacy() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <article className="container mx-auto px-6 py-16 max-w-3xl" data-testid="page-privacy">
        <h1 className="font-heading text-4xl font-bold mb-2 text-primary-foreground">Privacy Policy</h1>
        <p className="text-sm text-muted-foreground mb-8">Last updated: {new Date().toLocaleDateString()}</p>

        <div className="space-y-6 text-slate-700 leading-relaxed">
          <section>
            <h2 className="font-heading text-2xl font-bold mt-8 mb-3 text-primary-foreground">What We Collect</h2>
            <ul className="list-disc pl-6 space-y-1">
              <li><strong>Account information:</strong> name, email, hashed password.</li>
              <li><strong>Story content:</strong> answers to story interview questions, character details, photos you upload.</li>
              <li><strong>Order data:</strong> books you create, formats purchased, shipping address (for physical orders), and a Stripe customer ID. We do <em>not</em> store full credit card numbers — Stripe handles all payment data.</li>
              <li><strong>Usage data:</strong> basic logs needed to operate the Service (timestamps, IP address, requests).</li>
            </ul>
          </section>

          <section>
            <h2 className="font-heading text-2xl font-bold mt-8 mb-3 text-primary-foreground">How We Use Your Data</h2>
            <ul className="list-disc pl-6 space-y-1">
              <li>To generate your books with AI (story text and illustrations).</li>
              <li>To deliver and ship orders.</li>
              <li>To recommend story themes and remember characters across books.</li>
              <li>To provide customer support and improve the Service.</li>
            </ul>
          </section>

          <section>
            <h2 className="font-heading text-2xl font-bold mt-8 mb-3 text-primary-foreground">Children & COPPA Compliance</h2>
            <p>TaleWeaver is intended for adults (18+) who create books on behalf of children. We do not knowingly collect personal information directly from children under 13. If you are a parent or guardian and provide information about a child, you confirm that you have the right to do so. You may request deletion of any child-related data at any time by emailing <a href="mailto:support@taleweaver.com" className="text-primary underline">support@taleweaver.com</a>.</p>
          </section>

          <section>
            <h2 className="font-heading text-2xl font-bold mt-8 mb-3 text-primary-foreground">Third Parties</h2>
            <p>We share data with:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li><strong>Stripe</strong> — payment processing.</li>
              <li><strong>OpenAI / Google AI</strong> — story and illustration generation. Prompts you submit are sent to these providers under their data-handling agreements.</li>
              <li><strong>Print partners</strong> — to fulfill physical book orders (name and shipping address only).</li>
            </ul>
            <p className="mt-2">We do not sell your personal data.</p>
          </section>

          <section>
            <h2 className="font-heading text-2xl font-bold mt-8 mb-3 text-primary-foreground">Your Rights</h2>
            <p>You may access, export, or delete your data at any time by emailing <a href="mailto:support@taleweaver.com" className="text-primary underline">support@taleweaver.com</a>. Account deletion removes your stories, profiles, and personal information; we may retain order records as required by law.</p>
          </section>

          <section>
            <h2 className="font-heading text-2xl font-bold mt-8 mb-3 text-primary-foreground">Security</h2>
            <p>Passwords are hashed with scrypt. Sessions are stored server-side. We use HTTPS in production. No service can guarantee perfect security, so please use a strong, unique password.</p>
          </section>

          <section>
            <h2 className="font-heading text-2xl font-bold mt-8 mb-3 text-primary-foreground">Contact</h2>
            <p>Privacy questions? Email <a href="mailto:support@taleweaver.com" className="text-primary underline">support@taleweaver.com</a>.</p>
          </section>
        </div>
      </article>
      <Footer />
    </div>
  );
}
