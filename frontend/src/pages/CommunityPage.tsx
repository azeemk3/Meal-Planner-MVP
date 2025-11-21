"use client";

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AppLayout from "@/components/layout/AppLayout";
import { useMealPlan } from "@/context/MealPlanContext";
import { Loader2, Users, Share2, BookOpen } from "lucide-react"; // Added BookOpen icon
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { CommunityRecipe } from "@/types";
import { api } from "@/services/api";
import { Badge } from "@/components/ui/badge";

const CommunityPage = () => {
  const navigate = useNavigate();
  const { userProfile, loading } = useMealPlan();
  const [communityRecipes, setCommunityRecipes] = useState<CommunityRecipe[]>([]);
  const [pageLoading, setPageLoading] = useState(true);

  useEffect(() => {
    if (!loading && !userProfile) {
      navigate("/"); // Redirect to landing page if no user profile
      toast.info("Please get started or log in to access this page.");
    }
  }, [userProfile, loading, navigate]);

  useEffect(() => {
    const fetchCommunityRecipes = async () => {
      setPageLoading(true);
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          toast.error("Authentication token not found.");
          return;
        }
        const recipes = await api.getCommunityRecipes(token);
        setCommunityRecipes(recipes);
      } catch (error) {
        console.error("Failed to fetch community recipes:", error);
        toast.error("Failed to load community recipes.");
      } finally {
        setPageLoading(false);
      }
    };
    fetchCommunityRecipes();
  }, []);

  const handleShareRecipeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.info("Recipe sharing is a future feature! Your recipe won't be saved yet.");
    // TODO: Implement actual recipe sharing logic post-MVP
  };

  if (loading || pageLoading || !userProfile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-green-600" />
        <span className="ml-2 text-gray-600">Loading community recipes...</span>
      </div>
    );
  }

  return (
    <AppLayout>
      <div className="container mx-auto py-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">
          Community Recipes
        </h1>
        <p className="text-lg text-gray-600 mb-8">
          Discover delicious and budget-friendly recipes shared by the MealPlanr
          community!
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            {communityRecipes.map((recipe) => (
              <Card key={recipe.id} className="bg-white shadow-lg flex flex-col sm:flex-row hover:shadow-xl transition-shadow duration-300">
                {recipe.image_url && (
                  <img
                    src={recipe.image_url}
                    alt={recipe.name}
                    className="w-full sm:w-40 h-40 object-cover rounded-t-lg sm:rounded-t-none sm:rounded-l-lg"
                  />
                )}
                <CardContent className="p-4 flex-1">
                  <CardTitle className="text-xl font-semibold text-gray-800 mb-2 flex items-center space-x-2">
                    <BookOpen className="h-5 w-5 text-blue-600" />
                    <span>{recipe.name}</span>
                  </CardTitle>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {recipe.tags.map((tag, index) => (
                      <Badge key={index} variant="secondary" className="bg-gray-100 text-gray-700">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  <p className="text-gray-600 line-clamp-3">
                    {recipe.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card className="bg-white shadow-lg p-6 lg:col-span-1">
            <CardHeader className="p-0 mb-4">
              <CardTitle className="text-2xl font-bold text-gray-800 flex items-center space-x-2">
                <Share2 className="h-6 w-6 text-green-600" />
                <span>Share a Recipe</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <p className="text-gray-600 mb-4">
                Have a great recipe to share? Let the community know!
              </p>
              <form onSubmit={handleShareRecipeSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="recipe-name" className="text-gray-700">Recipe Name</Label>
                  <Input id="recipe-name" placeholder="e.g., Quick Lentil Curry" className="mt-1" />
                </div>
                <div>
                  <Label htmlFor="recipe-description" className="text-gray-700">Description</Label>
                  <Textarea
                    id="recipe-description"
                    placeholder="A short description of your recipe..."
                    rows={3}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="recipe-tags" className="text-gray-700">Tags (comma-separated)</Label>
                  <Input id="recipe-tags" placeholder="e.g., budget-friendly, vegetarian" className="mt-1" />
                </div>
                <Button type="submit" className="w-full bg-green-600 hover:bg-green-700 shadow-md hover:shadow-lg transition-all duration-300">
                  Submit Recipe (UI Only)
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
};

export default CommunityPage;