from fastapi import APIRouter, Depends, HTTPException
from app.models.user import User, UserProfile
from app.utils.jwt import decode_access_token
from app.db import get_database
from motor.motor_asyncio import AsyncIOMotorDatabase
from bson import ObjectId
from fastapi.security import OAuth2PasswordBearer
from datetime import datetime

router = APIRouter()

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/v1/auth/login")

async def get_current_user(token: str = Depends(oauth2_scheme), db: AsyncIOMotorDatabase = Depends(get_database)):
    credentials_exception = HTTPException(
        status_code=401,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    payload = decode_access_token(token)
    if payload is None:
        raise credentials_exception
    user_id = payload.get("sub")
    if user_id is None:
        raise credentials_exception
    user = await db.users.find_one({"_id": ObjectId(user_id)})
    if user is None:
        raise credentials_exception
    return user

@router.post("/me", response_model=User)
async def read_users_me(current_user: dict = Depends(get_current_user)):
    return current_user

@router.post("/profile", response_model=UserProfile)
async def get_user_profile(current_user: dict = Depends(get_current_user)):
    # Convert ObjectId to string if present
    if "_id" in current_user and isinstance(current_user["_id"], ObjectId):
        current_user["_id"] = str(current_user["_id"])
    return UserProfile(**current_user)

@router.post("/profile", response_model=UserProfile)
async def update_user_profile(profile: UserProfile, current_user: dict = Depends(get_current_user), db: AsyncIOMotorDatabase = Depends(get_database)):
    updated_data = profile.model_dump()
    updated_data["last_modified_date"] = datetime.utcnow()
    
    user_id = current_user["_id"]
    if isinstance(user_id, str):
        user_id = ObjectId(user_id)
    
    await db.users.update_one(
        {"_id": user_id},
        {"$set": updated_data}
    )
    
    updated_user = await db.users.find_one({"_id": user_id})
    if updated_user and "_id" in updated_user and isinstance(updated_user["_id"], ObjectId):
        updated_user["_id"] = str(updated_user["_id"])
    return UserProfile(**updated_user)