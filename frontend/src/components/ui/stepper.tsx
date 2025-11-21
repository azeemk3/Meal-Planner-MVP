"use client";

import React, { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface StepperProps {
  steps: { label: string; content: ReactNode }[];
  currentStep: number;
}

const Stepper = ({ steps, currentStep }: StepperProps) => {
  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-8">
        {steps.map((step, index) => (
          <React.Fragment key={index}>
            <div className="flex flex-col items-center">
              <div
                className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center font-bold text-white",
                  index <= currentStep ? "bg-green-600" : "bg-gray-300",
                )}
              >
                {index + 1}
              </div>
              <span
                className={cn(
                  "text-sm mt-2 text-center",
                  index <= currentStep ? "text-green-700" : "text-gray-500",
                )}
              >
                {step.label}
              </span>
            </div>
            {index < steps.length - 1 && (
              <div
                className={cn(
                  "flex-1 h-0.5 mx-2",
                  index < currentStep ? "bg-green-600" : "bg-gray-300",
                )}
              />
            )}
          </React.Fragment>
        ))}
      </div>
      <div>{steps[currentStep].content}</div>
    </div>
  );
};

export default Stepper;