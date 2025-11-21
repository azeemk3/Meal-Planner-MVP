import { Toaster } from "@/components/ui/toaster";
import { Sonner } from "@/components/ui/sonner"; // Corrected import: removed 'as Toaster'
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import OnboardingPage from "./pages/OnboardingPage";
import DashboardPage from "./pages/DashboardPage";
import MealPlanPage from "./pages/MealPlanPage";
import ShoppingListPage from "./pages/ShoppingListPage";
import LeftoversPage from "./pages/LeftoversPage";
import CommunityPage from "./pages/CommunityPage";
import NotFound from "./pages/NotFound";
import { MealPlanProvider } from "./context/MealPlanContext";
import AuthWrapper from "./components/AuthWrapper"; // New import

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <MealPlanProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/onboarding" element={<OnboardingPage />} />
            {/* Protected Routes */}
            <Route element={<AuthWrapper />}>
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/meal-plan" element={<MealPlanPage />} />
              <Route path="/shopping-list" element={<ShoppingListPage />} />
              <Route path="/leftovers" element={<LeftoversPage />} />
              <Route path="/community" element={<CommunityPage />} />
            </Route>
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </MealPlanProvider>
    </TooltipProvider>
    <Toaster />
    <Sonner />
  </QueryClientProvider>
);

export default App;