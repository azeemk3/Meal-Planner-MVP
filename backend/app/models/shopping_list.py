from pydantic import BaseModel
from typing import List

class ShoppingListItem(BaseModel):
    ingredient: str
    quantity: float
    unit: str
    category: str

class ShoppingList(BaseModel):
    items: List[ShoppingListItem]