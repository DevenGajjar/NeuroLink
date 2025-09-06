import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navigation from "./components/Navigation";
import Homepage from "./components/Homepage";
import ChatBot from "./components/ChatBot";
import SelfAssessmentImproved from "./components/SelfAssessmentImproved";
import WellnessHub from "./components/WellnessHub";
import TherapistBooking from "./components/TherapistBooking";

import MoodTracking from "./pages/MoodTracking";
import Login from "./components/Auth/Login";
import Signup from "./components/Auth/Signup";
import AdminLogin from "./components/Auth/AdminLogin";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <div className="min-h-screen bg-background">
          <Routes>
            {/* Public routes without navigation */}
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/admin-login" element={<AdminLogin />} />
            
            {/* Routes with navigation */}
            <Route path="/*" element={
              <>
                <Navigation />
                <Routes>
                  <Route path="/" element={<Homepage />} />
                  <Route path="/chat" element={<ChatBot />} />
                  <Route path="/assessment" element={<SelfAssessmentImproved />} />
                  <Route path="/wellness" element={<WellnessHub />} />
                  <Route path="/booking" element={<TherapistBooking />} />
                  <Route path="/mood-tracking" element={<MoodTracking />} />
                  {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </>
            } />
          </Routes>
        </div>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
