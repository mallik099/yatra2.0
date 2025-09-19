import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navigation from "./components/Navigation";
import AccessibilityControls from "./components/AccessibilityControls";
import Home from "./pages/Home";
import Features from "./pages/Features";
import Impact from "./pages/Impact";
import HowItWorks from "./pages/HowItWorks";
import Contact from "./pages/Contact";
import YatraMap from "./components/YatraMap";
import NotFound from "./pages/NotFound";
import PassengerApp from "./components/PassengerApp";
import DriverDashboard from "./pages/DriverDashboard";
import AdminDashboard from "./pages/AdminDashboard";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <a href="#main-content" className="skip-link">Skip to main content</a>
        <Navigation />
        <main id="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/map" element={<YatraMap />} />
            <Route path="/app" element={<PassengerApp />} />
            <Route path="/driver" element={<DriverDashboard />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/features" element={<Features />} />
            <Route path="/impact" element={<Impact />} />
            <Route path="/how-it-works" element={<HowItWorks />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        <AccessibilityControls />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
