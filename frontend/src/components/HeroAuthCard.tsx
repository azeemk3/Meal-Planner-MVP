"use client";

import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils"; // For utility classes

interface HeroAuthCardProps {
  title: string;
  subtitle: string;
  supportingText: string;
}

const HeroAuthCard = ({ title, subtitle, supportingText }: HeroAuthCardProps) => {
  return (
    <div
      className={cn(
        "relative p-8 sm:p-10 lg:p-12 rounded-4xl shadow-4xl max-w-3xl mx-auto", // Increased roundedness and shadow
        "bg-gradient-to-br from-emerald-950 to-dark-navy", // Deep green/teal to dark navy gradient
        "border border-dark-border overflow-hidden",
        "transition-all duration-300 ease-in-out",
        "hover:shadow-4xl hover:border-dark-primary/50 hover:scale-[1.005]"
      )}
    >
      {/* Subtle radial gradient for depth */}
      <div className="absolute inset-0 opacity-30 pointer-events-none">
        <div className="absolute -top-1/4 -left-1/4 w-1/2 h-1/2 bg-dark-primary rounded-full mix-blend-soft-light filter blur-3xl opacity-20 animate-pulse-slow"></div>
        <div className="absolute -bottom-1/4 -right-1/4 w-1/2 h-1/2 bg-dark-secondary rounded-full mix-blend-soft-light filter blur-3xl opacity-20 animate-pulse-slow delay-200"></div>
      </div>

      {/* Background pattern/texture for visual interest */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <svg className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
          <pattern id="pattern-circles" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
            <circle cx="2" cy="2" r="1" fill="rgba(255,255,255,0.05)" />
          </pattern>
          <rect x="0" y="0" width="100%" height="100%" fill="url(#pattern-circles)" />
        </svg>
      </div>

      <div className="relative z-10 text-center">
        <img
          src="/placeholder.svg"
          alt="MealPlanner Logo"
          className="mx-auto h-28 w-28 mb-8 animate-bounce-slow drop-shadow-lg" // Larger logo
        />
        <h1 className="text-5xl sm:text-7xl font-extrabold text-dark-primary-foreground mb-4 leading-tight tracking-tight"> {/* Larger, tighter tracking */}
          {title}
        </h1>
        <p className="text-lg sm:text-xl text-dark-primary-foreground opacity-80 mb-10 max-w-lg mx-auto leading-relaxed"> {/* Softer, increased line-height */}
          {subtitle}
        </p>

        <div className="space-y-4 max-w-sm mx-auto">
          <Button asChild
            className={cn(
              "w-full py-7 text-xl font-semibold rounded-full", // Pill button
              "bg-dark-primary text-dark-primary-foreground",
              "shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02]",
              "hover:bg-dark-primary/90 active:scale-[0.98] focus:ring-2 focus:ring-dark-primary focus:ring-offset-2 focus:ring-offset-dark-card",
              "animate-glow-pulse" // Glowing effect
            )}
          >
            <Link to="/signup">Get Started</Link>
          </Button>
          <Button asChild
            variant="outline"
            className={cn(
              "w-full py-7 text-xl font-semibold rounded-full", // Pill button
              "border-dark-primary text-dark-primary-foreground",
              "bg-transparent hover:bg-dark-primary/10",
              "shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-[1.02]",
              "active:scale-[0.98] focus:ring-2 focus:ring-dark-primary focus:ring-offset-2 focus:ring-offset-dark-card"
            )}
          >
            <Link to="/login">Log In</Link>
          </Button>
        </div>
        <p className="text-sm text-muted-foreground opacity-70 mt-6"> {/* Softer text color */}
          {supportingText}
        </p>
      </div>
    </div>
  );
};

export default HeroAuthCard;
