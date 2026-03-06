from fastapi import FastAPI, File, UploadFile, Form
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import time
import json
from datetime import datetime

from database import analyses_collection, jobs_collection
from nlp.engine import (
    extract_text_from_pdf, 
    extract_skills_from_text, 
    match_role_and_skills, 
    generate_roadmap, 
    generate_interview_questions
)

app = FastAPI(title="AI Skill Gap Analyzer API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # In production, restrict this.
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class AnalysisResponse(BaseModel):
    job_id: str
    status: str
    target_role: str
    skills_detected: List[str]
    missing_skills: List[str]
    readiness_score: float
    roadmap: list
    interview_questions: List[str]

@app.get("/health")
def health_check():
    return {"status": "ok", "service": "backend-api"}

@app.post("/api/v1/analyze/resume", response_model=AnalysisResponse)
async def analyze_resume(
    role: str = Form("Auto Detect"),
    resume: UploadFile = File(...)
):
    """
    Endpoint that accepts a file upload, parses text, and runs NLP analysis to find skill gaps.
    """
    if not resume:
        return AnalysisResponse(
            job_id="error", status="failed", target_role=role, 
            skills_detected=[], missing_skills=[], readiness_score=0, roadmap=[], interview_questions=[]
        )
        
    print(f"Received file: {resume.filename} for role {role}")
    
    # 1. Read bytes & Extract Text 
    file_bytes = await resume.read()
    raw_text = extract_text_from_pdf(file_bytes)

    # 2. AI NLP Extraction
    found_skills = extract_skills_from_text(raw_text)
    
    # 3. Role Comparison Logic
    # In a full production env, we fetch this from MongoDB jobs_collection here.
    roles_db = {
        "Data Scientist": ["Python", "SQL", "Machine Learning", "Statistics", "Pandas", "TensorFlow"],
        "Machine Learning Engineer": ["Python", "Docker", "Machine Learning", "TensorFlow", "MLOps", "AWS"],
        "Backend Developer": ["Node.js", "Python", "SQL", "Docker", "AWS", "API Design", "MongoDB", "FastAPI"],
        "Frontend Developer": ["React", "JavaScript", "HTML", "CSS", "TypeScript", "TailwindCSS", "Next.js"],
        "Cyber Security Analyst": ["Linux", "Networking", "Python", "SIEM", "Firewalls", "Cryptography"]
    }
    
    analysis = match_role_and_skills(found_skills, roles_db, role)
    
    target_role = analysis["target_role"]
    readiness_score = analysis["readiness_score"]
    missing_skills = analysis["missing_skills"]
    identified_skills = analysis["identified_skills"]

    # 4. Generate Roadmaps and Qs
    roadmap = generate_roadmap(missing_skills)
    interview_qs = generate_interview_questions(missing_skills)

    # 5. Database Storage (MongoDB)
    document = {
        "user_id": "anonymous",
        "target_role": target_role,
        "readiness_score": readiness_score,
        "identified_skills": identified_skills,
        "missing_skills": missing_skills,
        "roadmap": roadmap,
        "interview_questions": interview_qs,
        "created_at": datetime.utcnow()
    }
    
    result = await analyses_collection.insert_one(document)

    return AnalysisResponse(
        job_id=str(result.inserted_id),
        status="completed",
        target_role=target_role,
        skills_detected=identified_skills,
        missing_skills=missing_skills,
        readiness_score=readiness_score,
        roadmap=roadmap,
        interview_questions=interview_qs
    )

@app.get("/api/v1/jobs/roles")
async def get_roles():
    """Returns canonical roles available in the system"""
    return {
        "roles": [
            "Auto Detect",
            "Data Scientist",
            "Machine Learning Engineer",
            "Backend Developer",
            "Frontend Developer",
            "Cyber Security Analyst"
        ]
    }
