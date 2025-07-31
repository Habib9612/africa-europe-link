import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
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
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<Auth />} />
            <Route 
              path="/loads" 
              element={
                <ProtectedRoute>
                  <Loads />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/trucks" 
              element={
                <ProtectedRoute>
                  <Trucks />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/shipper" 
              element={
                <ProtectedRoute requiredRole="shipper">
                  <ShipperDashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/carrier" 
              element={
                <ProtectedRoute requiredRole="carrier">
                  <CarrierDashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin" 
              element={
                <ProtectedRoute requiredRole="admin">
                  <AdminDashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/tracking" 
              element={
                <ProtectedRoute>
                  <Tracking />
                </ProtectedRoute>
              } 
            />
            {/* Additional sidebar navigation routes */}
            <Route 
              path="/messages" 
              element={
                <ProtectedRoute>
                  <div className="p-6">Messages - Coming Soon</div>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/settings" 
              element={
                <ProtectedRoute>
                  <div className="p-6">Settings - Coming Soon</div>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/analytics" 
              element={
                <ProtectedRoute>
                  <div className="p-6">Analytics - Coming Soon</div>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/fleet" 
              element={
                <ProtectedRoute>
                  <div className="p-6">Fleet Management - Coming Soon</div>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/drivers" 
              element={
                <ProtectedRoute>
                  <div className="p-6">Drivers - Coming Soon</div>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/routes" 
              element={
                <ProtectedRoute>
                  <div className="p-6">Routes - Coming Soon</div>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/maintenance" 
              element={
                <ProtectedRoute>
                  <div className="p-6">Maintenance - Coming Soon</div>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/fuel" 
              element={
                <ProtectedRoute>
                  <div className="p-6">Fuel Reports - Coming Soon</div>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/carriers" 
              element={
                <ProtectedRoute>
                  <div className="p-6">Carriers - Coming Soon</div>
                </ProtectedRoute>
              } 
            />
            
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
          <AIAssistant />
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
