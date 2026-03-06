# AI Skill Gap Analyzer Platform

"Google Maps for Career Development"

This platform analyzes a student's resume, compares it with real job descriptions, identifies missing skills, and generates a personalized learning roadmap with a Job Readiness Score.

## Architecture
- **Frontend**: React.js, Vite, TailwindCSS
- **Backend API**: Python, FastAPI
- **Database**: SQLite
- **AI Engine**: SpaCy/SentenceTransformers

## How to Run locally

Prerequisites:
- **Node.js**: v18+
- **Python**: 3.10+

### 1. Start the Backend API (FastAPI)
Open a terminal in the root folder:

```bash
cd backend
python -m venv venv
# On Windows:
venv\Scripts\activate
# On Mac/Linux:
source venv/bin/activate

pip install -r requirements.txt
uvicorn main:app --reload
```
*API will run at http://127.0.0.1:8000*
*Swagger Docs available at http://127.0.0.1:8000/docs*

### 2. Start the Frontend (React + Vite)
Open a **new** terminal in the root folder:-

```bash
cd frontend
npm install
npm run dev
```
*Application will run at http://localhost:5173*
