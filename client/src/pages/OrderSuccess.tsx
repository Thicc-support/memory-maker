import { useEffect, useState } from "react";
import { Link, useSearch } from "wouter";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { CheckCircle2, BookOpen, Home as HomeIcon } from "lucide-react";

export default function OrderSuccess() {
  const search = useSearch();
  const params = new URLSearchParams(search);
  const orderId = params.get("order_id");
  const sessionId = params.get("session_id");
  const isSubscription = params.get("subscription") === "true";
  const tier = params.get("tier");

  const [order, setOrder] = useState<any>(null);

  useEffect(() => {
    if (sessionId) {
      fetch(`/api/checkout/session/${sessionId}`, { credentials: "include" })
        .then((r) => (r.ok ? r.json() : null))
        .then((data) => {
          if (data?.order) setOrder(data.order);
        })
        .catch(() => {});
      return;
    }
    if (!orderId) return;
    fetch(`/api/orders/${orderId}`, { credentials: "include" })
      .then((r) => (r.ok ? r.json() : null))
      .then(setOrder)
      .catch(() => {});
  }, [orderId, sessionId]);

  return (
    <div className="min-h-screen">
      <Navbar />
      <section className="container mx-auto px-6 py-20 max-w-2xl text-center">
        <div className="w-20 h-20 rounded-full bg-green-100 mx-auto flex items-center justify-center mb-6">
          <CheckCircle2 size={48} className="text-green-600" />
        </div>
        <h1 className="font-heading text-4xl font-bold mb-3 text-primary-foreground" data-testid="text-order-success-title">
          {isSubscription ? "Subscription Active!" : "Payment Successful!"}
        </h1>
        <p className="text-muted-foreground text-lg mb-8" data-testid="text-order-success-message">
          {isSubscription
            ? `Welcome to TaleWeaver ${tier === "family" ? "Family Bundle" : "Storyteller"}. Your free books are ready to create.`
            : order?.format === "digital"
            ? "Your digital book is ready! Find it in your library."
            : "Your print order is paid. We will manually review the book files before sending it to print, then email tracking when it ships."}
        </p>

        {order && (
          <div className="bg-white rounded-xl border border-border p-6 mb-8 text-left max-w-md mx-auto" data-testid="card-order-details">
            <h3 className="font-bold mb-3">Order Details</h3>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between"><span className="text-muted-foreground">Order ID</span><span className="font-mono">{order.id.slice(0, 8)}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Format</span><span className="capitalize">{order.format}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Amount</span><span>${(order.amount / 100).toFixed(2)}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Status</span><span className="capitalize text-green-600 font-medium">{order.status}</span></div>
            </div>
          </div>
        )}

        <div className="flex gap-3 justify-center">
          <Link href="/profile">
            <Button size="lg" className="rounded-full" data-testid="button-view-library">
              <BookOpen size={18} className="mr-2" /> View My Books
            </Button>
          </Link>
          <Link href="/">
            <Button size="lg" variant="outline" className="rounded-full" data-testid="button-back-home">
              <HomeIcon size={18} className="mr-2" /> Back Home
            </Button>
          </Link>
        </div>
      </section>
      <Footer />
    </div>
  );
}
