from fastapi import APIRouter, Depends, HTTPException
from app.models.user import User, UserProfile
from app.routes.user import get_current_user
from app.db import get_database
from motor.motor_asyncio import AsyncIOMotorDatabase
from bson import ObjectId
from typing import List
from app.models.meal_plan import Recipe
import logging

router = APIRouter()

@router.post("/recipes/{recipe_id}", response_model=Recipe)
async def get_recipe(recipe_id: str, db: AsyncIOMotorDatabase = Depends(get_database)):
    recipe = await db.recipes.find_one({"_id": ObjectId(recipe_id)})
    if recipe is None:
        raise HTTPException(status_code=404, detail="Recipe not found")
    return recipe

@router.post("/community-recipes")
async def get_community_recipes(db: AsyncIOMotorDatabase = Depends(get_database)):
    recipes = await db.community_recipes.find().to_list(length=100)
    for r in recipes:
        r["_id"] = str(r["_id"])
    return recipes

@router.post("/leftover-suggestions")
async def get_leftover_suggestions(
    user_profile: UserProfile,
    db: AsyncIOMotorDatabase = Depends(get_database),
):
    # This is a mock implementation.
    # In a real-world scenario, this would involve more complex logic
    # to analyze the user's pantry or recent meal plan ingredients.
    
    # For now, we'll return a static list of suggestions.
    suggestions = [
        {
            "id": "1",
            "suggested_recipe_name": "Chicken and Vegetable Stir-fry",
            "description": "A quick and easy stir-fry to use up leftover chicken and various vegetables.",
            "ingredients_to_use": ["Cooked Chicken", "Broccoli", "Carrots", "Bell Peppers"],
        },
        {
            "id": "2",
            "suggested_recipe_name": "Kitchen Sink Frittata",
            "description": "A versatile frittata where you can throw in any leftover cooked vegetables, cheese, and herbs.",
            "ingredients_to_use": ["Eggs", "Cooked Potatoes", "Spinach", "Feta Cheese"],
        },
        {
            "id": "3",
            "suggested_recipe_name": "Leftover Rice Pudding",
            "description": "A creamy and comforting dessert made from leftover cooked rice.",
            "ingredients_to_use": ["Cooked Rice", "Milk", "Sugar", "Cinnamon"],
        },
        {
            "id": "4",
            "suggested_recipe_name": "Vegetable Broth",
            "description": "Don't throw away vegetable scraps! Use them to make a flavorful homemade broth.",
            "ingredients_to_use": ["Onion Peels", "Carrot Tops", "Celery Ends", "Herb Stems"],
        },
    ]
    return suggestions