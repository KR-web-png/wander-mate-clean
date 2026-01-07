import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// Auth Screens
import { LoginScreen } from "@/screens/auth/LoginScreen";
import { SignupScreen } from "@/screens/auth/SignupScreen";
import { OnboardingScreen } from "@/screens/auth/OnboardingScreen";

// Main Screens
import { HomeScreen } from "@/screens/home/HomeScreen";
import { DiscoverScreen } from "@/screens/discover/DiscoverScreen";
import { TripsScreen } from "@/screens/trips/TripsScreen";
import { MatchesScreen } from "@/screens/matches/MatchesScreen";
import { ChatScreen } from "@/screens/chat/ChatScreen";
import { ProfileScreen } from "@/screens/profile/ProfileScreen";

import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Auth Routes */}
          <Route path="/login" element={<LoginScreen />} />
          <Route path="/signup" element={<SignupScreen />} />
          <Route path="/onboarding" element={<OnboardingScreen />} />
          
          {/* Main App Routes */}
          <Route path="/" element={<Navigate to="/home" replace />} />
          <Route path="/home" element={<HomeScreen />} />
          <Route path="/discover" element={<DiscoverScreen />} />
          <Route path="/trips" element={<TripsScreen />} />
          <Route path="/matches" element={<MatchesScreen />} />
          <Route path="/chat" element={<ChatScreen />} />
          <Route path="/profile" element={<ProfileScreen />} />
          
          {/* Catch-all */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
