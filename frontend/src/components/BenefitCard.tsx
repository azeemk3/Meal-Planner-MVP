"use client";

import React from "react";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface BenefitCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  accentColor: string; // Tailwind color class, e.g., "text-green-500"
}

const BenefitCard = ({ title, description, icon: Icon, accentColor }: BenefitCardProps) => {
  return (
    <div
      className={cn(
        "group relative flex flex-col items-center p-6 rounded-3xl shadow-lg border border-dark-border", // Increased roundedness
        "bg-dark-card hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 hover:scale-[1.02]", // Enhanced hover
        "overflow-hidden"
      )}
    >
      {/* Animated border glow on hover */}
      <div className={cn(
        "absolute inset-0 rounded-3xl border-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300",
        accentColor.replace('text-', 'border-') // Dynamically set border color
      )}></div>

      <div className="relative z-10 flex flex-col items-center">
        <Icon className={cn("h-12 w-12 mb-4", accentColor)} /> {/* Larger icon */}
        <h3 className="font-bold text-2xl text-dark-card-foreground mb-2 text-center"> {/* Larger title */}
          {title}
        </h3>
        <p className="text-base text-muted-foreground text-center leading-relaxed"> {/* Softer, increased line-height */}
          {description}
        </p>
      </div>
    </div>
  );
};

export default BenefitCard;