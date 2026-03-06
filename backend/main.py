from fastapi import FastAPI, File, UploadFile, Depends, Form
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import time
import json
from sqlalchemy.orm import Session

from database import engine, Base, get_db, AnalysisDB
from nlp.extractor import extract_skills_mock

# Create DB schema
Base.metadata.create_all(bind=engine)

app = FastAPI(title="AI Skill Gap Analyzer API", version="1.0.0")

# Allow Frontend React App to communicate with API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # In production, restrict this to frontend URL e.g., ["http://localhost:5173"]
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class AnalysisResponse(BaseModel):
    job_id: str
    status: str
    skills_detected: List[str]
    missing_skills: List[str]
    readiness_score: float
    message: str = ""

@app.get("/health")
def health_check():
    return {"status": "ok", "service": "backend-api"}

@app.post("/api/v1/analyze/resume", response_model=AnalysisResponse)
async def analyze_resume(
    role: str = Form(...),
    resume: UploadFile = File(None),
    db: Session = Depends(get_db)
):
    """
    Endpoint that accepts a file upload, parses text, and runs NLP analysis to find skill gaps.
    """
    # 1. File Simulation
    if not resume:
        return AnalysisResponse(
            job_id="error", status="failed", skills_detected=[], missing_skills=[], readiness_score=0, message="No resume uploaded"
        )
        
    print(f"Received file: {resume.filename} for role {role}")
    
    # Simulate processing delay
    time.sleep(1)
    
    # 2. Extract Text (Simulated)
    # In reality you would use pdfminer.six here on the uploaded file
    # file_content = await resume.read()
    mock_text = "I am a developer with experience in python and javascript."

    # 3. AI NLP Extraction
    found_skills = extract_skills_mock(mock_text)
    
    # 4. Role Comparison Logic
    roles_db = {
        "Data Scientist": ["Python", "SQL", "Machine Learning", "Statistics", "Pandas", "TensorFlow"],
        "Machine Learning Engineer": ["Python", "Docker", "Machine Learning", "TensorFlow", "MLOps", "AWS"],
        "Backend Developer": ["Node.js", "Python", "SQL", "Docker", "AWS", "API Design"],
        "Frontend Developer": ["React", "JavaScript", "HTML", "CSS", "TypeScript", "Tailwind CSS"],
        "Cyber Security Analyst": ["Linux", "Networking", "Python", "SIEM", "Firewalls", "Cryptography"]
    }
    
    required_skills = roles_db.get(role, roles_db["Backend Developer"])
    missing_skills = [skill for skill in required_skills if skill.lower() not in [s.lower() for s in found_skills]]
    
    # 5. Score Calculation
    match_count = len(required_skills) - len(missing_skills)
    score = (match_count / len(required_skills)) * 100 if required_skills else 0.0

    # 6. Database Storage (Simulated Roadmap generation)
    db_analysis = AnalysisDB(
        user_id="anonymous",
        target_role=role,
        readiness_score=round(score, 2),
        missing_skills=json.dumps(missing_skills),
        roadmap=json.dumps(["Week 1: Fundamentals", "Week 2: Advanced Projects"])
    )
    db.add(db_analysis)
    db.commit()

    return AnalysisResponse(
        job_id=db_analysis.id,
        status="completed",
        skills_detected=found_skills,
        missing_skills=missing_skills,
        readiness_score=round(score, 2),
        message="Analysis complete!"
    )
