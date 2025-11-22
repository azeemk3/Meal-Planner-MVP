import { UserProfile } from "@/types";

const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

export const api = {
  signup: async (userData: any) => {
    const response = await fetch(`${API_URL}/auth/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      throw new Error("Failed to sign up");
    }

    return response.json();
  },

  login: async (credentials: any) => {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      throw new Error("Failed to log in");
    }

    return response.json();
  },

  /**
   * getMe – KEEPING POST as you requested.
   * - If no token: returns null (anonymous user)
   * - If 401: returns null instead of throwing
   * - Only throws on unexpected errors
   */
  getMe: async (token?: string | null) => {
    // No token at all → treat as not logged in
    if (!token) {
      return null;
    }

    const response = await fetch(`${API_URL}/user/me`, {
      method: "POST", // <-- staying POST
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      // no body: backend should just use get_current_user
    });

    if (response.status === 401) {
      // Invalid/expired token → just say "no user"
      return null;
    }

    if (!response.ok) {
      console.error(
        "getMe failed",
        response.status,
        await response.text().catch(() => ""),
      );
      throw new Error("Failed to fetch user data");
    }

    return response.json();
  },

  getUserProfile: async (token: string) => {
    const response = await fetch(`${API_URL}/user/profile`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch user profile");
    }

    return response.json();
  },

  saveUserProfile: async (profileData: any, token: string) => {
    const response = await fetch(`${API_URL}/user/profile`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(profileData),
    });

    if (!response.ok) {
      throw new Error("Failed to save user profile");
    }

    return response.json();
  },

  generateMealPlan: async (token: string) => {
    const response = await fetch(`${API_URL}/generate-meal-plan`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to generate meal plan");
    }

    return response.json();
  },

  getCurrentMealPlan: async (token: string) => {
    const response = await fetch(`${API_URL}/meal-plan/current`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch current meal plan");
    }

    return response.json();
  },

  // you told backend to keep recipes as POST, so leaving this as POST
  getRecipeDetails: async (recipeId: string, token: string) => {
    const response = await fetch(`${API_URL}/recipes/${recipeId}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch recipe details");
    }

    return response.json();
  },

  getLeftoverSuggestions: async (userProfile: any, token: string) => {
    const response = await fetch(`${API_URL}/leftover-suggestions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(userProfile),
    });

    if (!response.ok) {
      throw new Error("Failed to fetch leftover suggestions");
    }

    return response.json();
  },

  // also left as POST since that's what you set on backend
  getCommunityRecipes: async (token: string) => {
    const response = await fetch(`${API_URL}/community-recipes`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch community recipes");
    }

    return response.json();
  },

  // keep as POST if your backend expects a full mealPlan body
  getShoppingList: async (mealPlan: any, token: string) => {
    const response = await fetch(`${API_URL}/shopping-list`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(mealPlan),
    });

    if (!response.ok) {
      throw new Error("Failed to fetch shopping list");
    }

    return response.json();
  },
};
