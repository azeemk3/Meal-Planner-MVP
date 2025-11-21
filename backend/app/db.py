from motor.motor_asyncio import AsyncIOMotorClient
from pymongo.errors import ServerSelectionTimeoutError
from typing import Optional
import os
from dotenv import load_dotenv

load_dotenv()

MONGODB_URI = os.getenv("MONGODB_URI")
if not MONGODB_URI:
    raise ValueError(
        "MONGODB_URI not found in environment. "
        "Create a .env file (see .env.example) or export the variable."
    )


class DataBase:
    client: Optional[AsyncIOMotorClient] = None


db = DataBase()


async def get_database():
    if not db.client:
        raise RuntimeError("Database client is not initialized")
    return db.client.get_default_database()


async def connect_to_mongo():
    try:
        db.client = AsyncIOMotorClient(
            MONGODB_URI,
            serverSelectionTimeoutMS=5_000,
            tz_aware=True,
        )
        await db.client.admin.command("ping")
        print(f"Connected to MongoDB at {MONGODB_URI}.")
    except ServerSelectionTimeoutError as exc:
        raise ConnectionError(
            "Could not reach MongoDB. Make sure the database server is running "
            f"and accessible at {MONGODB_URI}."
        ) from exc


def close_mongo_connection():
    if db.client:
        db.client.close()
        print("Closed MongoDB connection.")