"use client";

import React from "react";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Recipe } from "@/types";
import { toast } from "sonner";
import { Utensils, ListChecks, DollarSign } from "lucide-react"; // Added icons

interface RecipeDetailDrawerProps {
  recipe: Recipe;
  isOpen: boolean;
  onClose: () => void;
}

const RecipeDetailDrawer = ({
  recipe,
  isOpen,
  onClose,
}: RecipeDetailDrawerProps) => {
  return (
    <Drawer open={isOpen} onOpenChange={onClose}>
      <DrawerContent className="h-[90%] flex flex-col">
        <DrawerHeader className="text-left p-6 pb-0">
          <DrawerTitle className="text-4xl font-bold text-gray-900">
            {recipe.name}
          </DrawerTitle>
          <DrawerDescription className="text-gray-600 mt-2 text-lg">
            {recipe.description}
          </DrawerDescription>
          <div className="mt-4 flex items-center text-xl font-semibold text-green-700">
            <DollarSign className="h-6 w-6 mr-2" /> Estimated Cost: ${recipe.estimated_cost.toFixed(2)}
          </div>
        </DrawerHeader>

        <ScrollArea className="flex-1 p-6 pt-4">
          <div className="mb-8">
            <h3 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center">
              <ListChecks className="h-6 w-6 mr-2 text-blue-600" /> Ingredients
            </h3>
            <ul className="list-disc list-inside space-y-2 text-gray-700 text-lg">
              {recipe.ingredients.map((ing, index) => (
                <li key={index}>
                  <span className="font-medium">{ing.quantity} {ing.unit}</span> {ing.item_name}
                </li>
              ))}
            </ul>
          </div>

          <Separator className="my-8" />

          <div className="mb-8">
            <h3 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center">
              <Utensils className="h-6 w-6 mr-2 text-red-600" /> Instructions
            </h3>
            <ol className="list-decimal list-inside space-y-3 text-gray-700 text-lg">
              {recipe.instructions.map((instruction, index) => (
                <li key={index}>{instruction}</li>
              ))}
            </ol>
          </div>

          <Separator className="my-8" />

          <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg border border-gray-200">
            <Checkbox
              id="mark-available"
              onCheckedChange={() => toast.info("Feature not implemented yet.")}
              className="h-5 w-5"
            />
            <Label htmlFor="mark-available" className="text-base text-gray-700 cursor-pointer">
              Mark ingredients as available at home (for leftover logic)
            </Label>
          </div>
        </ScrollArea>

        <DrawerFooter className="pt-4 p-6 border-t border-gray-200 bg-white">
          <DrawerClose asChild>
            <Button variant="outline" className="w-full py-3 text-lg border-gray-300 hover:border-gray-400 hover:bg-gray-50">Close</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

export default RecipeDetailDrawer;