import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import ProjectDetails from "./pages/ProjectDetails";
import Materials from "./pages/Materials";
import Labor from "./pages/Labor";
import Results from "./pages/Results";
import Projects from "./pages/Projects";
import BuildBot from "./pages/BuildBot";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/project-details" element={<ProjectDetails />} />
          <Route path="/materials" element={<Materials />} />
          <Route path="/labor" element={<Labor />} />
          <Route path="/results" element={<Results />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/buildbot" element={<BuildBot />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
