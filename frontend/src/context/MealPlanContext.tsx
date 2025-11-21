"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { MealPlan, UserProfile } from "@/types";
import { api } from "@/services/api";
import { toast } from "sonner";

interface MealPlanContextType {
  userProfile: UserProfile | null;
  mealPlan: MealPlan | null;
  loading: boolean;
  saveProfile: (profile: UserProfile) => Promise<void>;
  generatePlan: () => Promise<void>;
  clearData: () => void; // For development/testing
  signup: (userData: any) => Promise<any>;
  login: (credentials: any) => Promise<any>;
  logout: () => void;
}

const MealPlanContext = createContext<MealPlanContextType | undefined>(
  undefined,
);

export const MealPlanProvider = ({ children }: { children: ReactNode }) => {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [mealPlan, setMealPlan] = useState<MealPlan | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadInitialData = async () => {
      setLoading(true);
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const user = await api.getMe(token);
          setUserProfile(user);
        } catch (error) {
          console.error("Failed to fetch user profile:", error);
          localStorage.removeItem("token");
        }
      }
      setLoading(false);
    };
    loadInitialData();
  }, []);

  const signup = async (userData: any) => {
    const response = await api.signup(userData);
    if (response.access_token) {
      localStorage.setItem("token", response.access_token);
      setUserProfile(response.user);
    }
    return response;
  };

  const login = async (credentials: any) => {
    const response = await api.login(credentials);
    if (response.access_token) {
      localStorage.setItem("token", response.access_token);
      setUserProfile(response.user);
    }
    return response;
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUserProfile(null);
    setMealPlan(null);
    toast.info("Logged out successfully.");
  };

  const saveProfile = async (profileData: any) => {
    setLoading(true);
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("You must be logged in to save your profile.");
      setLoading(false);
      return;
    }
    try {
      const updatedProfile = await api.saveUserProfile(profileData, token);
      setUserProfile(updatedProfile);
      toast.success("Profile saved successfully!");
    } catch (error) {
      console.error("Failed to save profile:", error);
      toast.error("Failed to save profile.");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const generatePlan = async () => {
    setLoading(true);
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("You must be logged in to generate a meal plan.");
      setLoading(false);
      return;
    }
    try {
      const generatedPlan = await api.generateMealPlan(token);
      setMealPlan(generatedPlan);
      toast.success("Weekly meal plan generated!");
    } catch (error) {
      console.error("Failed to generate meal plan:", error);
      toast.error("Failed to generate meal plan.");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const clearData = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("mealplanr_user_profile");
    localStorage.removeItem("mealplanr_current_meal_plan");
    setUserProfile(null);
    setMealPlan(null);
    toast.info("All local data cleared.");
  };

  return (
    <MealPlanContext.Provider
      value={{
        userProfile,
        mealPlan,
        loading,
        saveProfile,
        generatePlan,
        clearData,
        signup,
        login,
        logout,
      }}
    >
      {children}
    </MealPlanContext.Provider>
  );
};

export const useMealPlan = () => {
  const context = useContext(MealPlanContext);
  if (context === undefined) {
    throw new Error("useMealPlan must be used within a MealPlanProvider");
  }
  return context;
};