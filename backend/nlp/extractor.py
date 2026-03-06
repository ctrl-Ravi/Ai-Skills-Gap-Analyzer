def extract_skills_mock(text: str) -> list:
    """
    In a real-world scenario, this would use a Spacy NER model 
    (e.g., nlp = spacy.load("en_core_web_sm")) to parse out technical skills.
    
    For scaffolding purposes, returning a static list based on simple keywords.
    """
    text_lower = text.lower()
    skills = []
    
    if "python" in text_lower: skills.append("Python")
    if "data" in text_lower or "pandas" in text_lower: skills.extend(["Pandas", "SQL", "Statistics"])
    if "react" in text_lower or "javascript" in text_lower: skills.extend(["React", "JavaScript", "HTML", "CSS"])
    if "machine learning" in text_lower: list.extend(["Machine Learning", "Scikit-Learn"])
    
    # Default skills if empty
    if not skills:
        skills = ["Python", "Git", "Problem Solving"]
        
    return list(set(skills)) # return unique list
