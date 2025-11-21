"use client";

import React from "react";
import AuthLayout from "@/components/layout/AuthLayout";
import { PiggyBank, Clock, Trash2 } from "lucide-react";
import HeroAuthCard from "@/components/HeroAuthCard";
import BenefitCard from "@/components/BenefitCard";
import Footer from "@/components/layout/Footer"; // New import

const LandingPage = () => {
  return (
    <AuthLayout>
      <div className="min-h-screen flex flex-col items-center justify-center p-4 sm:p-8 bg-dark-background text-dark-foreground animate-fade-in"> {/* Added fade-in animation */}
        <div className="w-full max-w-7x6 mx-auto space-y-24 py-16"> {/* Increased vertical spacing */}
          {/* Hero Section */}
          <HeroAuthCard
            title="MealPlanner: Smart Meals, Smarter Savings"
            subtitle="Your AI-driven partner for budget-friendly meal planning, optimized grocery costs, and reduced food waste."
            supportingText="Plan your weekly meals in minutes while staying on budget."
          />

          {/* Benefits Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 px-4"> {/* Increased gap */}
            <BenefitCard
              title="Save Money"
              description="Reduce grocery costs by 20-30% with smart planning and optimized lists."
              icon={PiggyBank}
              accentColor="text-dark-primary" // Green
            />
            <BenefitCard
              title="Save Time"
              description="Generate personalized weekly meal plans in minutes, not hours."
              icon={Clock}
              accentColor="text-dark-secondary" // Orange
            />
            <BenefitCard
              title="Reduce Waste"
              description="Minimize food waste with intelligent leftover suggestions and smart portions."
              icon={Trash2}
              accentColor="text-teal-400" // Soft teal
            />
          </div>
        </div>
        <Footer /> {/* Added Footer */}
      </div>
    </AuthLayout>
  );
};

export default LandingPage;
