from fastapi import APIRouter, HTTPException, Depends
from app.models.user import User, UserCreate, UserLogin
from app.utils.auth import get_password_hash, verify_password
from app.utils.jwt import create_access_token
from app.db import get_database
from motor.motor_asyncio import AsyncIOMotorDatabase
from datetime import timedelta, datetime
import os

router = APIRouter()

ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("JWT_EXPIRES_IN", 30))

@router.post("/signup")
async def signup(user: UserCreate, db: AsyncIOMotorDatabase = Depends(get_database)):
    try:
        existing_user = await db.users.find_one({"email": user.email})
        if existing_user:
            raise HTTPException(status_code=400, detail="Email already registered")

        hashed_password = get_password_hash(user.password)
        user_dict = user.model_dump()
        user_dict["password"] = hashed_password
        user_dict["family_size"] = 1
        user_dict["dietary_restrictions"] = []
        user_dict["weekly_budget"] = 0.0
        user_dict["created_date"] = datetime.now()
        
        user_dict.pop("id", None)

        new_user = await db.users.insert_one(user_dict)
        created_user = await db.users.find_one({"_id": new_user.inserted_id})

        access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
        access_token = create_access_token(
            data={"sub": str(new_user.inserted_id)}, expires_delta=access_token_expires
        )
        
        created_user["_id"] = str(created_user["_id"])
        
        return {"access_token": access_token, "token_type": "bearer", "user": created_user}
    except Exception as e:
        print(f"Error during signup: {e}")
        raise HTTPException(status_code=500, detail="Internal server error during signup.")

@router.post("/login")
async def login(user_data: UserLogin, db: AsyncIOMotorDatabase = Depends(get_database)):
    try:
        user = await db.users.find_one({"email": user_data.email})
        if not user or not verify_password(user_data.password, user["password"]):
            raise HTTPException(
                status_code=401,
                detail="Incorrect email or password",
                headers={"WWW-Authenticate": "Bearer"},
            )
        
        access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
        access_token = create_access_token(
            data={"sub": str(user["_id"])}, expires_delta=access_token_expires
        )

        user["_id"] = str(user["_id"])

        return {"access_token": access_token, "token_type": "bearer", "user": user}
    except Exception as e:
        print(f"Error during login: {e}")
        raise HTTPException(status_code=500, detail="Internal server error during login.")

@router.post("/logout")
async def logout():
    # This is a simple logout, the frontend will remove the token.
    return {"message": "Logged out successfully"}