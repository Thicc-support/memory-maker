import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import Create from "@/pages/Create";
import Profile from "@/pages/Profile";
import BookView from "@/pages/BookView";
import Pricing from "@/pages/Pricing";
import Terms from "@/pages/Terms";
import Privacy from "@/pages/Privacy";
import Refund from "@/pages/Refund";
import OrderSuccess from "@/pages/OrderSuccess";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/create" component={Create} />
      <Route path="/profile" component={Profile} />
      <Route path="/book/:id" component={BookView} />
      <Route path="/pricing" component={Pricing} />
      <Route path="/terms" component={Terms} />
      <Route path="/privacy" component={Privacy} />
      <Route path="/refund" component={Refund} />
      <Route path="/order/success" component={OrderSuccess} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
