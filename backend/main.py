import json
from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from sqlalchemy.orm import Session
from typing import Optional, List
import os
from dotenv import load_dotenv

from database import engine, get_db
import models

from agents.ai_logic import (
    chat_with_advisor, extract_syllabus, generate_teaching_philosophy,
    analyze_blooms, auto_map_copo, generate_assignment,
    grade_submission, generate_remedial_plan
)

load_dotenv()
models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="AI OBE System", version="2.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*", "null"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ─────────────────────────────────────────────
# HELPERS
# ─────────────────────────────────────────────
def course_to_dict(c: models.Course) -> dict:
    return {
        "id": c.id, "code": c.code, "name": c.name, "shortName": c.shortName,
        "deptId": c.deptId, "facultyId": c.facultyId, "semester": c.semester,
        "year": c.year, "division": c.division, "batch": c.batch, "class": c.klass,
        "champion": c.champion, "champDate": c.champDate,
        "lecturesPerWeek": c.lecturesPerWeek, "totalStudents": c.totalStudents,
        "teachingPhilosophy": c.teachingPhilosophy, "status": c.status,
        "examScheme": {"ia": c.ia, "mse": c.mse, "ese": c.ese},
        "attainmentLevels": {1: c.attLevel1, 2: c.attLevel2, 3: c.attLevel3},
        "directWeight": c.directWeight, "indirectWeight": c.indirectWeight,
    }

def co_to_dict(co: models.CourseOutcome) -> dict:
    return {
        "id": co.id, "courseId": co.courseId, "no": co.no, "code": co.code,
        "text": co.text or "", "bloomsLevel": co.bloomsLevel or "",
        "assessedThrough": (co.assessedThrough or "").split(",") if co.assessedThrough else [],
    }

def user_to_dict(u: models.User) -> dict:
    return {"id": u.id, "name": u.name, "email": u.email, "role": u.role,
            "deptId": u.deptId, "avatar": u.avatar}

def dept_to_dict(d: models.Department) -> dict:
    return {"id": d.id, "name": d.name, "code": d.code, "hod": d.hod,
            "vision": d.vision, "mission": d.mission}

def student_to_dict(s: models.Student) -> dict:
    return {"id": s.id, "courseId": s.courseId, "prn": s.prn, "name": s.name,
            "preSurveyScore": s.preSurveyScore, "learnerType": s.learnerType}

def uid():
    import time, random, string
    return str(int(time.time() * 1000)) + "".join(random.choices(string.ascii_lowercase, k=5))

# ─────────────────────────────────────────────
# ROOT
# ─────────────────────────────────────────────
@app.get("/")
def root():
    return {"status": "ok", "message": "AI OBE System v2 — fully backed by SQLite!"}

# ─────────────────────────────────────────────
# AUTH
# ─────────────────────────────────────────────
class LoginRequest(BaseModel):
    email: str
    password: str

@app.post("/api/auth/login")
def login(req: LoginRequest, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.email == req.email).first()
    if not user or user.password != req.password:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    return {"success": True, "user": user_to_dict(user)}

# ─────────────────────────────────────────────
# CONFIG
# ─────────────────────────────────────────────
@app.get("/api/config")
def get_config(db: Session = Depends(get_db)):
    cfg = db.query(models.Config).filter(models.Config.id == 1).first()
    if not cfg:
        cfg = models.Config(id=1); db.add(cfg); db.commit(); db.refresh(cfg)
    ia_questions = db.query(models.IAQuestion).all()
    ia_q_list = [{"courseId":q.courseId,"assessmentType":q.assessmentType,"assessmentNo":q.assessmentNo,
                  "questions":[{"qNo":q.qNo,"desc":q.desc,"bloomsLevel":q.bloomsLevel,"coNo":q.coNo,"maxMarks":q.maxMarks}]}
                 for q in ia_questions]
    return {"academicYear": cfg.academicYear, "aiEnabled": cfg.aiEnabled,
            "aiCallsUsed": cfg.aiCallsUsed, "maxAICalls": cfg.maxAICalls,
            "instituteVision": cfg.instituteVision, "instituteMission": cfg.instituteMission,
            "iaQuestions": ia_q_list}

