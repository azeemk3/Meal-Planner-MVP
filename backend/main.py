import os
import logging
from contextlib import asynccontextmanager
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from app.db import connect_to_mongo, close_mongo_connection, db
from app.routes import auth as auth_router
from app.routes import user as user_router
from app.routes import meal_plan as meal_plan_router
from app.routes import static as static_router
from app.routes import shopping_list as shopping_list_router
import uvicorn

load_dotenv()

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Connect to MongoDB
    try:
        await connect_to_mongo()
        yield
    except Exception as e:
        logger.error(f"Error during application lifespan: {e}")
        raise
    finally:
        # Close MongoDB connection
        close_mongo_connection()


app = FastAPI(
    lifespan=lifespan,
    title="Meal Planner API",
    description="API for managing meal plans, shopping lists, and user authentication.",
    version="1.0.0",
)

# CORS Configuration
origins = os.getenv(
    "CORS_ORIGINS",
    "https://meal-planner-mvp.onrender.com,http://localhost:5137,http://127.0.0.1:5137,http://localhost:5173,http://127.0.0.1:5173"
).split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://meal-planner-mvp.onrender.com,http://localhost:5137,http://127.0.0.1:5137,http://localhost:5173,http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Routers
app.include_router(auth_router.router, prefix="/api/v1/auth", tags=["auth"])
app.include_router(user_router.router, prefix="/api/v1/user", tags=["user"])
app.include_router(meal_plan_router.router, prefix="/api/v1", tags=["meal_plan"])
app.include_router(static_router.router, prefix="/api/v1", tags=["static"])
app.include_router(shopping_list_router.router, prefix="/api/v1", tags=["shopping_list"])


@app.get("/")
async def home():
    return {"message": "Welcome to the Meal Planner API!"}


@app.get("/api/v1/healthz")
async def health_check():
    try:
        await db.client.admin.command("ismaster")
        return {"status": "ok"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# ✅ MAIN FUNCTION TO RUN SERVER
def main():
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=int(os.getenv("PORT", 8000)),
        reload=True
    )


if __name__ == "__main__":
    main()
