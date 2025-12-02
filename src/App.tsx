import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";
import ErrorBoundary from "./components/ErrorBoundary";
import { AccessibilityProvider } from "./components/AccessibilityProvider";

// Lazy load all page components
const Index = lazy(() => import("./pages/Index"));
const Auth = lazy(() => import("./pages/Auth"));
const ProjectDetails = lazy(() => import("./pages/ProjectDetails"));
const Materials = lazy(() => import("./pages/Materials"));
const Labor = lazy(() => import("./pages/Labor"));
const Results = lazy(() => import("./pages/Results"));
const Projects = lazy(() => import("./pages/Projects"));
const BuildBot = lazy(() => import("./pages/BuildBot"));
const NotFound = lazy(() => import("./pages/NotFound"));
const ProjectTemplates = lazy(() => import("./pages/ProjectTemplates"));

const queryClient = new QueryClient();

// Loading component
const PageLoader = () => (
  <div className="min-h-screen bg-background flex items-center justify-center">
    <div className="text-center space-y-4">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
      <p className="text-muted-foreground">Loading...</p>
    </div>
  </div>
);

const App = () => (
  <ErrorBoundary>
    <AccessibilityProvider>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <a href="#main-content" className="skip-to-content">
              Skip to main content
            </a>
            <Suspense fallback={<PageLoader />}>
              <main id="main-content">
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/auth" element={<Auth />} />
                  <Route path="/project-templates" element={<ProjectTemplates />} />
                  <Route path="/project-details" element={<ProjectDetails />} />
                  <Route path="/materials" element={<Materials />} />
                  <Route path="/labor" element={<Labor />} />
                  <Route path="/results" element={<Results />} />
                  <Route path="/projects" element={<Projects />} />
                  <Route path="/buildbot" element={<BuildBot />} />
                  {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </main>
            </Suspense>
          </BrowserRouter>
        </TooltipProvider>
      </QueryClientProvider>
    </AccessibilityProvider>
  </ErrorBoundary>
);

export default App;
