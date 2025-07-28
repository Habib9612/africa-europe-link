import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Loads from "./pages/Loads";
import Trucks from "./pages/Trucks";
import Dashboard from "./pages/Dashboard";
import ShipperDashboard from "./pages/ShipperDashboard";
import CarrierDashboard from "./pages/CarrierDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import Tracking from "./pages/Tracking";
import NotFound from "./pages/NotFound";
import AIAssistant from "./components/AIAssistant";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/loads" element={<Loads />} />
          <Route path="/trucks" element={<Trucks />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/shipper" element={<ShipperDashboard />} />
          <Route path="/carrier" element={<CarrierDashboard />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/tracking" element={<Tracking />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
        <AIAssistant />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