class ConfigPatch(BaseModel):
    academicYear: Optional[str] = None
    aiEnabled: Optional[bool] = None
    aiCallsUsed: Optional[int] = None
    maxAICalls: Optional[int] = None
    instituteVision: Optional[str] = None
    instituteMission: Optional[str] = None

@app.put("/api/config")
def update_config(patch: ConfigPatch, db: Session = Depends(get_db)):
    cfg = db.query(models.Config).filter(models.Config.id == 1).first()
    if not cfg:
        cfg = models.Config(id=1); db.add(cfg)
    for field, val in patch.dict(exclude_none=True).items():
        setattr(cfg, field, val)
    db.commit()
    return {"success": True}

# ─────────────────────────────────────────────
# DEPARTMENTS
# ─────────────────────────────────────────────
@app.get("/api/departments")
def get_departments(db: Session = Depends(get_db)):
    return [dept_to_dict(d) for d in db.query(models.Department).all()]

@app.get("/api/departments/{dept_id}")
def get_department(dept_id: str, db: Session = Depends(get_db)):
    d = db.query(models.Department).filter(models.Department.id == dept_id).first()
    if not d: raise HTTPException(404, "Department not found")
    return dept_to_dict(d)

class DepartmentBody(BaseModel):
    id: Optional[str] = None
    name: str
    code: str
    hod: Optional[str] = None
    vision: Optional[str] = None
    mission: Optional[str] = None

@app.post("/api/departments")
def add_department(body: DepartmentBody, db: Session = Depends(get_db)):
    d = models.Department(id=body.id or uid(), name=body.name, code=body.code,
                          hod=body.hod, vision=body.vision, mission=body.mission)
    db.add(d); db.commit(); db.refresh(d)
    return dept_to_dict(d)

@app.put("/api/departments/{dept_id}")
def update_department(dept_id: str, body: DepartmentBody, db: Session = Depends(get_db)):
    d = db.query(models.Department).filter(models.Department.id == dept_id).first()
    if not d: raise HTTPException(404)
    for field in ["name","code","hod","vision","mission"]:
        val = getattr(body, field, None)
        if val is not None: setattr(d, field, val)
    db.commit()
    return dept_to_dict(d)

@app.delete("/api/departments/{dept_id}")
def delete_department(dept_id: str, db: Session = Depends(get_db)):
    d = db.query(models.Department).filter(models.Department.id == dept_id).first()
    if d: db.delete(d); db.commit()
    return {"success": True}

# ─────────────────────────────────────────────
# USERS
# ─────────────────────────────────────────────
@app.get("/api/users")
def get_users(role: Optional[str] = None, deptId: Optional[str] = None, db: Session = Depends(get_db)):
    q = db.query(models.User)
    if role: q = q.filter(models.User.role == role)
    if deptId: q = q.filter(models.User.deptId == deptId)
    return [user_to_dict(u) for u in q.all()]

@app.get("/api/users/{user_id}")
def get_user(user_id: str, db: Session = Depends(get_db)):
    u = db.query(models.User).filter(models.User.id == user_id).first()
    if not u: raise HTTPException(404)
    return user_to_dict(u)

class UserBody(BaseModel):
    id: Optional[str] = None
    name: str
    email: str
    password: str
    role: str
    deptId: Optional[str] = None
    avatar: Optional[str] = None

@app.post("/api/users")
def add_user(body: UserBody, db: Session = Depends(get_db)):
    u = models.User(id=body.id or uid(), name=body.name, email=body.email,
                    password=body.password, role=body.role, deptId=body.deptId,
                    avatar=body.avatar or body.name[0].upper())
    db.add(u); db.commit(); db.refresh(u)
    return user_to_dict(u)

@app.put("/api/users/{user_id}")
def update_user(user_id: str, body: UserBody, db: Session = Depends(get_db)):
    u = db.query(models.User).filter(models.User.id == user_id).first()
    if not u: raise HTTPException(404)
    for f in ["name","email","role","deptId","avatar"]:
        val = getattr(body, f, None)
        if val is not None: setattr(u, f, val)
    if body.password: u.password = body.password
    db.commit()
    return user_to_dict(u)

