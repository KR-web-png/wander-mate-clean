import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// Splash Screen
import { SplashScreen } from "@/screens/SplashScreen";

// Auth Screens
import { LoginScreen } from "@/screens/auth/LoginScreen";
import { SignupScreen } from "@/screens/auth/SignupScreen";
import { OnboardingScreen } from "@/screens/auth/OnboardingScreen";

// Main Screens
import { HomeScreen } from "@/screens/home/HomeScreen";
import { DiscoverScreen } from "@/screens/discover/DiscoverScreen";
import { DestinationDetailsScreen } from "@/screens/discover/DestinationDetailsScreen";
import { TripsScreen } from "@/screens/trips/TripsScreen";
import { CreateTripScreen } from "@/screens/trips/CreateTripScreen";
import { MatchesScreen } from "@/screens/matches/MatchesScreen";
import { CommunityScreen } from "@/screens/community/CommunityScreen";
import { ProfileScreen } from "@/screens/profile/ProfileScreen";
import { EditProfileScreen } from "@/screens/profile/EditProfileScreen";
import { LanguagesScreen } from "@/screens/profile/LanguagesScreen";
import { NotificationsScreen } from "@/screens/profile/NotificationsScreen";
import { SafetyPrivacyScreen } from "@/screens/profile/SafetyPrivacyScreen";
import { MyInterestsScreen } from "@/screens/profile/MyInterestsScreen";
import { UserProfileScreen } from "@/screens/profile/UserProfileScreen";
import { TravelMatesScreen } from "@/screens/profile/TravelMatesScreen";

// Contexts
import { LanguageProvider } from "@/contexts/LanguageContext";

import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <LanguageProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
        <Routes>
          {/* Splash Screen - First screen */}
          <Route path="/" element={<SplashScreen />} />
          
          {/* Auth Routes */}
          <Route path="/login" element={<LoginScreen />} />
          <Route path="/signup" element={<SignupScreen />} />
          <Route path="/onboarding" element={<OnboardingScreen />} />
          
          {/* Main App Routes */}
          <Route path="/home" element={<HomeScreen />} />
          <Route path="/discover" element={<DiscoverScreen />} />
          <Route path="/destination/:id" element={<DestinationDetailsScreen />} />
          <Route path="/trips" element={<TripsScreen />} />
          <Route path="/trips/create" element={<CreateTripScreen />} />
          <Route path="/matches" element={<MatchesScreen />} />
          <Route path="/community" element={<CommunityScreen />} />
          <Route path="/profile" element={<ProfileScreen />} />
          <Route path="/profile/:userId" element={<UserProfileScreen />} />
          <Route path="/profile/edit" element={<EditProfileScreen />} />
          <Route path="/profile/interests" element={<MyInterestsScreen />} />
          <Route path="/profile/languages" element={<LanguagesScreen />} />
          <Route path="/travel-mates" element={<TravelMatesScreen />} />
          <Route path="/notifications" element={<NotificationsScreen />} />
          <Route path="/profile/safety" element={<SafetyPrivacyScreen />} />
          
          {/* Catch-all */}
          <Route path="*" element={<NotFound />} />
        </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </LanguageProvider>
  </QueryClientProvider>
);

export default App;
