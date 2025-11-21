"use client";

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AppLayout from "@/components/layout/AppLayout";
import { useMealPlan } from "@/context/MealPlanContext";
import { Loader2, ShoppingCart, DollarSign, LayoutList, Store } from "lucide-react"; // Added LayoutList and Store icons
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { ShoppingListItem } from "@/types";
import { api } from "@/services/api";

const ShoppingListPage = () => {
  const navigate = useNavigate();
  const { userProfile, mealPlan, loading } = useMealPlan();
  const [shoppingList, setShoppingList] = useState<ShoppingListItem[]>([]);
  const [listLoading, setListLoading] = useState(true);

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
    const fetchShoppingList = async () => {
      if (mealPlan && mealPlan._id) {
        setListLoading(true);
        try {
          const token = localStorage.getItem("token");
          if (!token) {
            throw new Error("No token found");
          }
          const fetchedList = await api.getShoppingList(mealPlan, token);
          // Load purchased state from localStorage if available
          const savedPurchasedState = JSON.parse(localStorage.getItem(`purchased_items_${mealPlan.id}`) || "{}");
          const listWithPurchasedState = fetchedList.items.map((item: any) => ({
            ...item,
            id: `${item.ingredient}-${item.unit}`, // Create a unique ID
            purchased: savedPurchasedState[`${item.ingredient}-${item.unit}`] || false
          }));
          setShoppingList(listWithPurchasedState);
        } catch (error) {
          console.error("Failed to fetch shopping list:", error);
          toast.error("Failed to load shopping list.");
        } finally {
          setListLoading(false);
        }
      }
    };
    fetchShoppingList();
  }, [mealPlan]);

  const handleTogglePurchased = (itemId: string, checked: boolean) => {
    setShoppingList((prevList) => {
      const updatedList = prevList.map((item) =>
        item.id === itemId ? { ...item, purchased: checked } : item,
      );
      // Save purchased state to localStorage
      if (mealPlan) {
        const savedPurchasedState = JSON.parse(localStorage.getItem(`purchased_items_${mealPlan.id}`) || "{}");
        localStorage.setItem(`purchased_items_${mealPlan.id}`, JSON.stringify({
          ...savedPurchasedState,
          [itemId]: checked
        }));
      }
      return updatedList;
    });
  };

  if (loading || listLoading || !userProfile || !mealPlan) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-green-600" />
        <span className="ml-2 text-gray-600">Loading your shopping list...</span>
      </div>
    );
  }

  const getGroupedList = () => {
    const grouped: Record<string, ShoppingListItem[]> = {};
    shoppingList.forEach(item => {
      const groupKey = item.category;
      (grouped[groupKey] = grouped[groupKey] || []).push(item);
    });
    return grouped;
  };

  const currentGroupedList = getGroupedList();

  return (
    <AppLayout>
      <div className="container mx-auto py-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">
          Your Optimized Shopping List
        </h1>
        <p className="text-lg text-gray-600 mb-8">
          Here's a consolidated list of ingredients for your weekly meal plan.
        </p>


        <div className="space-y-8">
          {Object.keys(currentGroupedList).sort().map((groupKey) => (
            <Card key={groupKey} className="bg-white shadow-md">
              <CardHeader className="bg-gray-50 py-3 px-6 rounded-t-lg">
                <CardTitle className="text-xl font-semibold text-gray-800">
                  {groupKey}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <ul className="space-y-3">
                  {currentGroupedList[groupKey].map((item) => (
                    <li key={item.id} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Checkbox
                          id={`item-${item.id}`}
                          checked={item.purchased}
                          onCheckedChange={(checked) => handleTogglePurchased(item.id, checked as boolean)}
                          className="h-5 w-5"
                        />
                        <Label
                          htmlFor={`item-${item.id}`}
                          className={`text-base ${item.purchased ? "line-through text-gray-500" : "text-gray-700"} cursor-pointer`}
                        >
                          {item.ingredient} ({item.quantity} {item.unit})
                        </Label>
                      </div>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </AppLayout>
  );
};

export default ShoppingListPage;