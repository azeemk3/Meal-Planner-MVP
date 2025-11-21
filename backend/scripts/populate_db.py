import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
from pymongo import MongoClient
from app.db import get_database
import os
import sys
from dotenv import load_dotenv

# Add the project root to the Python path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
load_dotenv()

mock_recipes = [
  {
    "name": "Hearty Oatmeal with Berries",
    "description": "A warm and nutritious start to your day.",
    "ingredients": [
      { "item_name": "Rolled Oats", "quantity": 0.5, "unit": "cup" },
      { "item_name": "Milk", "quantity": 1, "unit": "cup" },
      { "item_name": "Mixed Berries", "quantity": 0.5, "unit": "cup" },
      { "item_name": "Honey", "quantity": 1, "unit": "tbsp" },
    ],
    "instructions": [
      "Combine oats and milk in a saucepan.",
      "Bring to a boil, then reduce heat and simmer for 5 minutes, stirring occasionally.",
      "Stir in berries and honey. Serve warm.",
    ],
    "estimated_cost": 1.5,
    "tags": ["vegetarian", "healthy"],
    "source": "AI Generated",
  },
  {
    "name": "Chicken and Veggie Stir-fry",
    "description": "Quick and healthy stir-fry with seasonal vegetables.",
    "ingredients": [
      { "item_name": "Chicken Breast", "quantity": 200, "unit": "g" },
      { "item_name": "Broccoli", "quantity": 1, "unit": "head" },
      { "item_name": "Carrots", "quantity": 2, "unit": "medium" },
      { "item_name": "Soy Sauce", "quantity": 2, "unit": "tbsp" },
      { "item_name": "Rice", "quantity": 1, "unit": "cup" },
    ],
    "instructions": [
      "Cook rice according to package directions.",
      "Slice chicken and vegetables.",
      "Heat oil in a large skillet or wok. Add chicken and cook until browned.",
      "Add vegetables and stir-fry until tender-crisp.",
      "Stir in soy sauce and serve over rice.",
    ],
    "estimated_cost": 4.75,
    "tags": ["dinner", "healthy", "quick"],
    "source": "AI Generated",
  },
  {
    "name": "Lentil Soup",
    "description": "A comforting and budget-friendly lentil soup.",
    "ingredients": [
      { "item_name": "Brown Lentils", "quantity": 1, "unit": "cup" },
      { "item_name": "Vegetable Broth", "quantity": 4, "unit": "cups" },
      { "item_name": "Onion", "quantity": 1, "unit": "medium" },
      { "item_name": "Carrots", "quantity": 2, "unit": "medium" },
      { "item_name": "Celery", "quantity": 2, "unit": "stalks" },
      { "item_name": "Diced Tomatoes", "quantity": 1, "unit": "can" },
    ],
    "instructions": [
      "Rinse lentils. Chop onion, carrots, and celery.",
      "Sauté vegetables in a large pot until softened.",
      "Add lentils, broth, and diced tomatoes. Bring to a boil, then reduce heat and simmer for 25-30 minutes, or until lentils are tender.",
      "Season with salt and pepper to taste.",
    ],
    "estimated_cost": 3.2,
    "tags": ["vegetarian", "budget-friendly", "lunch", "dinner"],
    "source": "AI Generated",
  },
  {
    "name": "Peanut Butter Banana Smoothie",
    "description": "A quick and energizing snack or breakfast.",
    "ingredients": [
      { "item_name": "Banana", "quantity": 1, "unit": "medium" },
      { "item_name": "Peanut Butter", "quantity": 2, "unit": "tbsp" },
      { "item_name": "Milk", "quantity": 1, "unit": "cup" },
      { "item_name": "Ice Cubes", "quantity": 0.5, "unit": "cup" },
    ],
    "instructions": [
      "Combine all ingredients in a blender.",
      "Blend until smooth and creamy.",
      "Pour into a glass and serve immediately.",
    ],
    "estimated_cost": 2.0,
    "tags": ["snack", "quick", "healthy"],
    "source": "AI Generated",
  },
  {
    "name": "Pasta with Marinara Sauce",
    "description": "A simple and classic family favorite.",
    "ingredients": [
      { "item_name": "Pasta", "quantity": 250, "unit": "g" },
      { "item_name": "Marinara Sauce", "quantity": 1, "unit": "jar" },
      { "item_name": "Ground Beef", "quantity": 250, "unit": "g" },
      { "item_name": "Parmesan Cheese", "quantity": 0.25, "unit": "cup" },
    ],
    "instructions": [
      "Cook pasta according to package directions.",
      "Brown ground beef in a skillet, drain fat.",
      "Add marinara sauce to beef and simmer.",
      "Serve sauce over pasta, topped with Parmesan cheese.",
    ],
    "estimated_cost": 5.5,
    "tags": ["dinner", "kids-friendly", "quick"],
    "source": "AI Generated",
  },
  {
    "name": "Scrambled Eggs with Toast",
    "description": "A simple and quick breakfast.",
    "ingredients": [
      { "item_name": "Eggs", "quantity": 2, "unit": "large" },
      { "item_name": "Bread", "quantity": 2, "unit": "slices" },
      { "item_name": "Butter", "quantity": 1, "unit": "tsp" },
    ],
    "instructions": [
      "Whisk eggs in a bowl. Melt butter in a non-stick pan over medium heat.",
      "Pour eggs into the pan and scramble until cooked to your liking.",
      "Toast bread. Serve eggs with toast.",
    ],
    "estimated_cost": 1.2,
    "tags": ["breakfast", "quick", "budget-friendly"],
    "source": "AI Generated",
  },
  {
    "name": "Tuna Salad Sandwich",
    "description": "A classic sandwich for a quick lunch.",
    "ingredients": [
      { "item_name": "Canned Tuna", "quantity": 1, "unit": "can" },
      { "item_name": "Mayonnaise", "quantity": 2, "unit": "tbsp" },
      { "item_name": "Celery", "quantity": 1, "unit": "stalk" },
      { "item_name": "Bread", "quantity": 2, "unit": "slices" },
    ],
    "instructions": [
      "Drain tuna and flake into a bowl. Finely chop celery.",
      "Mix tuna, mayonnaise, and celery. Season with salt and pepper.",
      "Spread tuna salad on bread to make a sandwich.",
    ],
    "estimated_cost": 2.5,
    "tags": ["lunch", "quick", "budget-friendly"],
    "source": "AI Generated",
  },
]

