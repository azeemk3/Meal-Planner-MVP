"use client";

import React, { useEffect } from "react";
import { useNavigate, Outlet } from "react-router-dom"; // Import Outlet
import { useMealPlan } from "@/context/MealPlanContext";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

// Removed AuthWrapperProps interface as children prop is no longer used directly
// interface AuthWrapperProps {
//   children: ReactNode;
// }

// AuthWrapper component no longer accepts children directly, uses Outlet instead
const AuthWrapper = () => {
  const { userProfile, loading, logout } = useMealPlan();
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!loading && !userProfile && !token) {
      // If not loading and no user profile, redirect to the landing page
      navigate("/");
      toast.info("Please get started or log in to access this page.");
    }
  }, [userProfile, loading, navigate, logout]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="h-8 w-8 animate-spin text-green-600" />
        <span className="ml-2 text-gray-600">Loading your session...</span>
      </div>
    );
  }

  if (!userProfile) {
    // This case is handled by the useEffect redirect, but return null for safety
    return null;
  }

  // Render nested routes using Outlet
  return <Outlet />;
};

export default AuthWrapper;