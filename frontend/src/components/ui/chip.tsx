"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";

interface ChipProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  onRemove?: () => void;
  variant?: "default" | "outline";
}

const Chip = React.forwardRef<HTMLDivElement, ChipProps>(
  ({ className, children, onRemove, variant = "default", ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "inline-flex items-center rounded-full px-3 py-1 text-sm font-medium transition-colors",
          variant === "default" && "bg-green-100 text-green-800",
          variant === "outline" && "border border-green-300 text-green-700",
          className,
        )}
        {...props}
      >
        {children}
        {onRemove && (
          <button
            type="button"
            onClick={onRemove}
            className="ml-1.5 -mr-1 h-4 w-4 rounded-full bg-green-200 text-green-600 hover:bg-green-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
          >
            <X className="h-3 w-3" />
            <span className="sr-only">Remove</span>
          </button>
        )}
      </div>
    );
  },
);
Chip.displayName = "Chip";

export { Chip };