from pydantic import BaseModel, EmailStr, Field, ConfigDict
from typing import List, Optional
from datetime import datetime
from bson import ObjectId


from typing import Any

class PyObjectId(ObjectId):
    @classmethod
    def __get_validators__(cls):
        yield cls.validate

    @classmethod
    def validate(cls, v: Any, _: Any) -> ObjectId:
        if not ObjectId.is_valid(v):
            raise ValueError("Invalid objectid")
        return ObjectId(v)

    @classmethod
    def __get_pydantic_json_schema__(cls, field_schema: dict) -> None:
        field_schema.update(type="string")


class User(BaseModel):
    model_config = ConfigDict(
        arbitrary_types_allowed=True,
        populate_by_name=True,
    )
    
    id: Optional[str] = Field(alias='_id', default=None)
    name: str
    email: EmailStr
    password: str
    family_size: int = 1
    dietary_restrictions: List[str] = []
    weekly_budget: float = 0.0
    created_date: Optional[datetime] = None
    last_modified_date: Optional[datetime] = None

class UserProfile(BaseModel):
    name: str
    family_size: int
    dietary_restrictions: List[str]
    weekly_budget: float

class UserCreate(BaseModel):
    name: str
    email: EmailStr
    password: str

class UserInDB(User):
    hashed_password: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str