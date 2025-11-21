"use client";

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AppLayout from "@/components/layout/AppLayout";
import { useMealPlan } from "@/context/MealPlanContext";
import { Loader2, Lightbulb, Utensils } from "lucide-react"; // Added Utensils icon
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { LeftoverSuggestion } from "@/types";
import { api } from "@/services/api";
import { Badge } from "@/components/ui/badge"; // New import

const LeftoversPage = () => {
  const navigate = useNavigate();
  const { userProfile, loading } = useMealPlan();
  const [leftoverSuggestions, setLeftoverSuggestions] = useState<LeftoverSuggestion[]>([]);
  const [pageLoading, setPageLoading] = useState(true);

  useEffect(() => {
    if (!loading && !userProfile) {
      navigate("/"); // Redirect to landing page if no user profile
      toast.info("Please get started or log in to access this page.");
    }
  }, [userProfile, loading, navigate]);

  useEffect(() => {
    const fetchLeftoverSuggestions = async () => {
      setPageLoading(true);
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          toast.error("Authentication token not found.");
          return;
        }
        const suggestions = await api.getLeftoverSuggestions(userProfile, token);
        setLeftoverSuggestions(suggestions);
      } catch (error) {
        console.error("Failed to fetch leftover suggestions:", error);
        toast.error("Failed to load leftover suggestions.");
      } finally {
        setPageLoading(false);
      }
    };
    fetchLeftoverSuggestions();
  }, []);

  if (loading || pageLoading || !userProfile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-green-600" />
        <span className="ml-2 text-gray-600">Loading leftover ideas...</span>
      </div>
    );
  }

  return (
    <AppLayout>
      <div className="container mx-auto py-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">
          Use Your Leftovers
        </h1>
        <p className="text-lg text-gray-600 mb-8">
          Don't let good food go to waste! Here are some creative ideas to use
          up your ingredients.
        </p>

        <div className="bg-blue-50 border-l-4 border-blue-500 text-blue-700 p-4 mb-8 rounded-md flex items-start space-x-3" role="alert">
          <Lightbulb className="h-6 w-6 flex-shrink-0 mt-1" />
          <div>
            <p className="font-bold text-lg">Future Feature:</p>
            <p className="text-base">These are mock suggestions for now. In the future, our AI will provide personalized ideas based on your actual leftovers!</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {leftoverSuggestions.map((suggestion) => (
            <Card key={suggestion.id} className="bg-white shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardHeader>
                <CardTitle className="text-xl font-semibold text-gray-800 flex items-center space-x-2">
                  <Utensils className="h-5 w-5 text-green-600" />
                  <span>{suggestion.suggested_recipe_name}</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-3">{suggestion.description}</p>
                <div className="flex flex-wrap gap-2 mt-4">
                  {suggestion.ingredients_to_use.map((ingredient, index) => (
                    <Badge key={index} variant="secondary" className="bg-gray-100 text-gray-700">
                      {ingredient}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </AppLayout>
  );
};

export default LeftoversPage;