@app.delete("/api/users/{user_id}")
def delete_user(user_id: str, db: Session = Depends(get_db)):
    u = db.query(models.User).filter(models.User.id == user_id).first()
    if u: db.delete(u); db.commit()
    return {"success": True}

# ─────────────────────────────────────────────
# COURSES
# ─────────────────────────────────────────────
@app.get("/api/courses")
def get_courses(facultyId: Optional[str] = None, deptId: Optional[str] = None, db: Session = Depends(get_db)):
    q = db.query(models.Course)
    if facultyId:
        # HOD gets all dept courses
        u = db.query(models.User).filter(models.User.id == facultyId).first()
        if u and u.role == "hod":
            q = q.filter(models.Course.deptId == u.deptId)
        else:
            q = q.filter(models.Course.facultyId == facultyId)
    if deptId: q = q.filter(models.Course.deptId == deptId)
    return [course_to_dict(c) for c in q.all()]

@app.get("/api/courses/{course_id}")
def get_course(course_id: str, db: Session = Depends(get_db)):
    c = db.query(models.Course).filter(models.Course.id == course_id).first()
    if not c: raise HTTPException(404)
    return course_to_dict(c)

class ExamScheme(BaseModel):
    ia: int = 30; mse: int = 20; ese: int = 50

class CourseBody(BaseModel):
    id: Optional[str] = None
    code: str; name: str
    shortName: Optional[str] = None
    deptId: Optional[str] = None; facultyId: Optional[str] = None
    semester: Optional[str] = None; year: Optional[str] = None
    division: Optional[str] = None; batch: Optional[str] = None
    klass: Optional[str] = None; champion: Optional[str] = None
    champDate: Optional[str] = None; lecturesPerWeek: Optional[int] = None
    totalStudents: Optional[int] = None; teachingPhilosophy: Optional[str] = None
    status: Optional[str] = "active"
    examScheme: Optional[ExamScheme] = None
    directWeight: Optional[int] = 80; indirectWeight: Optional[int] = 20

@app.post("/api/courses")
def add_course(body: CourseBody, db: Session = Depends(get_db)):
    es = body.examScheme or ExamScheme()
    c = models.Course(
        id=body.id or uid(), code=body.code, name=body.name,
        shortName=body.shortName or body.code, deptId=body.deptId,
        facultyId=body.facultyId, semester=body.semester, year=body.year,
        division=body.division, batch=body.batch, klass=body.klass,
        champion=body.champion, champDate=body.champDate,
        lecturesPerWeek=body.lecturesPerWeek, totalStudents=body.totalStudents,
        teachingPhilosophy=body.teachingPhilosophy, status=body.status or "active",
        ia=es.ia, mse=es.mse, ese=es.ese,
        directWeight=body.directWeight or 80, indirectWeight=body.indirectWeight or 20
    )
    db.add(c); db.commit(); db.refresh(c)
    return course_to_dict(c)

@app.put("/api/courses/{course_id}")
def update_course(course_id: str, body: CourseBody, db: Session = Depends(get_db)):
    c = db.query(models.Course).filter(models.Course.id == course_id).first()
    if not c: raise HTTPException(404)
    for f in ["code","name","shortName","deptId","facultyId","semester","year","division","batch",
              "champion","champDate","lecturesPerWeek","totalStudents","teachingPhilosophy","status",
              "directWeight","indirectWeight"]:
        val = getattr(body, f, None)
        if val is not None: setattr(c, f, val)
    if body.klass: c.klass = body.klass
    if body.examScheme:
        c.ia = body.examScheme.ia; c.mse = body.examScheme.mse; c.ese = body.examScheme.ese
    db.commit()
    return course_to_dict(c)

@app.delete("/api/courses/{course_id}")
def delete_course(course_id: str, db: Session = Depends(get_db)):
    c = db.query(models.Course).filter(models.Course.id == course_id).first()
    if c: db.delete(c); db.commit()
    return {"success": True}

