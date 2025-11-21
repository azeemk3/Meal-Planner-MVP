"use client";

import React from "react"; // Removed useEffect as it's no longer needed here
import { useNavigate } from "react-router-dom";
import AppLayout from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useMealPlan } from "@/context/MealPlanContext";
import { Loader2, DollarSign, Percent, Utensils } from "lucide-react"; // Updated icons
import { toast } from "sonner";

const DashboardPage = () => {
  const navigate = useNavigate();
  const { userProfile, mealPlan, loading, generatePlan } = useMealPlan();

  const handleGeneratePlan = async () => {
    try {
      await generatePlan();
      navigate("/meal-plan");
    } catch (error) {
      console.error("Failed to generate meal plan:", error);
      toast.error("Could not generate meal plan. Please try again.");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-green-600" />
        <span className="ml-2 text-gray-600">Loading your data...</span>
      </div>
    );
  }

  if (!userProfile) {
    return null; // AuthWrapper handles redirection
  }

  const greetingName = userProfile.name || "there";
  const estimatedSpend = mealPlan?.estimated_spend || 0;
  const estimatedSavings = mealPlan?.estimated_savings_percentage || 0;

  return (
    <AppLayout>
      <div className="container mx-auto py-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">
          Hi, <span className="text-green-600">{greetingName}</span>!
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Here's your weekly meal planning overview.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <Card className="bg-white shadow-lg border-l-4 border-green-500 hover:shadow-xl transition-shadow duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Weekly Budget
              </CardTitle>
              <DollarSign className="h-5 w-5 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900">
                ${userProfile.weekly_budget.toFixed(2)}
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                Your set budget for groceries
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-lg border-l-4 border-blue-500 hover:shadow-xl transition-shadow duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Estimated Spend
              </CardTitle>
              <Utensils className="h-5 w-5 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900">
                ${estimatedSpend.toFixed(2)}
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                Based on your current plan
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-lg border-l-4 border-purple-500 hover:shadow-xl transition-shadow duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Estimated Savings
              </CardTitle>
              <Percent className="h-5 w-5 text-purple-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900">{estimatedSavings}%</div>
              <p className="text-sm text-muted-foreground mt-1">
                Compared to average spending
              </p>
            </CardContent>
          </Card>
        </div>

        {!mealPlan ? (
          <div className="text-center p-10 border-2 border-dashed border-gray-300 rounded-xl bg-gray-50 shadow-inner">
            <Utensils className="h-16 w-16 text-gray-400 mx-auto mb-6" />
            <h2 className="text-2xl font-semibold text-gray-700 mb-4">
              No meal plan for this week yet!
            </h2>
            <p className="text-lg text-gray-600 mb-8 max-w-lg mx-auto">
              Let our AI generate a personalized plan based on your preferences
              and budget. It's quick, easy, and designed to save you money!
            </p>
            <Button
              onClick={handleGeneratePlan}
              className="bg-green-600 hover:bg-green-700 text-xl px-10 py-5 rounded-lg shadow-md hover:shadow-lg transition-all duration-300"
              disabled={loading}
            >
              {loading ? (
                <Loader2 className="mr-2 h-6 w-6 animate-spin" />
              ) : (
                "Generate Weekly Meal Plan"
              )}
            </Button>
          </div>
        ) : (
          <div className="p-10 border rounded-xl bg-white shadow-lg">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              This Week's Plan
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              Your personalized meal plan is ready. Dive in to see what's cooking!
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                onClick={() => navigate("/meal-plan")}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-lg px-8 py-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-300"
              >
                View Meal Plan
              </Button>
              <Button
                onClick={handleGeneratePlan}
                variant="outline"
                className="flex-1 text-lg px-8 py-4 rounded-lg border-gray-300 hover:border-gray-400 hover:bg-gray-50 transition-all duration-300"
                disabled={loading}
              >
                {loading ? (
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                ) : (
                  "Regenerate Plan"
                )}
              </Button>
              <Button
                onClick={() => toast.info("Adjust Preferences not implemented yet.")}
                variant="outline"
                className="flex-1 text-lg px-8 py-4 rounded-lg border-gray-300 hover:border-gray-400 hover:bg-gray-50 transition-all duration-300"
                disabled={loading}
              >
                Adjust Preferences
              </Button>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
};

export default DashboardPage;