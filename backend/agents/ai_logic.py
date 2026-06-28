from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.prompts import PromptTemplate
from pydantic import BaseModel, Field
from typing import List, Dict, Any, Optional
import os
import json

def get_llm():
    return ChatGoogleGenerativeAI(
        model="gemini-2.5-flash",
        temperature=0.2, # Lower temperature for higher structural accuracy
        google_api_key=os.getenv("GEMINI_API_KEY")
    )

# ==========================================
# 1. Chatbot Agent
# ==========================================
def chat_with_advisor(query: str, context: str = "") -> str:
    llm = get_llm()
    template = """
    You are an expert AI Advisor for an Outcome-Based Education (OBE) Management System.
    Context Data: {context}
    User Query: {query}
    Provide a professional, helpful response.
    """
    prompt = PromptTemplate.from_template(template)
    chain = prompt | llm
    return chain.invoke({"query": query, "context": context}).content

# ==========================================
# 2. Syllabus Extraction Agent
# ==========================================
class SyllabusModule(BaseModel):
    title: str = Field(description="The title of the module")
    description: str = Field(description="The description or topics covered in the module")
    hours: int = Field(description="The number of teaching hours required")
    coNo: int = Field(description="The Course Outcome number associated with this module")

class SyllabusBook(BaseModel):
    type: str = Field(description="Type of book, either 'Textbook' or 'Reference Book'")
    title: str = Field(description="The title of the book")
    author: str = Field(description="The author(s) of the book")

class SyllabusResponse(BaseModel):
    modules: List[SyllabusModule]
    books: List[SyllabusBook]

def extract_syllabus(text: str) -> dict:
    llm = get_llm().with_structured_output(SyllabusResponse)
    template = """
    You are a curriculum parser. Extract syllabus modules and reference books from the following text.
    Syllabus Text: {text}
    """
    prompt = PromptTemplate.from_template(template)
    chain = prompt | llm
    res = chain.invoke({"text": text})
    return res.dict()

# ==========================================
# 3. Teaching Philosophy Agent
# ==========================================
def generate_teaching_philosophy(courseName: str, deptVision: str, deptMission: str) -> str:
    llm = get_llm()
    template = "Write a 3 sentence teaching philosophy for {course} aligning with mission: {mission}."
    prompt = PromptTemplate.from_template(template)
    chain = prompt | llm
    return chain.invoke({"course": courseName, "mission": deptMission}).content

# ==========================================
# 4. Bloom's Taxonomy Agent
# ==========================================
class BloomsAnalysis(BaseModel):
    no: int = Field(description="The Course Outcome number")
    status: str = Field(description="Must be exactly one of: 'perfect', 'warning', or 'upgrade'")
    suggestion: str = Field(description="Constructive feedback or a suggested revised outcome")

class BloomsResponse(BaseModel):
    results: List[BloomsAnalysis]

def analyze_blooms(cos: list) -> list:
    llm = get_llm().with_structured_output(BloomsResponse)
    template = """
    Analyze these Course Outcomes: {cos}. 
    Determine if the action verbs align correctly with Bloom's Taxonomy.
    """
    prompt = PromptTemplate.from_template(template)
    chain = prompt | llm
    res = chain.invoke({"cos": json.dumps(cos)})
    return [item.dict() for item in res.results]

# ==========================================
# 5. CO-PO Mapping Agent
# ==========================================
class CoPoMapping(BaseModel):
    mapping: Dict[str, Dict[str, int]] = Field(
        description="A dictionary mapping CO numbers as strings (e.g. '1') to a dictionary of POs and their correlation values (0, 1, 2, or 3)"
    )

def auto_map_copo(cos: list, pos: list) -> dict:
    llm = get_llm().with_structured_output(CoPoMapping)
    template = """
    You are an expert in Outcome-Based Education (OBE). 
    Map these Course Outcomes (COs): {cos} to these Program Outcomes (POs): {pos}. 
    CRITICAL OBE RULES: 
    - Use 3 (High) ONLY if the CO strongly and directly addresses the PO (very rare, be highly conservative).
    - Use 2 (Medium) for moderate, indirect correlation.
    - Use 1 (Low) for slight, passing correlation.
    - Use 0 if there is no meaningful correlation.
    """
    prompt = PromptTemplate.from_template(template)
    chain = prompt | llm
    res = chain.invoke({"cos": json.dumps(cos), "pos": json.dumps(pos)})
    
    # OUTPUT VALIDATION: Clamp all values to the valid [0, 1, 2, 3] range to prevent hallucination
    validated_mapping = {}
    for co, po_dict in res.mapping.items():
        validated_mapping[co] = {}
        for po, val in po_dict.items():
            # Ensure value is bounded between 0 and 3
            validated_mapping[co][po] = max(0, min(3, val))
            
    return validated_mapping

# ==========================================
# 6. Assignment Generation Agent
# ==========================================
class AssignmentQuestion(BaseModel):
    qNo: int
    text: str
    marks: int
    coNo: Optional[int]

class AssignmentRubric(BaseModel):
    criterion: str
    exceptional: str
    best: str
    average: str
    low: str

class AssignmentResponse(BaseModel):
    questions: List[AssignmentQuestion]
    rubrics: List[AssignmentRubric]

def generate_assignment(topic: str, level: str, num: int, marks: int) -> dict:
    llm = get_llm().with_structured_output(AssignmentResponse)
    template = """
    Create {num} assignment questions about {topic} at Bloom's level {level} for {marks} total marks.
    Also generate detailed grading rubrics.
    """
    prompt = PromptTemplate.from_template(template)
    chain = prompt | llm
    res = chain.invoke({"num": num, "topic": topic, "level": level, "marks": marks})
    return res.dict()

# ==========================================
# 7. Auto-Grading Agent
# ==========================================
class CriteriaScore(BaseModel):
    criterion: str
    earned: float
    max: float
    feedback: str

class GradeResponse(BaseModel):
    totalEarned: float
    percentage: float
    overallFeedback: str
    criteriaScores: List[CriteriaScore]

def grade_submission(text: str, rubrics: list, maxMarks: int) -> dict:
    llm = get_llm().with_structured_output(GradeResponse)
    template = """
    Grade this submission: {text}. Max marks: {maxMarks}. Rubrics: {rubrics}.
    Be extremely objective and critical. Provide granular feedback for each criterion.
    """
    prompt = PromptTemplate.from_template(template)
    chain = prompt | llm
    res = chain.invoke({"text": text, "maxMarks": maxMarks, "rubrics": json.dumps(rubrics)})
    return res.dict()

# ==========================================
# 8. Remedial Planning Agent
# ==========================================
def generate_remedial_plan(student: str, weakCOs: list) -> str:
    llm = get_llm()
    # PRIVACY/ANONYMIZATION: Do not send real student names to the external LLM
    anonymized_token = "[STUDENT_NAME_REDACTED]"
    template = "Generate a short remedial plan for {student} who is weak in: {weak}. Format in basic markdown."
    prompt = PromptTemplate.from_template(template)
    chain = prompt | llm
    
    # Invoke with anonymized token
    raw_response = chain.invoke({"student": anonymized_token, "weak": json.dumps(weakCOs)}).content
    
    # DE-ANONYMIZE: Restore the real student name before sending back to the user interface
    final_response = raw_response.replace(anonymized_token, student)
    return final_response
