export interface UserProfile {
  id: string;
  email?: string; // Optional for MVP, as real auth is deferred
  name?: string;
  family_size: number;
  dietary_restrictions: string[];
  weekly_budget: number;
  created_date: string;
  last_modified_date: string;
}

export interface IngredientItem {
  item_name: string;
  quantity: number;
  unit: string;
}

export interface Recipe {
  id: string;
  name: string;
  description: string;
  ingredients: IngredientItem[];
  instructions: string[];
  estimated_cost: number;
  tags?: string[];
  source: "AI Generated" | "Community";
}

export type MealType = "Breakfast" | "Lunch" | "Dinner" | "Snack";

export interface Meal {
  type: MealType;
  recipe_id: string;
}

export interface DayPlan {
  day_of_week: string; // e.g., "Monday", "Tuesday"
  meals: Meal[];
}

export interface MealPlan {
  id: string;
  _id?: string;
  user_id: string;
  start_date: string; // ISO date string
  end_date: string; // ISO date string
  days: DayPlan[];
  estimated_spend: number;
  estimated_savings_percentage: number;
  created_date: string; // ISO datetime string
}

export interface ShoppingListItem {
  id: string;
  ingredient: string;
  quantity: number;
  unit: string;
  category: string;
  purchased: boolean;
}

export interface LeftoverSuggestion {
  id: string;
  suggested_recipe_name: string;
  description: string;
  ingredients_to_use: string[];
}

export interface CommunityRecipe {
  id: string;
  name: string;
  description: string;
  tags: string[];
  image_url?: string;
}