"use client";

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import AuthLayout from "@/components/layout/AuthLayout";
import Stepper from "@/components/ui/stepper";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useMealPlan } from "@/context/MealPlanContext";
import { toast } from "sonner";

const formSchema = z.object({
  name: z.string().optional(),
  // coerce = accept string from input and convert to number
  familySize: z
    .coerce
    .number()
    .min(1, "Family size must be at least 1"),
  dietaryRestrictions: z.array(z.string()).optional(),
  weeklyBudget: z
    .coerce
    .number()
    .min(10, "Budget must be at least $10"),
});

const dietaryOptions = [
  "Vegetarian",
  "Vegan",
  "Gluten-Free",
  "Dairy-Free",
  "Nut-Free",
  "Halal",
  "Kosher",
  "Low-Carb",
  "Low-Sugar",
  "Pescatarian",
];

const OnboardingPage = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const navigate = useNavigate();
  const { saveProfile, loading } = useMealPlan();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      familySize: 1,
      dietaryRestrictions: [],
      weeklyBudget: 50,
    },
  });

  // watch ensures the label & inputs re-render when the value changes
  const weeklyBudget = form.watch("weeklyBudget") ?? 50;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (currentStep < steps.length - 1) {
      setCurrentStep((prev) => prev + 1);
    } else {
      try {
        const profileData = {
          name: values.name,
          family_size: values.familySize,
          dietary_restrictions: values.dietaryRestrictions || [],
          weekly_budget: values.weeklyBudget,
        };
        await saveProfile(profileData as any);
        navigate("/dashboard");
      } catch (error) {
        console.error("Onboarding failed:", error);
        toast.error("Failed to complete onboarding. Please try again.");
      }
    }
  };

  const steps = [
    {
      label: "About You",
      content: (
        <>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Tell us about your family
          </h2>
          <p className="text-gray-600 mb-6">
            This helps us tailor meal plans just for you.
          </p>
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem className="mb-6">
                <FormLabel>Your Name (Optional)</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., Sarah" {...field} />
                </FormControl>
                <FormDescription>
                  How should we address you?
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="familySize"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Number of people in your family</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="e.g., 4"
                    value={field.value}
                    onChange={(e) => field.onChange(e.target.value)}
                    min={1}
                  />
                </FormControl>
                <FormDescription>
                  Including yourself and any children.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </>
      ),
    },
    {
      label: "Preferences",
      content: (
        <>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Any dietary restrictions or preferences?
          </h2>
          <p className="text-gray-600 mb-6">
            Select all that apply to ensure your meal plans are perfect.
          </p>
          <FormField
            control={form.control}
            name="dietaryRestrictions"
            render={() => (
              <FormItem>
                <div className="mb-4">
                  <FormLabel className="text-base">Dietary Needs</FormLabel>
                  <FormDescription>
                    Choose any restrictions or preferences.
                  </FormDescription>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {dietaryOptions.map((item) => (
                    <FormField
                      key={item}
                      control={form.control}
                      name="dietaryRestrictions"
                      render={({ field }) => {
                        return (
                          <FormItem
                            key={item}
                            className="flex flex-row items-start space-x-3 space-y-0"
                          >
                            <FormControl>
                              <Checkbox
                                checked={field.value?.includes(item)}
                                onCheckedChange={(checked) => {
                                  return checked
                                    ? field.onChange([
                                        ...(field.value || []),
                                        item,
                                      ])
                                    : field.onChange(
                                        (field.value || []).filter(
                                          (value: string) => value !== item,
                                        ),
                                      );
                                }}
                              />
                            </FormControl>
                            <FormLabel className="font-normal">
                              {item}
                            </FormLabel>
                          </FormItem>
                        );
                      }}
                    />
                  ))}
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
        </>
      ),
    },
    {
      label: "Budget",
      content: (
        <>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            What's your weekly grocery budget?
          </h2>
          <p className="text-gray-600 mb-6">
            We'll help you stick to it and find the best deals.
          </p>

          <FormField
            control={form.control}
            name="weeklyBudget"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Weekly Budget: ${weeklyBudget}</FormLabel>
                <FormControl>
                  <Slider
                    min={10}
                    max={500}
                    step={5}
                    value={[weeklyBudget]}
                    onValueChange={(vals) => field.onChange(vals[0])}
                    className="w-full"
                  />
                </FormControl>

                <Input
                  type="number"
                  min={10}
                  max={500}
                  step={5}
                  value={weeklyBudget}
                  onChange={(e) => field.onChange(e.target.value)}
                  className="mt-4"
                />

                <FormDescription>
                  Adjust the slider or type in your desired weekly grocery budget.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </>
      ),
    },
  ];

  return (
    <AuthLayout>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className="mt-8">
            {steps[currentStep].content}
          </div>

          <div className="flex justify-between mt-8">
            {currentStep > 0 && (
              <Button
                type="button"
                variant="outline"
                onClick={() => setCurrentStep((prev) => prev - 1)}
                disabled={loading}
              >
                Previous
              </Button>
            )}
            <Button
              type="submit"
              className="ml-auto bg-green-600 hover:bg-green-700"
              disabled={loading}
            >
              {loading
                ? "Saving..."
                : currentStep < steps.length - 1
                ? "Next"
                : "Finish Setup"}
            </Button>
          </div>
        </form>
      </Form>
    </AuthLayout>
  );
};

export default OnboardingPage;