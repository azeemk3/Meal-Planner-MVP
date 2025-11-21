"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import AppLayout from "@/components/layout/AppLayout";
import { useMealPlan } from "@/context/MealPlanContext";
import { Loader2, ShoppingCart, Salad, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import MealCard from "@/components/MealCard";
import RecipeDetailDrawer from "@/components/RecipeDetailDrawer";
import { DayPlan, Recipe } from "@/types";
import { api } from "@/services/api";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

const MealPlanPage = () => {
  const navigate = useNavigate();
  const { userProfile, mealPlan, loading } = useMealPlan();
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [recipesMap, setRecipesMap] = useState<Map<string, Recipe>>(new Map());
  const [activeFilters, setActiveFilters] = useState<string[]>([]); // Refactored filter state

  useEffect(() => {
    if (!loading && !userProfile) {
      navigate("/"); // Redirect to landing page if no user profile
      toast.info("Please get started or log in to access this page.");
    } else if (!loading && userProfile && !mealPlan) {
      navigate("/dashboard");
      toast.info("Please generate a meal plan first.");
    }
  }, [userProfile, mealPlan, loading, navigate]);

  useEffect(() => {
    const fetchAllRecipes = async () => {
      if (mealPlan) {
        const uniqueRecipeIds = new Set<string>();
        mealPlan.days.forEach(day => {
          day.meals.forEach(meal => uniqueRecipeIds.add(meal.recipe_id));
        });

        const fetchedRecipes = new Map<string, Recipe>();
        for (const id of Array.from(uniqueRecipeIds)) {
          const token = localStorage.getItem("token");
          if (!token) {
            toast.error("Authentication token not found.");
            return;
          }
          const recipe = await api.getRecipeDetails(id, token);
          if (recipe) {
            fetchedRecipes.set(id, recipe);
          }
        }
        setRecipesMap(fetchedRecipes);
      }
    };
    fetchAllRecipes();
  }, [mealPlan]);

  const handleViewRecipe = async (recipeId: string) => {
    const recipe = recipesMap.get(recipeId);
    if (recipe) {
      setSelectedRecipe(recipe);
      setIsDrawerOpen(true);
    } else {
      toast.error("Recipe details not found.");
    }
  };

  const filteredAndSortedDays = useMemo(() => {
    if (!mealPlan) return [];

    const showVegetarianOnly = activeFilters.includes("vegetarian");
    const showLowCostFirst = activeFilters.includes("low-cost");

    return mealPlan.days.map(day => {
      let filteredMeals = day.meals.filter(meal => {
        const recipe = recipesMap.get(meal.recipe_id);
        if (!recipe) return false;
        if (showVegetarianOnly && !recipe.tags?.includes("vegetarian")) {
          return false;
        }
        return true;
      });

      if (showLowCostFirst) {
        filteredMeals.sort((a, b) => {
          const recipeA = recipesMap.get(a.recipe_id);
          const recipeB = recipesMap.get(b.recipe_id);
          return (recipeA?.estimated_cost || 0) - (recipeB?.estimated_cost || 0);
        });
      }
      return { ...day, meals: filteredMeals };
    });
  }, [mealPlan, recipesMap, activeFilters]); // Depend on activeFilters

  if (loading || !userProfile || !mealPlan) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-green-600" />
        <span className="ml-2 text-gray-600">Loading your meal plan...</span>
      </div>
    );
  }

  const daysOfWeek = [
    "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"
  ];

  // Determine the default tab based on the current day
  const today = new Date();
  const currentDayIndex = today.getDay(); // 0 for Sunday, 1 for Monday
  const defaultTab = daysOfWeek[currentDayIndex === 0 ? 6 : currentDayIndex - 1]; // Adjust for 0-indexed array starting Monday

  return (
    <AppLayout>
      <div className="container mx-auto py-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">
          Your Weekly Meal Plan
        </h1>
        <p className="text-lg text-gray-600 mb-8">
          Here's what's cooking for the week of{" "}
          <span className="font-semibold">{mealPlan.start_date}</span> to{" "}
          <span className="font-semibold">{mealPlan.end_date}</span>.
        </p>

        <div className="mb-6 flex flex-wrap gap-3 items-center">
          <span className="text-gray-700 font-medium mr-2">Filters:</span>
          <ToggleGroup type="multiple" value={activeFilters} onValueChange={setActiveFilters} className="flex-wrap">
            <ToggleGroupItem
              value="vegetarian"
              aria-label="Toggle vegetarian"
              className="data-[state=on]:bg-green-100 data-[state=on]:text-green-700"
            >
              <Salad className="h-4 w-4 mr-2" /> Vegetarian
            </ToggleGroupItem>
            <ToggleGroupItem
              value="low-cost"
              aria-label="Toggle low-cost first"
              className="data-[state=on]:bg-blue-100 data-[state=on]:text-blue-700"
            >
              <DollarSign className="h-4 w-4 mr-2" /> Low-cost first
            </ToggleGroupItem>
          </ToggleGroup>
        </div>

        <Tabs defaultValue={defaultTab} className="w-full">
          <ScrollArea className="w-full whitespace-nowrap rounded-md border bg-white shadow-sm">
            <TabsList className="w-full justify-start h-12">
              {mealPlan.days.map((day: DayPlan) => (
                <TabsTrigger
                  key={day.day_of_week}
                  value={day.day_of_week}
                  className="text-base px-4 py-2 data-[state=active]:bg-green-500 data-[state=active]:text-white data-[state=active]:shadow-sm transition-colors"
                >
                  {day.day_of_week}
                </TabsTrigger>
              ))}
            </TabsList>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>

          {filteredAndSortedDays.map((day: DayPlan) => (
            <TabsContent key={day.day_of_week} value={day.day_of_week} className="mt-6">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">{day.day_of_week}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {day.meals.length > 0 ? (
                  day.meals.map((meal, index) => {
                    const recipe = recipesMap.get(meal.recipe_id);
                    if (!recipe) return null;
                    return (
                      <MealCard
                        key={`${day.day_of_week}-${meal.type}-${index}`}
                        mealType={meal.type}
                        recipe={recipe}
                        onViewRecipe={handleViewRecipe}
                      />
                    );
                  })
                ) : (
                  <p className="text-gray-500 col-span-full p-4 text-center border border-dashed rounded-md bg-gray-50">No meals match your current filters for this day.</p>
                )}
              </div>
            </TabsContent>
          ))}
        </Tabs>

        <Button
          onClick={() => navigate("/shopping-list")}
          className="fixed bottom-6 right-6 bg-green-600 hover:bg-green-700 text-lg px-6 py-3 rounded-full shadow-xl flex items-center space-x-2 animate-pulse-slow"
        >
          <ShoppingCart className="h-5 w-5" />
          <span>View Shopping List</span>
        </Button>
      </div>

      {selectedRecipe && (
        <RecipeDetailDrawer
          recipe={selectedRecipe}
          isOpen={isDrawerOpen}
          onClose={() => setIsDrawerOpen(false)}
        />
      )}
    </AppLayout>
  );
};

export default MealPlanPage;