# ─────────────────────────────────────────────
# COURSE OUTCOMES
# ─────────────────────────────────────────────
@app.get("/api/courses/{course_id}/cos")
def get_cos(course_id: str, db: Session = Depends(get_db)):
    cos = db.query(models.CourseOutcome).filter(models.CourseOutcome.courseId == course_id)\
            .order_by(models.CourseOutcome.no).all()
    return [co_to_dict(co) for co in cos]

class COBody(BaseModel):
    id: Optional[str] = None; courseId: str; no: int; code: str
    text: Optional[str] = ""; bloomsLevel: Optional[str] = ""
    assessedThrough: Optional[list] = []

@app.post("/api/cos")
def add_co(body: COBody, db: Session = Depends(get_db)):
    co = models.CourseOutcome(
        id=body.id or uid(), courseId=body.courseId, no=body.no, code=body.code,
        text=body.text, bloomsLevel=body.bloomsLevel,
        assessedThrough=",".join(body.assessedThrough) if body.assessedThrough else ""
    )
    db.add(co); db.commit(); db.refresh(co)
    return co_to_dict(co)

class COSaveAll(BaseModel):
    courseId: str
    cos: list

@app.post("/api/cos/saveall")
def save_all_cos(body: COSaveAll, db: Session = Depends(get_db)):
    db.query(models.CourseOutcome).filter(models.CourseOutcome.courseId == body.courseId).delete()
    for item in body.cos:
        co = models.CourseOutcome(
            id=item.get("id") or uid(), courseId=body.courseId,
            no=item.get("no",1), code=item.get("code",""),
            text=item.get("text",""), bloomsLevel=item.get("bloomsLevel",""),
            assessedThrough=",".join(item.get("assessedThrough",[])) if item.get("assessedThrough") else ""
        )
        db.add(co)
    db.commit()
    return {"success": True}

@app.put("/api/cos/{co_id}")
def update_co(co_id: str, body: COBody, db: Session = Depends(get_db)):
    co = db.query(models.CourseOutcome).filter(models.CourseOutcome.id == co_id).first()
    if not co: raise HTTPException(404)
    co.text = body.text; co.bloomsLevel = body.bloomsLevel
    co.assessedThrough = ",".join(body.assessedThrough) if body.assessedThrough else ""
    db.commit()
    return co_to_dict(co)

@app.delete("/api/cos/{co_id}")
def delete_co(co_id: str, db: Session = Depends(get_db)):
    co = db.query(models.CourseOutcome).filter(models.CourseOutcome.id == co_id).first()
    if co: db.delete(co); db.commit()
    return {"success": True}

# ─────────────────────────────────────────────
# PO MAPPING
# ─────────────────────────────────────────────
@app.get("/api/courses/{course_id}/pomapping")
def get_pomapping(course_id: str, db: Session = Depends(get_db)):
    rows = db.query(models.PoMapping).filter(models.PoMapping.courseId == course_id).all()
    return [{"courseId":r.courseId,"coNo":r.coNo,"po":r.po,"val":r.val} for r in rows]

class POMapSave(BaseModel):
    courseId: str
    matrix: list  # [{coNo, po, val}]

@app.post("/api/pomapping/save")
def save_pomapping(body: POMapSave, db: Session = Depends(get_db)):
    db.query(models.PoMapping).filter(models.PoMapping.courseId == body.courseId).delete()
    for item in body.matrix:
        db.add(models.PoMapping(courseId=body.courseId, coNo=item["coNo"], po=item["po"], val=item["val"]))
    db.commit()
    return {"success": True}

# ─────────────────────────────────────────────
# STUDENTS
# ─────────────────────────────────────────────
@app.get("/api/courses/{course_id}/students")
def get_students(course_id: str, db: Session = Depends(get_db)):
    return [student_to_dict(s) for s in db.query(models.Student).filter(models.Student.courseId == course_id).all()]

class StudentBody(BaseModel):
    id: Optional[str] = None; courseId: str; prn: str; name: str
    preSurveyScore: Optional[int] = None; learnerType: Optional[str] = None

class StudentsSaveAll(BaseModel):
    courseId: str
    students: list

