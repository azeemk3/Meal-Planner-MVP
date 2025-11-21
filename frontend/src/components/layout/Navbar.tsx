"use client";

import React from "react";
import { Link, useLocation } from "react-router-dom"; // Added useLocation
import { Button } from "@/components/ui/button";
import { Home, Utensils, ShoppingCart, Leaf, Users, Settings, Menu } from "lucide-react"; // Added Menu icon
import { useMealPlan } from "@/context/MealPlanContext";
import { toast } from "sonner";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"; // New imports for mobile menu

const Navbar = () => {
  const { clearData } = useMealPlan();
  const location = useLocation(); // To determine active link

  const handleClearData = () => {
    clearData();
    toast.info("Local data cleared. Redirecting to landing page.");
    window.location.href = "/"; // Simple redirect for now
  };

  const navItems = [
    { name: "Dashboard", icon: Home, path: "/dashboard" },
    { name: "Meal Plan", icon: Utensils, path: "/meal-plan" },
    { name: "Shopping List", icon: ShoppingCart, path: "/shopping-list" },
    { name: "Leftovers", icon: Leaf, path: "/leftovers" },
    { name: "Community", icon: Users, path: "/community" },
  ];

  return (
    <nav className="bg-white shadow-md p-4 flex items-center justify-between sticky top-0 z-50 border-b border-gray-100">
      <Link to="/dashboard" className="flex items-center space-x-2">
        <img src="/placeholder.svg" alt="MealPlanner Logo" className="h-9 w-9" />
        <span className="text-2xl font-bold text-green-600">MealPlanner</span>
      </Link>

      {/* Desktop Navigation */}
      <div className="hidden md:flex space-x-2">
        {navItems.map((item) => (
          <Button
            key={item.name}
            variant={location.pathname === item.path ? "secondary" : "ghost"}
            asChild
            className={location.pathname === item.path ? "bg-green-100 text-green-700 hover:bg-green-200" : "hover:bg-gray-100"}
          >
            <Link to={item.path} className="flex items-center space-x-2 px-4 py-2 rounded-md text-base font-medium">
              <item.icon className="h-5 w-5" />
              <span>{item.name}</span>
            </Link>
          </Button>
        ))}
      </div>

      <div className="flex items-center space-x-2">
        <Button variant="ghost" size="icon" onClick={() => toast.info("Settings not implemented yet.")} className="hover:bg-gray-100">
          <Settings className="h-5 w-5 text-gray-600" />
          <span className="sr-only">Settings</span>
        </Button>
        {/* For development/testing: Clear Data button */}
        <Button variant="outline" onClick={handleClearData} className="text-sm border-gray-300 hover:border-gray-400 hover:bg-gray-50">
          Clear Data
        </Button>

        {/* Mobile Navigation Toggle */}
        <Sheet>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="ghost" size="icon">
              <Menu className="h-6 w-6" />
              <span className="sr-only">Toggle navigation menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[250px] sm:w-[300px] p-4">
            <div className="flex flex-col space-y-4 pt-8">
              {navItems.map((item) => (
                <Button
                  key={item.name}
                  variant={location.pathname === item.path ? "secondary" : "ghost"}
                  asChild
                  className={location.pathname === item.path ? "bg-green-100 text-green-700 hover:bg-green-200 justify-start" : "hover:bg-gray-100 justify-start"}
                >
                  <Link to={item.path} className="flex items-center space-x-3 text-lg font-medium">
                    <item.icon className="h-5 w-5" />
                    <span>{item.name}</span>
                  </Link>
                </Button>
              ))}
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </nav>
  );
};

export default Navbar;