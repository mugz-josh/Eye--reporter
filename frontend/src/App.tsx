import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/contexts/ThemeContext";

import Homepage from "./pages/Homepage"; // <- landing page
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import CreateReport from "./pages/CreateReport";
import RedFlags from "./pages/RedFlags";
import Interventions from "./pages/Interventions";
import AdminDashboard from "./pages/AdminDashboard";

import NotificationsPage from "./pages/Notifications";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Make Homepage the landing page */}
            <Route path="/" element={<Homepage />} />
            {/* Login page */}
            <Route path="/login" element={<Auth />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/red-flags" element={<RedFlags />} />
            <Route path="/interventions" element={<Interventions />} />
            <Route path="/create" element={<CreateReport />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/users" element={<AdminDashboard />} />
            <Route path="/notifications" element={<NotificationsPage />} />
            
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
