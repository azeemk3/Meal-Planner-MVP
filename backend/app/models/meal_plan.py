from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime
from .user import PyObjectId
from bson import ObjectId

class IngredientItem(BaseModel):
    item_name: str
    quantity: float
    unit: str

class Recipe(BaseModel):
    id: Optional[PyObjectId] = Field(alias='_id', default=None)
    name: str
    description: str
    ingredients: List[IngredientItem]
    instructions: List[str]
    estimated_cost: float
    tags: List[str]
    source: str

    class Config:
        arbitrary_types_allowed = True
        json_encoders = {
            ObjectId: str
        }

class Meal(BaseModel):
    type: str
    recipe_id: str

class DayPlan(BaseModel):
    day_of_week: str
    meals: List[Meal]

class MealPlan(BaseModel):
    id: Optional[PyObjectId] = Field(alias='_id', default=None)
    user_id: str
    start_date: str
    end_date: str
    days: List[DayPlan]
    estimated_spend: float
    estimated_savings_percentage: int
    created_date: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        arbitrary_types_allowed = True
        json_encoders = {
            ObjectId: str
        }