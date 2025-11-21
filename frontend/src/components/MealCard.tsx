"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Utensils, Soup, Coffee, Apple } from "lucide-react";
import { MealType, Recipe } from "@/types";

interface MealCardProps {
  mealType: MealType;
  recipe: Recipe;
  onViewRecipe: (recipeId: string) => void;
}

const getMealIcon = (mealType: MealType) => {
  switch (mealType) {
    case "Breakfast":
      return <Coffee className="h-5 w-5 text-blue-500" />;
    case "Lunch":
      return <Soup className="h-5 w-5 text-green-500" />;
    case "Dinner":
      return <Utensils className="h-5 w-5 text-red-500" />;
    case "Snack":
      return <Apple className="h-5 w-5 text-yellow-500" />;
    default:
      return <Utensils className="h-5 w-5 text-gray-500" />;
  }
};

const MealCard = ({ mealType, recipe, onViewRecipe }: MealCardProps) => {
  return (
    <Card className="bg-white shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-lg font-semibold flex items-center space-x-2 text-gray-700">
          {getMealIcon(mealType)}
          <span>{mealType}</span>
        </CardTitle>
        <span className="text-base font-medium text-green-700">
          ${recipe.estimated_cost.toFixed(2)}
        </span>
      </CardHeader>
      <CardContent>
        <h3 className="text-xl font-bold text-gray-800 mb-2">
          {recipe.name}
        </h3>
        <p className="text-sm text-gray-600 mb-4 line-clamp-2">
          {recipe.description}
        </p>
        <Button
          variant="outline"
          className="w-full border-gray-300 hover:border-gray-400 hover:bg-gray-50 transition-colors duration-200"
          onClick={() => onViewRecipe(recipe.id)}
        >
          View Recipe
        </Button>
      </CardContent>
    </Card>
  );
};

export default MealCard;