mock_leftover_suggestions = [
  {
    "suggested_recipe_name": "Chicken Fried Rice",
    "description": "Use leftover chicken and rice in a delicious fried rice bowl.",
    "ingredients_to_use": ["Cooked Chicken", "Cooked Rice", "Eggs", "Soy Sauce"],
  },
  {
    "suggested_recipe_name": "Lentil Shepherd's Pie",
    "description": "Transform leftover lentil soup into a hearty shepherd's pie with a mashed potato topping.",
    "ingredients_to_use": ["Lentil Soup", "Potatoes", "Milk", "Butter"],
  },
]

mock_community_recipes = [
    {
        "name": "Budget Bean Chili",
        "description": "A hearty and inexpensive chili perfect for a cold evening.",
        "tags": ["budget-friendly", "vegetarian", "slow-cooker"],
        "image_url": "/placeholder.svg",
    },
    {
        "name": "Kids' Favorite Mini Pizzas",
        "description": "Easy to make mini pizzas using pita bread, great for involving kids!",
        "tags": ["kids-friendly", "quick", "fun"],
        "image_url": "/placeholder.svg",
    },
]


async def populate_db():
    from app.db import connect_to_mongo, close_mongo_connection
    await connect_to_mongo()
    db = await get_database()
    
    # Populate recipes
    await db.recipes.delete_many({})
    await db.recipes.insert_many(mock_recipes)
    print("Recipes collection populated.")

    # Populate leftover suggestions
    await db.leftover_suggestions.delete_many({})
    await db.leftover_suggestions.insert_many(mock_leftover_suggestions)
    print("Leftover suggestions collection populated.")

    # Populate community recipes
    await db.community_recipes.delete_many({})
    await db.community_recipes.insert_many(mock_community_recipes)
    print("Community recipes collection populated.")
    close_mongo_connection()

if __name__ == "__main__":
    asyncio.run(populate_db())