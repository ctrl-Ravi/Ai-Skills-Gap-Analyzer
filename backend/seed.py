import asyncio
import os
from motor.motor_asyncio import AsyncIOMotorClient

# Connect to MongoDB
MONGO_URL = os.getenv("MONGO_URL", "mongodb://localhost:27017")
client = AsyncIOMotorClient(MONGO_URL)
db = client.ai_skills_gap
jobs_collection = db["job_descriptions"]

INITIAL_ROLES = [
    {
        "role_name": "Data Scientist",
        "required_skills": ["Python", "SQL", "Machine Learning", "Statistics", "Pandas", "TensorFlow"]
    },
    {
        "role_name": "Machine Learning Engineer",
        "required_skills": ["Python", "Docker", "Machine Learning", "TensorFlow", "MLOps", "AWS"]
    },
    {
        "role_name": "Backend Developer",
        "required_skills": ["Node.js", "Python", "SQL", "Docker", "AWS", "API Design", "MongoDB", "FastAPI"]
    },
    {
        "role_name": "Frontend Developer",
        "required_skills": ["React", "JavaScript", "HTML", "CSS", "TypeScript", "TailwindCSS", "Next.js"]
    },
    {
        "role_name": "Cyber Security Analyst",
        "required_skills": ["Linux", "Networking", "Python", "SIEM", "Firewalls", "Cryptography"]
    }
]

async def seed_database():
    print("Checking database collections...")
    existing_collections = await db.list_collection_names()
    
    # 1. Pre-create all collections explicitly
    app_collections = ["users", "resumes", "analyses", "job_descriptions"]
    for col_name in app_collections:
        if col_name not in existing_collections:
            print(f"Creating collection '{col_name}' explicitly...")
            # We can also add validation rules or indexes here for enterprise-scale
            await db.create_collection(col_name)
        else:
            print(f"Collection '{col_name}' already exists.")
            
    # 2. Seed the job targets specifically
    print("\nLooking for existing roles in the job_descriptions collection...")
    count = await jobs_collection.count_documents({})
    
    if count == 0:
        print("Jobs collection is empty. Seeding initial roles...")
        await jobs_collection.insert_many(INITIAL_ROLES)
        print("Successfully seeded 5 initial roles.")
    else:
        print(f"Database already contains {count} roles. Skipping initial seed.")
        print("To add new roles, simply insert a new document with 'role_name' and 'required_skills' array.\n")
    
    print("Database is fully initialized and pre-created for rigorous production! 🎉")

if __name__ == "__main__":
    asyncio.run(seed_database())
