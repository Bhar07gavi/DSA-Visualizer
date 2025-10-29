import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import ArrayVisualization from "./pages/ArrayVisualization";
import LinkedListVisualization from "./pages/LinkedListVisualization";
import StackQueueVisualization from "./pages/StackQueueVisualization";
import SortingVisualization from "./pages/SortingVisualization";
import SearchVisualization from "./pages/SearchVisualization";
import TreeVisualization from "./pages/TreeVisualization";
import GraphVisualization from "./pages/GraphVisualization";
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
          <Route path="/arrays" element={<ArrayVisualization />} />
          <Route path="/linked-lists" element={<LinkedListVisualization />} />
          <Route path="/stacks-queues" element={<StackQueueVisualization />} />
          <Route path="/sorting" element={<SortingVisualization />} />
          <Route path="/searching" element={<SearchVisualization />} />
          <Route path="/trees" element={<TreeVisualization />} />
          <Route path="/graphs" element={<GraphVisualization />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
