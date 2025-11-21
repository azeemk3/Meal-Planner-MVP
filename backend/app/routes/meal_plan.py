from fastapi import APIRouter, Depends, HTTPException
from app.models.user import User
from app.models.meal_plan import MealPlan
from app.routes.user import get_current_user
from app.db import get_database
from motor.motor_asyncio import AsyncIOMotorDatabase
from datetime import datetime, timedelta
import random
import logging

router = APIRouter()

@router.post("/generate-meal-plan", response_model=MealPlan)
async def generate_meal_plan(
    current_user: User = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_database),
):
    try:
        # If current_user is a Pydantic model, convert to dict for easier handling
        if hasattr(current_user, "dict"):
            user_profile = current_user.dict()
        else:
            user_profile = current_user  # assume already dict-like

        # ---- 1. Fetch recipes ----
        recipes_cursor = db.recipes.find()
        recipes = await recipes_cursor.to_list(length=500)

        if not recipes:
            raise HTTPException(
                status_code=404,
                detail="No recipes found to generate a meal plan.",
            )

        # ---- 2. Filter recipes by dietary restrictions ----
        restrictions = user_profile.get("dietary_restrictions") or []
        if restrictions:
            filtered_recipes = [
                r for r in recipes
                if not any(tag in restrictions for tag in r.get("tags", []))
            ]
        else:
            filtered_recipes = recipes

        if not filtered_recipes:
            raise HTTPException(
                status_code=404,
                detail="No recipes found matching your dietary restrictions.",
            )

        # ---- 3. Build 7-day plan with 4 meals per day ----
        days_of_week = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
        generated_days = []

        meal_types = ["Breakfast", "Lunch", "Dinner", "Snack"]

        for day in days_of_week:
            # pick 4 recipes (reuse if <4 available)
            if len(filtered_recipes) < 4:
                selected_recipes = random.choices(filtered_recipes, k=4)
            else:
                selected_recipes = random.sample(filtered_recipes, 4)

            meals = []
            for meal_type, recipe in zip(meal_types, selected_recipes):
                meals.append({
                    "type": meal_type,
                    "recipe_id": str(recipe["_id"]),
                })

            generated_days.append({
                "day_of_week": day,
                "meals": meals,
            })

        # ---- 4. Dates ----
        today = datetime.utcnow()
        start_date = today.isoformat()
        end_date = (today + timedelta(days=6)).isoformat()

        # ---- 5. Estimated spend ----
        # Pre-build a lookup from recipe_id -> estimated_cost
        cost_lookup = {
            str(r["_id"]): float(r.get("estimated_cost", 0.0))
            for r in filtered_recipes
        }

        base_spend = 0.0
        for day in generated_days:
            for meal in day["meals"]:
                base_spend += cost_lookup.get(meal["recipe_id"], 0.0)

        family_size = user_profile.get("family_size", 1) or 1
        # Simple scaling by family size
        estimated_spend = base_spend * max(family_size, 1)

        estimated_savings_percentage = random.randint(20, 30)

        # ---- 6. Build meal plan document ----
        user_id = str(user_profile.get("_id") or user_profile.get("id"))

        meal_plan_data = {
            "user_id": user_id,
            "start_date": start_date,
            "end_date": end_date,
            "days": generated_days,
            "estimated_spend": round(estimated_spend, 2),
            "estimated_savings_percentage": estimated_savings_percentage,
            "created_date": datetime.utcnow(),
        }

        result = await db.meal_plans.insert_one(meal_plan_data)
        new_meal_plan = await db.meal_plans.find_one({"_id": result.inserted_id})

        return new_meal_plan

    except HTTPException:
        # re-raise known HTTP errors
        raise
    except Exception as e:
        logging.exception(f"Error generating meal plan: {e}")
        raise HTTPException(
            status_code=500,
            detail="Internal server error during meal plan generation.",
        )

@router.post("/meal-plan/current")
async def get_current_meal_plan(current_user: User = Depends(get_current_user), db: AsyncIOMotorDatabase = Depends(get_database)):
    user_id = current_user["_id"]
    if isinstance(user_id, str):
        user_id = ObjectId(user_id)
    
    meal_plan = await db.meal_plans.find_one({"user_id": user_id})
    if meal_plan and "_id" in meal_plan and isinstance(meal_plan["_id"], ObjectId):
        meal_plan["_id"] = str(meal_plan["_id"])
    return meal_plan

