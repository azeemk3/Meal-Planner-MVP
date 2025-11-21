from fastapi import APIRouter, HTTPException
from app.models.shopping_list import ShoppingList, ShoppingListItem
from app.models.meal_plan import MealPlan, Recipe
from app.db import get_database
from motor.motor_asyncio import AsyncIOMotorDatabase
from fastapi import Depends
from bson import ObjectId
from bson.errors import InvalidId
from collections import defaultdict

router = APIRouter()

def categorize_ingredient(name: str) -> str:
    return "Uncategorized"

@router.post("/shopping-list", response_model=ShoppingList)
async def get_shopping_list(meal_plan: MealPlan, db: AsyncIOMotorDatabase = Depends(get_database)):
    # Extract recipe IDs
    recipe_ids = []
    for day in meal_plan.days:
        for meal in day.meals:
            try:
                recipe_ids.append(ObjectId(meal.recipe_id))
            except InvalidId:
                raise HTTPException(status_code=400, detail=f"Invalid recipe_id: {meal.recipe_id}")

    # Fetch recipes
    recipes = await db.recipes.find({"_id": {"$in": recipe_ids}}).to_list(None)
    if not recipes:
        raise HTTPException(status_code=404, detail="No recipes found for these IDs")

    # Aggregate ingredients
    ingredient_map = defaultdict(lambda: {"quantity": 0, "unit": ""})

    for recipe_data in recipes:
        recipe = Recipe(**recipe_data)
        for ing in recipe.ingredients:
            key = (ing.item_name.lower(), ing.unit.lower())
            ingredient_map[key]["quantity"] += ing.quantity
            ingredient_map[key]["unit"] = ing.unit

    # Build shopping list response
    items = [
        ShoppingListItem(
            ingredient=name.title(),
            quantity=data["quantity"],
            unit=unit,
            category=categorize_ingredient(name),
        )
        for (name, unit), data in ingredient_map.items()
    ]

    return ShoppingList(items=items)
