import os
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from app.db import connect_to_mongo, close_mongo_connection, db
from app.routes import auth as auth_router
from app.routes import user as user_router
from app.routes import meal_plan as meal_plan_router
from app.routes import static as static_router
from app.routes import shopping_list as shopping_list_router

load_dotenv()

app = FastAPI()

# CORS: DEV-FRIENDLY, SINGLE CONFIG
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router.router, prefix="/api/v1/auth", tags=["auth"])
app.include_router(user_router.router, prefix="/api/v1/user", tags=["user"])
app.include_router(meal_plan_router.router, prefix="/api/v1", tags=["meal_plan"])
app.include_router(static_router.router, prefix="/api/v1", tags=["static"])
app.include_router(shopping_list_router.router, prefix="/api/v1", tags=["shopping_list"])

@app.on_event("startup")
async def startup_db_client():
    await connect_to_mongo()

@app.on_event("shutdown")
async def shutdown_db_client():
    close_mongo_connection()

@app.get("/api/v1/healthz")
async def health_check():
    try:
        # The ismaster command is cheap and does not require auth.
        await db.client.admin.command('ismaster')
        return {"status": "ok"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))