@app.post("/api/students/saveall")
def save_all_students(body: StudentsSaveAll, db: Session = Depends(get_db)):
    db.query(models.Student).filter(models.Student.courseId == body.courseId).delete()
    for item in body.students:
        db.add(models.Student(
            id=item.get("id") or uid(), courseId=body.courseId,
            prn=item.get("prn",""), name=item.get("name",""),
            preSurveyScore=item.get("preSurveyScore"), learnerType=item.get("learnerType","average")
        ))
    db.commit()
    return {"success": True}

@app.post("/api/students")
def add_student(body: StudentBody, db: Session = Depends(get_db)):
    s = models.Student(id=body.id or uid(), courseId=body.courseId, prn=body.prn,
                       name=body.name, preSurveyScore=body.preSurveyScore, learnerType=body.learnerType)
    db.add(s); db.commit(); db.refresh(s)
    return student_to_dict(s)

@app.delete("/api/students/{student_id}")
def delete_student(student_id: str, db: Session = Depends(get_db)):
    s = db.query(models.Student).filter(models.Student.id == student_id).first()
    if s: db.delete(s); db.commit()
    return {"success": True}

# ─────────────────────────────────────────────
# MARKS — IA
# ─────────────────────────────────────────────
@app.get("/api/courses/{course_id}/marks/ia")
def get_marks_ia(course_id: str, db: Session = Depends(get_db)):
    rows = db.query(models.MarksIA).filter(models.MarksIA.courseId == course_id).all()
    return [{"courseId":r.courseId,"prn":r.prn,"assessmentNo":r.assessmentNo,"qNo":r.qNo,"marks":r.marks} for r in rows]

class MarksSaveIA(BaseModel):
    courseId: str
    marks: list  # [{prn, assessmentNo, qNo, marks}]

@app.post("/api/marks/ia/save")
def save_marks_ia(body: MarksSaveIA, db: Session = Depends(get_db)):
    db.query(models.MarksIA).filter(models.MarksIA.courseId == body.courseId).delete()
    for m in body.marks:
        db.add(models.MarksIA(courseId=body.courseId, prn=m["prn"],
                              assessmentNo=m["assessmentNo"], qNo=m["qNo"], marks=m.get("marks",0)))
    db.commit()
    return {"success": True}

# ─────────────────────────────────────────────
# MARKS — MSE
# ─────────────────────────────────────────────
@app.get("/api/courses/{course_id}/marks/mse")
def get_marks_mse(course_id: str, db: Session = Depends(get_db)):
    rows = db.query(models.MarksMSE).filter(models.MarksMSE.courseId == course_id).all()
    return [{"courseId":r.courseId,"prn":r.prn,"qNo":r.qNo,"marks":r.marks} for r in rows]

class MarksSaveMSE(BaseModel):
    courseId: str
    marks: list

@app.post("/api/marks/mse/save")
def save_marks_mse(body: MarksSaveMSE, db: Session = Depends(get_db)):
    db.query(models.MarksMSE).filter(models.MarksMSE.courseId == body.courseId).delete()
    for m in body.marks:
        db.add(models.MarksMSE(courseId=body.courseId, prn=m["prn"], qNo=m["qNo"], marks=m.get("marks",0)))
    db.commit()
    return {"success": True}

# ─────────────────────────────────────────────
# MARKS — ESE
# ─────────────────────────────────────────────
@app.get("/api/courses/{course_id}/marks/ese")
def get_marks_ese(course_id: str, db: Session = Depends(get_db)):
    rows = db.query(models.MarksESE).filter(models.MarksESE.courseId == course_id).all()
    return [{"courseId":r.courseId,"prn":r.prn,"qNo":r.qNo,"marks":r.marks} for r in rows]

class MarksSaveESE(BaseModel):
    courseId: str
    marks: list

@app.post("/api/marks/ese/save")
def save_marks_ese(body: MarksSaveESE, db: Session = Depends(get_db)):
    db.query(models.MarksESE).filter(models.MarksESE.courseId == body.courseId).delete()
    for m in body.marks:
        db.add(models.MarksESE(courseId=body.courseId, prn=m["prn"], qNo=m["qNo"], marks=m.get("marks",0)))
    db.commit()
    return {"success": True}

