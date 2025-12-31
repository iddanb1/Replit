import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Navigation } from "@/components/Navigation";
import Home from "@/pages/Home";
import Programs from "@/pages/Programs";
import ProgramDetail from "@/pages/ProgramDetail";
import Events from "@/pages/Events";
import Admin from "@/pages/Admin";
import AdminLogin from "@/pages/AdminLogin";
import AdminProgramEdit from "@/pages/AdminProgramEdit";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <div className="min-h-screen bg-background font-sans">
      <Navigation />
      <main>
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/programs" component={Programs} />
          <Route path="/programs/:id" component={ProgramDetail} />
          <Route path="/events" component={Events} />
          <Route path="/admin-login" component={AdminLogin} />
          <Route path="/admin" component={Admin} />
          <Route path="/admin/programs/:id" component={AdminProgramEdit} />
          <Route component={NotFound} />
        </Switch>
      </main>
      <footer className="bg-primary text-primary-foreground py-12 mt-12">
        <div className="container mx-auto px-4 text-center">
          <p className="font-display font-bold text-2xl mb-4">Maranatha SDA Church</p>
          <p className="text-primary-foreground/60 text-sm">© {new Date().getFullYear()} All rights reserved.</p>
        </div>
      </footer>
    </div>
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
