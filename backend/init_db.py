import json
from database import engine, SessionLocal
import models

# Drop all and recreate so new tables appear cleanly
models.Base.metadata.drop_all(bind=engine)
models.Base.metadata.create_all(bind=engine)

def seed_db():
    db = SessionLocal()

    # ── Config ──
    db.add(models.Config(
        id=1, academicYear="2025-26", aiEnabled=True, aiCallsUsed=0, maxAICalls=50,
        instituteVision="To be the most preferred Autonomous Technological University in the country, known for delivering quality engineering education to produce industry ready, society conscious, and research oriented engineers.",
        instituteMission="Providing quality technical education through well-qualified, dedicated faculty and state-of-the-art infrastructure; fostering values, ethics and social responsibility."
    ))

    # ── Departments ──
    departments = [
        models.Department(id="dept-ds",  name="Data Science",           code="DS",  hod="Dr. A. Mehta",       vision="To be a center of excellence in Data Science.",              mission="To foster innovation and problem-solving through data-centric approaches."),
        models.Department(id="dept-cs",  name="Computer Engineering",   code="CS",  hod="Dr. V. C. Wangikar", vision="To create globally competent computer professionals.",        mission="To empower students with robust computational skills and ethical practices."),
        models.Department(id="dept-ai",  name="AI & Machine Learning",  code="AI",  hod="Dr. R. Sharma",      vision="To lead the future of artificial intelligence research.",     mission="Pioneering intelligent solutions for future challenges."),
        models.Department(id="dept-it",  name="Information Technology", code="IT",  hod="Dr. P. Kulkarni",    vision="To innovate in IT solutions and services.",                   mission="Bridging the gap between technology and business needs."),
    ]
    db.add_all(departments)

    # ── Users ──
    users = [
        models.User(id="usr-admin", name="System Administrator", email="admin@mitaoe.ac.in",      password="admin123",   role="admin",   deptId=None,      avatar="A"),
        models.User(id="usr-vw",    name="Vaishali Wangikar",    email="vwangikar@mitaoe.ac.in",  password="faculty123", role="faculty", deptId="dept-cs", avatar="V"),
        models.User(id="usr-am",    name="Prof. A. Mehta",       email="ametha@mitaoe.ac.in",     password="faculty123", role="faculty", deptId="dept-ds", avatar="A"),
        models.User(id="usr-rs",    name="Prof. R. Sharma",      email="rsharma@mitaoe.ac.in",    password="faculty123", role="faculty", deptId="dept-ai", avatar="R"),
        models.User(id="usr-hod1",  name="Dr. V. C. Wangikar",  email="hod.cs@mitaoe.ac.in",     password="hod123",     role="hod",     deptId="dept-cs", avatar="H"),
        models.User(id="usr-hod2",  name="Dr. A. Mehta (HOD)",  email="hod.ds@mitaoe.ac.in",     password="hod123",     role="hod",     deptId="dept-ds", avatar="H"),
        models.User(id="stu-001",   name="Rakshe Veer Tushar",  email="student@mitaoe.ac.in",     password="student123", role="student", deptId="dept-cs"),
        models.User(id="stu-002",   name="Narote Sanket Satish",email="narote@student.mitaoe.ac.in", password="student123", role="student", deptId="dept-cs"),
        models.User(id="stu-004",   name="Om Sutar",            email="om.sutar@mitaoe.ac.in",    password="student123", role="student", deptId="dept-cs"),
    ]
    db.add_all(users)

    # ── Courses ──
    courses = [
        models.Course(
            id="crs-eda", code="230331T", name="Exploratory Data Analysis", shortName="EDA",
            deptId="dept-cs", facultyId="usr-vw", semester="V", year="2025-26",
            division="A", batch="A1, A2", klass="TY BTech",
            champion="Dr. V. C. Wangikar", champDate="2025-07-21",
            lecturesPerWeek=3, totalStudents=26,
            teachingPhilosophy="Foster Curiosity and Inquiry, Emphasize the Iterative Nature of EDA, Develop Critical Thinking Skills, Balance Theory with Practice, Promote Data Storytelling.",
            status="active", ia=30, mse=20, ese=50, attLevel1=65, attLevel2=75, attLevel3=85, directWeight=80, indirectWeight=20
        ),
        models.Course(
            id="crs-ml", code="230332T", name="Machine Learning", shortName="ML",
            deptId="dept-cs", facultyId="usr-vw", semester="V", year="2025-26",
            division="A", batch="A1", klass="TY BTech",
            champion="Dr. V. C. Wangikar", champDate="2025-07-21",
            lecturesPerWeek=3, totalStudents=41,
            teachingPhilosophy="Blend theory with hands-on ML implementation.",
            status="active", ia=30, mse=20, ese=50, attLevel1=65, attLevel2=75, attLevel3=85, directWeight=80, indirectWeight=20
        ),
        models.Course(
            id="crs-dw", code="230333T", name="Data Warehousing & Mining", shortName="DWM",
            deptId="dept-ds", facultyId="usr-am", semester="V", year="2025-26",
            division="A", batch="A1", klass="TY BTech",
            champion="Dr. A. Mehta", champDate="2025-07-21",
            lecturesPerWeek=3, totalStudents=38,
            teachingPhilosophy="Practical data engineering skills.",
            status="active", ia=30, mse=20, ese=50, attLevel1=65, attLevel2=75, attLevel3=85, directWeight=80, indirectWeight=20
        ),
    ]
    db.add_all(courses)

    # ── Course Outcomes ──
    cos = [
        # EDA
        models.CourseOutcome(id="co-1",    courseId="crs-eda", no=1, code="CO1", text="Select the efficient data warehouse architecture for the given case study.",                                                                                         bloomsLevel="L3", assessedThrough="ia,mse,ese"),
        models.CourseOutcome(id="co-2",    courseId="crs-eda", no=2, code="CO2", text="Develop a data mart using different modeling techniques for given applications and present it in a group.",                                                            bloomsLevel="L3", assessedThrough="ia,ese"),
        models.CourseOutcome(id="co-3",    courseId="crs-eda", no=3, code="CO3", text="Analyze the prediction by hypothesis testing using data analysis tools.",                                                                                             bloomsLevel="L4", assessedThrough="ia,mse,ese"),
        models.CourseOutcome(id="co-4",    courseId="crs-eda", no=4, code="CO4", text="Construct a model for providing predictions on given datasets by identifying trends and detecting outliers on real-time application using available tools and technology.", bloomsLevel="L4", assessedThrough="ia,mse,ese"),
        models.CourseOutcome(id="co-5",    courseId="crs-eda", no=5, code="CO5", text="", bloomsLevel="", assessedThrough=""),
        models.CourseOutcome(id="co-6",    courseId="crs-eda", no=6, code="CO6", text="", bloomsLevel="", assessedThrough=""),
        # ML
        models.CourseOutcome(id="co-ml-1", courseId="crs-ml",  no=1, code="CO1", text="Apply supervised learning algorithms to solve classification and regression problems.",                 bloomsLevel="L3", assessedThrough="ia,mse,ese"),
        models.CourseOutcome(id="co-ml-2", courseId="crs-ml",  no=2, code="CO2", text="Implement unsupervised learning techniques for clustering and dimensionality reduction.",              bloomsLevel="L3", assessedThrough="ia,ese"),
        models.CourseOutcome(id="co-ml-3", courseId="crs-ml",  no=3, code="CO3", text="Evaluate model performance using appropriate metrics and cross-validation.",                          bloomsLevel="L4", assessedThrough="ia,mse,ese"),
        models.CourseOutcome(id="co-ml-4", courseId="crs-ml",  no=4, code="CO4", text="Design and implement neural network architectures for real-world applications.",                      bloomsLevel="L5", assessedThrough="ia,ese"),
    ]
    db.add_all(cos)

    # ── PO Mapping (EDA) ──
    po_data = [
        # CO1
        ("crs-eda",1,"PO1",2),("crs-eda",1,"PO2",3),("crs-eda",1,"PO3",3),("crs-eda",1,"PO4",1),
        ("crs-eda",1,"PO5",1),("crs-eda",1,"PO11",1),("crs-eda",1,"PSO1",2),("crs-eda",1,"PSO3",1),
        # CO2
        ("crs-eda",2,"PO1",2),("crs-eda",2,"PO2",3),("crs-eda",2,"PO3",3),("crs-eda",2,"PO4",1),
        ("crs-eda",2,"PO5",3),("crs-eda",2,"PO11",1),("crs-eda",2,"PSO1",3),("crs-eda",2,"PSO2",1),("crs-eda",2,"PSO3",2),
        # CO3
        ("crs-eda",3,"PO1",3),("crs-eda",3,"PO2",3),("crs-eda",3,"PO3",3),("crs-eda",3,"PO4",2),
        ("crs-eda",3,"PO5",3),("crs-eda",3,"PO7",1),("crs-eda",3,"PO11",1),("crs-eda",3,"PSO1",3),("crs-eda",3,"PSO2",3),("crs-eda",3,"PSO3",3),
        # CO4
        ("crs-eda",4,"PO1",3),("crs-eda",4,"PO2",3),("crs-eda",4,"PO3",3),("crs-eda",4,"PO4",2),
        ("crs-eda",4,"PO5",3),("crs-eda",4,"PO7",1),("crs-eda",4,"PO11",1),("crs-eda",4,"PSO1",3),("crs-eda",4,"PSO2",3),("crs-eda",4,"PSO3",3),
    ]
    db.add_all([models.PoMapping(courseId=c, coNo=n, po=p, val=v) for c,n,p,v in po_data])

    # ── Students (EDA) ──
    students = [
        models.Student(id="s01", courseId="crs-eda", prn="202201040001", name="Rakshe Veer Tushar",        preSurveyScore=3,  learnerType="slow"),
        models.Student(id="s02", courseId="crs-eda", prn="202201040003", name="Narote Sanket Satish",      preSurveyScore=8,  learnerType="advanced"),
        models.Student(id="s03", courseId="crs-eda", prn="202201040004", name="Bolaj Samarth Hanmant",     preSurveyScore=7,  learnerType="advanced"),
        models.Student(id="s04", courseId="crs-eda", prn="202201040005", name="Sarode Lokesh Vasudev",     preSurveyScore=6,  learnerType="average"),
        models.Student(id="s05", courseId="crs-eda", prn="202201040006", name="Thorat Harshada Subhash",   preSurveyScore=7,  learnerType="advanced"),
        models.Student(id="s06", courseId="crs-eda", prn="202201040007", name="Kulkarni Parth Dipak",      preSurveyScore=5,  learnerType="average"),
        models.Student(id="s07", courseId="crs-eda", prn="202201040008", name="Pawar Aniket Suraj",        preSurveyScore=6,  learnerType="average"),
        models.Student(id="s08", courseId="crs-eda", prn="202201040009", name="Maske Prashik Ghansham",    preSurveyScore=4,  learnerType="average"),
        models.Student(id="s09", courseId="crs-eda", prn="202201040010", name="Om Sutar",                  preSurveyScore=8,  learnerType="advanced"),
        models.Student(id="s10", courseId="crs-eda", prn="202201040011", name="Vemula Ramani Bhumaiah",    preSurveyScore=7,  learnerType="advanced"),
        models.Student(id="s11", courseId="crs-eda", prn="202201040012", name="Gite Abhijeet Shantilal",   preSurveyScore=5,  learnerType="average"),
        models.Student(id="s12", courseId="crs-eda", prn="202201040013", name="Dasari Essak Mahesh",       preSurveyScore=6,  learnerType="average"),
        models.Student(id="s13", courseId="crs-eda", prn="202201040014", name="Raut Krishna Bhimrao",      preSurveyScore=3,  learnerType="slow"),
        models.Student(id="s14", courseId="crs-eda", prn="202201040015", name="Shinde Vaibhav Ajay",       preSurveyScore=7,  learnerType="advanced"),
        models.Student(id="s15", courseId="crs-eda", prn="202201040016", name="Ghodake Vipul Vijaykumar",  preSurveyScore=5,  learnerType="average"),
        models.Student(id="s16", courseId="crs-eda", prn="202201040017", name="Pendam Tejas Pradip",       preSurveyScore=8,  learnerType="advanced"),
        models.Student(id="s17", courseId="crs-eda", prn="202201040019", name="Bingi Vidya Balganesh",     preSurveyScore=6,  learnerType="average"),
        models.Student(id="s18", courseId="crs-eda", prn="202201040020", name="Divekar Swarup Arjun",      preSurveyScore=4,  learnerType="average"),
        models.Student(id="s19", courseId="crs-eda", prn="202201040021", name="Amrik Bhadra",              preSurveyScore=7,  learnerType="advanced"),
        models.Student(id="s20", courseId="crs-eda", prn="202201040022", name="Chavan Snehal Suraj",       preSurveyScore=5,  learnerType="average"),
        models.Student(id="s21", courseId="crs-eda", prn="202201040023", name="Pande Aniruddha Pradip",    preSurveyScore=6,  learnerType="average"),
        models.Student(id="s22", courseId="crs-eda", prn="202201040024", name="Popalghat Amol Santosh",    preSurveyScore=7,  learnerType="advanced"),
        models.Student(id="s23", courseId="crs-eda", prn="202201040025", name="Lohkare Girish Gokul",      preSurveyScore=4,  learnerType="average"),
        models.Student(id="s24", courseId="crs-eda", prn="202201040026", name="Darade Tejashri Krushna",   preSurveyScore=8,  learnerType="advanced"),
        models.Student(id="s25", courseId="crs-eda", prn="202201040027", name="Jadhav Vaibhav Satish",     preSurveyScore=5,  learnerType="average"),
        models.Student(id="s26", courseId="crs-eda", prn="202201040029", name="Sumit Kedar",               preSurveyScore=3,  learnerType="slow"),
    ]
    db.add_all(students)

    # ── IA Questions ──
    ia_questions = [
        models.IAQuestion(courseId="crs-eda", assessmentType="ia",  assessmentNo=1, qNo=1, desc="For CARGO shipper application, identify and justify appropriate Data Warehouse architecture.",    bloomsLevel="L5", coNo=1, maxMarks=3),
        models.IAQuestion(courseId="crs-eda", assessmentType="ia",  assessmentNo=1, qNo=2, desc="For CARGO shipper application, apply dimensional modelling. Identify dimensions, measures, and draw the model.", bloomsLevel="L5", coNo=2, maxMarks=3),
        models.IAQuestion(courseId="crs-eda", assessmentType="mse", assessmentNo=1, qNo=1, desc="Explain OLAP operations with suitable examples.",               bloomsLevel="L3", coNo=1, maxMarks=6),
        models.IAQuestion(courseId="crs-eda", assessmentType="mse", assessmentNo=1, qNo=2, desc="Apply hypothesis testing on given dataset to derive conclusions.", bloomsLevel="L4", coNo=3, maxMarks=7),
        models.IAQuestion(courseId="crs-eda", assessmentType="mse", assessmentNo=1, qNo=3, desc="Describe types of data preprocessing techniques.",               bloomsLevel="L2", coNo=3, maxMarks=7),
    ]
    db.add_all(ia_questions)

    # ── Sample IA Marks ──
    marks_raw = [
        # aNo, qNo, prn, marks
        (1,1,"202201040001",1),(1,2,"202201040001",2),
        (1,1,"202201040003",3),(1,2,"202201040003",3),
        (1,1,"202201040004",3),(1,2,"202201040004",2),
        (1,1,"202201040005",2),(1,2,"202201040005",3),
        (1,1,"202201040006",2),(1,2,"202201040006",1),
        (1,1,"202201040007",3),(1,2,"202201040007",2),
        (1,1,"202201040008",1),(1,2,"202201040008",2),
        (1,1,"202201040009",2),(1,2,"202201040009",2),
        (1,1,"202201040010",3),(1,2,"202201040010",3),
        (1,1,"202201040011",2),(1,2,"202201040011",2),
        (1,1,"202201040012",3),(1,2,"202201040012",1),
        (1,1,"202201040013",1),(1,2,"202201040013",1),
        (1,1,"202201040014",3),(1,2,"202201040014",2),
        (1,1,"202201040015",2),(1,2,"202201040015",1),
        (1,1,"202201040016",3),(1,2,"202201040016",3),
        (1,1,"202201040017",2),(1,2,"202201040017",2),
        (1,1,"202201040019",2),(1,2,"202201040019",1),
        (1,1,"202201040020",3),(1,2,"202201040020",2),
        (1,1,"202201040021",2),(1,2,"202201040021",2),
        (1,1,"202201040022",3),(1,2,"202201040022",3),
        (1,1,"202201040023",2),(1,2,"202201040023",2),
        (1,1,"202201040024",3),(1,2,"202201040024",3),
        (1,1,"202201040025",2),(1,2,"202201040025",1),
        (1,1,"202201040026",3),(1,2,"202201040026",2),
        (1,1,"202201040027",1),(1,2,"202201040027",1),
        (1,1,"202201040029",1),(1,2,"202201040029",1),
    ]
    db.add_all([models.MarksIA(courseId="crs-eda", assessmentNo=a, qNo=q, prn=p, marks=m) for a,q,p,m in marks_raw])

    db.commit()
    db.close()
    print("Database fully seeded with ALL demo data!")

if __name__ == "__main__":
    seed_db()