# ─────────────────────────────────────────────
# IA QUESTIONS
# ─────────────────────────────────────────────
@app.get("/api/courses/{course_id}/ia-questions")
def get_ia_questions(course_id: str, db: Session = Depends(get_db)):
    rows = db.query(models.IAQuestion).filter(models.IAQuestion.courseId == course_id).all()
    # Group by assessmentType + assessmentNo
    grouped = {}
    for r in rows:
        key = (r.assessmentType, r.assessmentNo)
        if key not in grouped:
            grouped[key] = {"courseId": r.courseId, "assessmentType": r.assessmentType, "assessmentNo": r.assessmentNo, "questions": []}
        grouped[key]["questions"].append({"qNo": r.qNo, "desc": r.desc, "bloomsLevel": r.bloomsLevel, "coNo": r.coNo, "maxMarks": r.maxMarks})
    return list(grouped.values())

class IAQSaveAll(BaseModel):
    courseId: str
    assessmentType: str
    assessmentNo: int
    questions: list

@app.post("/api/ia-questions/save")
def save_ia_questions(body: IAQSaveAll, db: Session = Depends(get_db)):
    db.query(models.IAQuestion).filter(
        models.IAQuestion.courseId == body.courseId,
        models.IAQuestion.assessmentType == body.assessmentType,
        models.IAQuestion.assessmentNo == body.assessmentNo
    ).delete()
    for q in body.questions:
        db.add(models.IAQuestion(
            courseId=body.courseId, assessmentType=body.assessmentType,
            assessmentNo=body.assessmentNo, qNo=q["qNo"], desc=q.get("desc",""),
            bloomsLevel=q.get("bloomsLevel",""), coNo=q.get("coNo",1), maxMarks=q.get("maxMarks",10)
        ))
    db.commit()
    return {"success": True}

# ─────────────────────────────────────────────
# SURVEY
# ─────────────────────────────────────────────
@app.get("/api/courses/{course_id}/survey")
def get_survey(course_id: str, db: Session = Depends(get_db)):
    rows = db.query(models.Survey).filter(models.Survey.courseId == course_id).all()
    return [{"courseId":r.courseId,"prn":r.prn,"co":r.co,"score":r.score} for r in rows]

class SurveySaveAll(BaseModel):
    courseId: str
    data: list  # [{prn, co, score}]

@app.post("/api/survey/save")
def save_survey(body: SurveySaveAll, db: Session = Depends(get_db)):
    db.query(models.Survey).filter(models.Survey.courseId == body.courseId).delete()
    for s in body.data:
        db.add(models.Survey(courseId=body.courseId, prn=s["prn"], co=s["co"], score=s.get("score",0)))
    db.commit()
    return {"success": True}

# ─────────────────────────────────────────────
# ASSIGNMENTS
# ─────────────────────────────────────────────
@app.get("/api/courses/{course_id}/assignments")
def get_assignments(course_id: str, db: Session = Depends(get_db)):
    rows = db.query(models.Assignment).filter(models.Assignment.courseId == course_id).all()
    return [{"id":a.id,"courseId":a.courseId,"title":a.title,"topic":a.topic,"level":a.level,
             "coNo":a.coNo,"maxMarks":a.maxMarks,"questions":json.loads(a.questions or "[]"),"createdAt":a.createdAt} for a in rows]

class AssignmentBody(BaseModel):
    id: Optional[str] = None; courseId: str; title: str
    topic: Optional[str] = None; level: Optional[str] = None
    coNo: Optional[int] = None; maxMarks: Optional[int] = None
    questions: Optional[list] = []

@app.post("/api/assignments")
def add_assignment(body: AssignmentBody, db: Session = Depends(get_db)):
    import datetime
    a = models.Assignment(
        id=body.id or uid(), courseId=body.courseId, title=body.title,
        topic=body.topic, level=body.level, coNo=body.coNo, maxMarks=body.maxMarks,
        questions=json.dumps(body.questions or []),
        createdAt=datetime.datetime.utcnow().isoformat()
    )
    db.add(a); db.commit(); db.refresh(a)
    return {"id":a.id,"courseId":a.courseId,"title":a.title,"questions":body.questions,"createdAt":a.createdAt}

