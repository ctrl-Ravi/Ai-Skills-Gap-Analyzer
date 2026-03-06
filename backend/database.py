import os
from motor.motor_asyncio import AsyncIOMotorClient

# Default connection to local MongoDB
MONGO_URL = os.getenv("MONGO_URL", "mongodb://localhost:27017")
client = AsyncIOMotorClient(MONGO_URL)
db = client.ai_skills_gap

# Database collections
users_collection = db["users"]
resumes_collection = db["resumes"]
analyses_collection = db["analyses"]
jobs_collection = db["job_descriptions"]

async def get_db():
    """Dependency to pass the database instance around."""
    return db
