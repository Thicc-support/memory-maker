import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

export default function Refund() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <article className="container mx-auto px-6 py-16 max-w-3xl" data-testid="page-refund">
        <h1 className="font-heading text-4xl font-bold mb-2 text-primary-foreground">Refund Policy</h1>
        <p className="text-sm text-muted-foreground mb-8">Last updated: {new Date().toLocaleDateString()}</p>

        <div className="space-y-6 text-slate-700 leading-relaxed">
          <section>
            <h2 className="font-heading text-2xl font-bold mt-8 mb-3 text-primary-foreground">Digital Books</h2>
            <p>Because digital book downloads (PDFs) are delivered immediately and cannot be returned, <strong>digital purchases are non-refundable</strong>. If your file fails to download or is corrupted, contact us and we will re-deliver it at no charge.</p>
          </section>

          <section>
            <h2 className="font-heading text-2xl font-bold mt-8 mb-3 text-primary-foreground">Physical Books (Softcover & Hardcover)</h2>
            <p>Physical books are made-to-order, so we cannot accept returns for "change of mind." However:</p>
            <ul className="list-disc pl-6 space-y-1 mt-2">
              <li>If your book arrives <strong>damaged, defective, or with a printing error</strong>, contact us within <strong>30 days of delivery</strong> and we will reprint and reship at no cost, or issue a full refund.</li>
              <li>Photos of the issue are required so we can work with our print partner.</li>
              <li>We are not responsible for shipping delays caused by carriers, but we will help track and resolve any lost packages.</li>
            </ul>
          </section>

          <section>
            <h2 className="font-heading text-2xl font-bold mt-8 mb-3 text-primary-foreground">AI-Generated Content</h2>
            <p>Because story text and illustrations are AI-generated, you are expected to preview and approve your book before ordering a physical copy. We do not refund printed books based on dissatisfaction with AI-generated story or illustration choices that were visible in the digital preview at the time of ordering. We provide free regeneration tools to help you get the result you want before you check out.</p>
          </section>

          <section>
            <h2 className="font-heading text-2xl font-bold mt-8 mb-3 text-primary-foreground">Subscriptions</h2>
            <p>Subscriptions can be cancelled any time from the Billing Portal and remain active through the end of the current billing period. We do not refund partial months. Free book credits expire at the end of each billing period and do not roll over.</p>
          </section>

          <section>
            <h2 className="font-heading text-2xl font-bold mt-8 mb-3 text-primary-foreground">How to Request a Refund</h2>
            <p>Email <a href="mailto:support@taleweaver.com" className="text-primary underline">support@taleweaver.com</a> with your order ID and a description of the problem. We typically respond within 2 business days. Approved refunds are returned to the original payment method within 5–10 business days.</p>
          </section>
        </div>
      </article>
      <Footer />
    </div>
  );
}