@app.delete("/api/assignments/{assignment_id}")
def delete_assignment(assignment_id: str, db: Session = Depends(get_db)):
    a = db.query(models.Assignment).filter(models.Assignment.id == assignment_id).first()
    if a: db.delete(a); db.commit()
    return {"success": True}

# ─────────────────────────────────────────────
# SYLLABUS
# ─────────────────────────────────────────────
@app.get("/api/courses/{course_id}/syllabus")
def get_syllabus(course_id: str, db: Session = Depends(get_db)):
    s = db.query(models.Syllabus).filter(models.Syllabus.courseId == course_id).first()
    if not s: return {"courseId": course_id, "modules": [], "books": []}
    return {"courseId": s.courseId, "modules": json.loads(s.modules or "[]"), "books": json.loads(s.books or "[]")}

class SyllabusBody(BaseModel):
    courseId: str
    modules: Optional[list] = []
    books: Optional[list] = []

@app.post("/api/syllabus/save")
def save_syllabus(body: SyllabusBody, db: Session = Depends(get_db)):
    s = db.query(models.Syllabus).filter(models.Syllabus.courseId == body.courseId).first()
    if s:
        s.modules = json.dumps(body.modules); s.books = json.dumps(body.books)
    else:
        db.add(models.Syllabus(courseId=body.courseId, modules=json.dumps(body.modules), books=json.dumps(body.books)))
    db.commit()
    return {"success": True}

# ─────────────────────────────────────────────
# HEALTH CHECK
# ─────────────────────────────────────────────
@app.get("/api/health")
def health():
    gemini_key = os.getenv("GEMINI_API_KEY")
    return {"database": "sqlite (real)", "ai_engine": "gemini-2.5-flash",
            "ai_status": "configured" if gemini_key else "missing_key", "version": "2.0.0"}

# ─────────────────────────────────────────────
# AGENTIC AI ENDPOINTS
# ─────────────────────────────────────────────
class ChatRequest(BaseModel):
    message: str; context: str = ""

@app.post("/api/chat")
def api_chat(req: ChatRequest):
    return {"reply": chat_with_advisor(req.message, req.context)}

class SyllabusRequest(BaseModel):
    text: str

@app.post("/api/extract-syllabus")
def api_extract_syllabus(req: SyllabusRequest):
    return {"success": True, "data": extract_syllabus(req.text)}

class PhilosophyRequest(BaseModel):
    courseName: str; deptVision: str; deptMission: str

@app.post("/api/philosophy")
def api_philosophy(req: PhilosophyRequest):
    return {"success": True, "data": generate_teaching_philosophy(req.courseName, req.deptVision, req.deptMission)}

class BloomsRequest(BaseModel):
    cos: list

@app.post("/api/analyze-blooms")
def api_analyze_blooms(req: BloomsRequest):
    return {"success": True, "data": analyze_blooms(req.cos)}

class CoPoRequest(BaseModel):
    cos: list; pos: list

@app.post("/api/auto-map-copo")
def api_auto_map_copo(req: CoPoRequest):
    return {"success": True, "data": auto_map_copo(req.cos, req.pos)}

class AssignmentRequest(BaseModel):
    topic: str; level: str; num: int; marks: int

@app.post("/api/generate-assignment")
def api_generate_assignment(req: AssignmentRequest):
    return {"success": True, "data": generate_assignment(req.topic, req.level, req.num, req.marks)}

class GradeRequest(BaseModel):
    text: str; rubrics: list; maxMarks: int

@app.post("/api/grade")
def api_grade(req: GradeRequest):
    return {"success": True, "data": grade_submission(req.text, req.rubrics, req.maxMarks)}

class RemedialRequest(BaseModel):
    student: str; weakCOs: list

@app.post("/api/remedial")
def api_remedial(req: RemedialRequest):
    return {"success": True, "data": generate_remedial_plan(req.student, req.weakCOs)}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)
