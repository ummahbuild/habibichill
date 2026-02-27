import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppProvider } from "@/context/AppContext";
import Index from "./pages/Index";
import LegalPage from "./pages/LegalPage";
import BlogList from "./pages/BlogList";
import BlogPost from "./pages/BlogPost";
import GuidesPage from "./pages/GuidesPage";
import ContributePage from "./pages/ContributePage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AppProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/blogs" element={<BlogList />} />
            <Route path="/blogs/:slug" element={<BlogPost />} />
            <Route path="/guides" element={<GuidesPage />} />
            <Route path="/contribute" element={<ContributePage />} />
            <Route path="/privacy" element={<LegalPage />} />
            <Route path="/terms" element={<LegalPage />} />
            <Route path="/legal" element={<LegalPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AppProvider>
  </QueryClientProvider>
);

export default App;
