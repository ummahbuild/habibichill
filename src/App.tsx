import { Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppProvider } from "@/context/AppContext";
import RouteErrorBoundary from "@/components/RouteErrorBoundary";
import { lazyWithRetry } from "@/lib/lazyWithRetry";
import Index from "./pages/Index";

// Lazy-load non-critical routes (with retry so deploy/cache misses don't white-screen)
const LegalPage = lazyWithRetry(() => import("./pages/LegalPage"));
const BlogList = lazyWithRetry(() => import("./pages/BlogList"));
const BlogPost = lazyWithRetry(() => import("./pages/BlogPost"));
const GuidesPage = lazyWithRetry(() => import("./pages/GuidesPage"));
const ContributePage = lazyWithRetry(() => import("./pages/ContributePage"));
const NotFound = lazyWithRetry(() => import("./pages/NotFound"));
const SurahPage = lazyWithRetry(() => import("./pages/SurahPage"));
const PitchPage = lazyWithRetry(() => import("./pages/PitchPage"));
const ProductsPage = lazyWithRetry(() => import("./pages/ProductsPage"));
const ProductDetailPage = lazyWithRetry(() => import("./pages/ProductDetailPage"));

const queryClient = new QueryClient();

const PageFallback = () => (
  <div className="flex min-h-screen items-center justify-center bg-background">
    <div className="text-center">
      <div className="mx-auto mb-3 h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      <p className="text-sm text-muted-foreground">Loading...</p>
    </div>
  </div>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AppProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <RouteErrorBoundary>
            <Suspense fallback={<PageFallback />}>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/blogs" element={<BlogList />} />
                <Route path="/blogs/:slug" element={<BlogPost />} />
                <Route path="/guides" element={<GuidesPage />} />
                <Route path="/contribute" element={<ContributePage />} />
                <Route path="/pitch" element={<PitchPage />} />
                <Route path="/products" element={<ProductsPage />} />
                <Route path="/product/:slug" element={<ProductDetailPage />} />
                <Route path="/privacy" element={<LegalPage />} />
                <Route path="/terms" element={<LegalPage />} />
                <Route path="/legal" element={<LegalPage />} />
                <Route path="/surah/:id" element={<SurahPage />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </RouteErrorBoundary>
        </BrowserRouter>
      </TooltipProvider>
    </AppProvider>
  </QueryClientProvider>
);

export default App;
