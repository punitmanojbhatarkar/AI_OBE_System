/* ============================================================
   OBE SYSTEM — Data Layer (localStorage CRUD + Demo Data)
   All data operations go through this module.
   ============================================================ */

const COMPETENCY_INDICATORS = [{"po": "PO1", "comp_id": "1.1", "comp_text": "Demonstrate competence in mathematical modelling", "indicator": "Apply the knowledge of Computer Science and  Engineering"}, {"po": "PO1", "comp_id": "1.1", "comp_text": "Demonstrate competence in mathematical modelling", "indicator": "Apply the concepts of probability, statistics and queuing theory in modeling of computer-based system, data and network protocols"}, {"po": "PO1", "comp_id": "1.2", "comp_text": "Demonstrate competence in basic sciences", "indicator": "Apply laws of natural science to an engineering problem"}, {"po": "PO1", "comp_id": "1.3", "comp_text": "Demonstrate competence in engineering fundamentals", "indicator": "Apply engineering fundamentals"}, {"po": "PO1", "comp_id": "1.4", "comp_text": "Demonstrate competence in specialized engineering  knowledge to the program", "indicator": "Apply theory and principles of computer science and engineering to solve an engineering problem"}, {"po": "PO2", "comp_id": "2.1", "comp_text": "Demonstrate an ability to identify and formulate complex engineering problem", "indicator": "Evaluate problem statements and identifies objectives"}, {"po": "PO2", "comp_id": "2.1", "comp_text": "Demonstrate an ability to identify and formulate complex engineering problem", "indicator": "Identify processes/modules/algorithms of a computer-based system and parameters to solve a problem"}, {"po": "PO2", "comp_id": "2.1", "comp_text": "Demonstrate an ability to identify and formulate complex engineering problem", "indicator": "Identify mathematical algorithmic knowledge that applies to a given problem"}, {"po": "PO2", "comp_id": "2.2", "comp_text": "2.2 Demonstrate an ability to formulate a solution plan and methodology for an engineering problem", "indicator": "Reframe the computer-based system into interconnected subsystems"}, {"po": "PO2", "comp_id": "2.2", "comp_text": "2.2 Demonstrate an ability to formulate a solution plan and methodology for an engineering problem", "indicator": "Identify functionalities and computing resources."}, {"po": "PO2", "comp_id": "2.2", "comp_text": "2.2 Demonstrate an ability to formulate a solution plan and methodology for an engineering problem", "indicator": "Identify existing solution/methods to solve the problem, including forming justified approximations and assumptions"}, {"po": "PO2", "comp_id": "2.2", "comp_text": "2.2 Demonstrate an ability to formulate a solution plan and methodology for an engineering problem", "indicator": "Compare and contrast alternative solution/methods to select the best methods"}, {"po": "PO2", "comp_id": "2.2", "comp_text": "2.2 Demonstrate an ability to formulate a solution plan and methodology for an engineering problem", "indicator": "Compare and contrast alternative solution processes to select the best process."}, {"po": "PO2", "comp_id": "2.3", "comp_text": "2.3 Demonstrate an ability to formulate and interpret a model", "indicator": "Able to apply computer engineering principles to formulate modules of a system with required applicability and performance."}, {"po": "PO2", "comp_id": "2.3", "comp_text": "2.3 Demonstrate an ability to formulate and interpret a model", "indicator": "Identify design constraints for required performance criteria."}, {"po": "PO2", "comp_id": "2.4", "comp_text": "Demonstrate an ability to execute a solution process and analyze  results", "indicator": "Apply engineering mathematics to implement solution"}, {"po": "PO2", "comp_id": "2.4", "comp_text": "Demonstrate an ability to execute a solution process and analyze  results", "indicator": "Analyze and interpret the results using contemporary tools."}, {"po": "PO2", "comp_id": "2.4", "comp_text": "Demonstrate an ability to execute a solution process and analyze  results", "indicator": "Identify the limitations of the solution and sources/causes."}, {"po": "PO2", "comp_id": "2.4", "comp_text": "Demonstrate an ability to execute a solution process and analyze  results", "indicator": "Arrive at conclusions with respect to the objectives."}, {"po": "PO3", "comp_id": "3.1", "comp_text": "Demonstrate an ability todefine a comples open ended problem in engineering terms", "indicator": "Recognize that need analysis is key to good problem definition"}, {"po": "PO3", "comp_id": "3.1", "comp_text": "Demonstrate an ability todefine a comples open ended problem in engineering terms", "indicator": "Able to identify and document system requirements from stakeholders."}, {"po": "PO3", "comp_id": "3.1", "comp_text": "Demonstrate an ability todefine a comples open ended problem in engineering terms", "indicator": "Ability to review state of the art literature to synthesize requirements."}, {"po": "PO3", "comp_id": "3.1", "comp_text": "Demonstrate an ability todefine a comples open ended problem in engineering terms", "indicator": "Extract engineering requirements from relevant engineering codes and standards defined by ISO/IEC/IEEE."}, {"po": "PO3", "comp_id": "3.1", "comp_text": "Demonstrate an ability todefine a comples open ended problem in engineering terms", "indicator": "Explore and synthesize engineering requirements considering health, safety, risks, environment, cultural and societal issues"}, {"po": "PO3", "comp_id": "3.1", "comp_text": "Demonstrate an ability todefine a comples open ended problem in engineering terms", "indicator": "Determine design, objectives, functional requirements and arrive at specifications"}, {"po": "PO3", "comp_id": "3.2", "comp_text": "Demonstrate an ability to generate diverse set of alternative design solutions", "indicator": "Ability to explore design alternatives."}, {"po": "PO3", "comp_id": "3.2", "comp_text": "Demonstrate an ability to generate diverse set of alternative design solutions", "indicator": "Build models/prototypes to develop diverse set of design solutions"}, {"po": "PO3", "comp_id": "3.2", "comp_text": "Demonstrate an ability to generate diverse set of alternative design solutions", "indicator": "Identify suitable criteria for evaluation of alternate design solutions"}, {"po": "PO3", "comp_id": "3.3", "comp_text": "Demonstrate an ability to select an optimal design scheme for further development", "indicator": "Ability to perform systematic evaluation of the degree to which several design concepts meet the criteria."}, {"po": "PO3", "comp_id": "3.3", "comp_text": "Demonstrate an ability to select an optimal design scheme for further development", "indicator": "Consult with domain experts and stakeholders to select candidate engineering design solution for further development"}, {"po": "PO3", "comp_id": "3.4", "comp_text": "Demonstrate an ability to advance an engineering design to a defined end state", "indicator": "Refine a conceptual design into a detailed design within the existing constraints (of the resources)"}, {"po": "PO3", "comp_id": "3.4", "comp_text": "Demonstrate an ability to advance an engineering design to a defined end state", "indicator": "Generate information through appropriate tests to improve or revise design"}, {"po": "PO4", "comp_id": "4.1", "comp_text": "Demonstrate an ability to conduct investigations of a technical issues consistant with their level of knowledge and understanding", "indicator": "Define a problem for purpose of investigation, its scope and importance"}, {"po": "PO4", "comp_id": "4.1", "comp_text": "Demonstrate an ability to conduct investigations of a technical issues consistant with their level of knowledge and understanding", "indicator": "Able to choose appropriate procedure/algorithm, dataset and test cases"}, {"po": "PO4", "comp_id": "4.1", "comp_text": "Demonstrate an ability to conduct investigations of a technical issues consistant with their level of knowledge and understanding", "indicator": "Apply appropriate hardware/software tools to conduct the experiment"}, {"po": "PO4", "comp_id": "4.2", "comp_text": "Demonstrate an ability to design experiments to solve open ended problem", "indicator": "Establish a relationship between measured data and underlying physical principles"}, {"po": "PO4", "comp_id": "4.2", "comp_text": "Demonstrate an ability to design experiments to solve open ended problem", "indicator": "Understand the importance of statistical design of experiments and choose an appropriate experimental design plan based on the study objectives"}, {"po": "PO4", "comp_id": "4.2", "comp_text": "Demonstrate an ability to design experiments to solve open ended problem", "indicator": "Use appropriate procedures, tools and techniques to collect and analyze data"}, {"po": "PO4", "comp_id": "4.3", "comp_text": "Demonstrate an ability to analyze data and reach a valid conclusion", "indicator": "Critically analyze data for trends and correlations, stating possible errors and limitations"}, {"po": "PO4", "comp_id": "4.3", "comp_text": "Demonstrate an ability to analyze data and reach a valid conclusion", "indicator": "Represent data (in tabular and/or graphical forms) so as to facilitate analysis and explanation of the data, and drawing of conclusions"}, {"po": "PO4", "comp_id": "4.3", "comp_text": "Demonstrate an ability to analyze data and reach a valid conclusion", "indicator": "Synthesize information and knowledge about the problem from the raw data to reach appropriate conclusions"}, {"po": "PO5", "comp_id": "5.1", "comp_text": "Demonstrate an ability to identify/create modern engineering tools, techniques and resources", "indicator": "Identify modern engineering tools techniques and resources for engineering activities"}, {"po": "PO5", "comp_id": "5.1", "comp_text": "Demonstrate an ability to identify/create modern engineering tools, techniques and resources", "indicator": "Create/adapt/modify/extend tools and techniques to solve engineering problems"}, {"po": "PO5", "comp_id": "5.2", "comp_text": "Demonstrate an ability to select and apply disciplinespecific tools, techniques and resources", "indicator": "Identify the strengths and limitations of tools for (i) acquiring information (ii) modeling and simulating (iii) monitoring system performance, and (iv) creating engineering designs"}, {"po": "PO5", "comp_id": "5.2", "comp_text": "Demonstrate an ability to select and apply disciplinespecific tools, techniques and resources", "indicator": "Demonstrate proficiency in using discipline specific tools"}, {"po": "PO5", "comp_id": "5.3", "comp_text": "Demonstrate an ability to evaluate the suitability and limitations of tools used to slve an engineering problem", "indicator": "Discuss limitations and validate tools, techniques and resources"}, {"po": "PO5", "comp_id": "5.3", "comp_text": "Demonstrate an ability to evaluate the suitability and limitations of tools used to slve an engineering problem", "indicator": "Verify the credibility of results from tool use with reference to the accuracy and limitations, and the assumptions inherent in their use."}, {"po": "PO6", "comp_id": "6.1", "comp_text": "Demonstrate an ability to describe engineering roles in a broader context, pertaining to environment, health, safety, legal and public welfare.", "indicator": "Identify and describe various engineering roles; particularly as pertains to protection of the public and public interest at global, regional and local level."}, {"po": "PO6", "comp_id": "6.2", "comp_text": "Demonstrate an understanding of professional engineering regulations, legislation and standards", "indicator": "Interpret legislation, regulations, codes, and standards relevant to professional engineering practice and explain its contribution to the protection of the public."}, {"po": "PO7", "comp_id": "7.1", "comp_text": "Demonstrate an understanding of the impact of engineering and industrial practices on social, environmental and in economic contexts.", "indicator": "Identify risks/impacts in the life-cycle of an engineering product or activity"}, {"po": "PO7", "comp_id": "7.1", "comp_text": "Demonstrate an understanding of the impact of engineering and industrial practices on social, environmental and in economic contexts.", "indicator": "Understand the relationship between the technical, socioeconomic and environmental dimensions of sustainability"}, {"po": "PO7", "comp_id": "7.2", "comp_text": "Demonstratr an ability to apply principles of sustainable design and development", "indicator": "Describe management techniques for sustainable development"}, {"po": "PO7", "comp_id": "7.2", "comp_text": "Demonstratr an ability to apply principles of sustainable design and development", "indicator": "Apply principles of preventive engineering and sustainable development to an engineering activity or product relevant to the discipline"}, {"po": "PO8", "comp_id": "8.1", "comp_text": "Demonstrate an ability to recognize ethical dilemmas", "indicator": "Identify situations of unethical professional conduct and propose ethical alternatives"}, {"po": "PO8", "comp_id": "8.2", "comp_text": "Demonstrate an ability to apply the code of Ethics", "indicator": "Identify tenets of code of ethics given by the professional bodies like IEEE."}, {"po": "PO8", "comp_id": "8.2", "comp_text": "Demonstrate an ability to apply the code of Ethics", "indicator": "Examine and apply moral & ethical principles to known case studies"}, {"po": "PO9", "comp_id": "9.1", "comp_text": "Demonstrate an ability to form a team and define a role for each member", "indicator": "Recognize a variety of working and learning preferences; appreciate the value of diversity on a team"}, {"po": "PO9", "comp_id": "9.1", "comp_text": "Demonstrate an ability to form a team and define a role for each member", "indicator": "Implement the norms of practice (e.g. rules, roles, charters, agendas etc.) of effective team work, to accomplish a goal"}, {"po": "PO9", "comp_id": "9.2", "comp_text": "Demonstrate effective individual and team operations- communication, problem solving, conflict resolving, and leadership skills", "indicator": "Demonstrate effective communication, problem solving, conflict resolution and leadership skills"}, {"po": "PO9", "comp_id": "9.2", "comp_text": "Demonstrate effective individual and team operations- communication, problem solving, conflict resolving, and leadership skills", "indicator": "Treat other team members respectfully"}, {"po": "PO9", "comp_id": "9.2", "comp_text": "Demonstrate effective individual and team operations- communication, problem solving, conflict resolving, and leadership skills", "indicator": "Listen to other members"}, {"po": "PO9", "comp_id": "9.2", "comp_text": "Demonstrate effective individual and team operations- communication, problem solving, conflict resolving, and leadership skills", "indicator": "Maintain composure in difficult situations"}, {"po": "PO9", "comp_id": "9.3", "comp_text": "Demonstrate success in a team based project", "indicator": "Present results as a team, with smooth integration of contributions from all individual efforts"}, {"po": "PO10", "comp_id": "10.1", "comp_text": "Demonstrate an ability to comprehend technical literature and document project work", "indicator": "Read, understand and interpret technical and non-technical information"}, {"po": "PO10", "comp_id": "10.1", "comp_text": "Demonstrate an ability to comprehend technical literature and document project work", "indicator": "Produce clear, well-constructed, and well-supported written engineering documents"}, {"po": "PO10", "comp_id": "10.1", "comp_text": "Demonstrate an ability to comprehend technical literature and document project work", "indicator": "Create flow in a document or presentation- a logical progression of ideas so that the main point is clear"}, {"po": "PO10", "comp_id": "10.2", "comp_text": "Demonstrate competance in listening, speaking, and presentation", "indicator": "Listen to and comprehend information, instructions, and viewpoints of others"}, {"po": "PO10", "comp_id": "10.2", "comp_text": "Demonstrate competance in listening, speaking, and presentation", "indicator": "Deliver effective oral presentations to technical and nontechnical audiences"}, {"po": "PO11", "comp_id": "11.1", "comp_text": "Demonstrate an ability to evaluate the economics and financial performance of an engineering activity", "indicator": "Describe various economic and financial costs/benefits of an engineering activity"}, {"po": "PO11", "comp_id": "11.1", "comp_text": "Demonstrate an ability to evaluate the economics and financial performance of an engineering activity", "indicator": "Analyze different forms of financial statements to evaluate the financial status of an engineering project"}, {"po": "PO11", "comp_id": "11.2", "comp_text": "Demonstrate an ability to compare and contrast the costs/benefits of alternate proposals for an engineering activity", "indicator": "Analyze and select the most appropriate proposal based on economic and financial considerations"}, {"po": "PO11", "comp_id": "11.3", "comp_text": "Demonstrate an ability to plan/manage an engineering activity within time and budget constraints", "indicator": "Identify the tasks required to complete an engineering activity and the resources required to complete the tasks"}, {"po": "PO11", "comp_id": "11.3", "comp_text": "Demonstrate an ability to plan/manage an engineering activity within time and budget constraints", "indicator": "Use project management tools to schedule an engineering project so it is completed on time and on budget"}, {"po": "PO12", "comp_id": "12.1", "comp_text": "Demonstrate an ability to identify gaps in knowledge and a strategy to close these gaps", "indicator": "Describe the rationale for requirement for continuing professional development"}, {"po": "PO12", "comp_id": "12.1", "comp_text": "Demonstrate an ability to identify gaps in knowledge and a strategy to close these gaps", "indicator": "Identify deficiencies or gaps in knowledge and demonstrate an ability to source information to close this gap"}, {"po": "PO12", "comp_id": "12.2", "comp_text": "Demonstrate an ability toidentify changing trends in engineering knowledge and practice", "indicator": "Identify historic points of technological advance in engineering that required practitioners to seek education in order to stay current"}, {"po": "PO12", "comp_id": "12.2", "comp_text": "Demonstrate an ability toidentify changing trends in engineering knowledge and practice", "indicator": "Recognize the need and be able to clearly explain why it is vitally important to keep current regarding new developments in your field."}, {"po": "PO12", "comp_id": "12.3", "comp_text": "Demonstrate an ability to identify and access sources for new information", "indicator": "Source and comprehend technical literature and other credible sources of information"}, {"po": "PO12", "comp_id": "12.3", "comp_text": "Demonstrate an ability to identify and access sources for new information", "indicator": "Analyze sourced technical and popular information for feasibility, viability, sustainability etc."}, {"po": "PO12", "comp_id": "13.1", "comp_text": "Identify the root causes of a given real-world problem.", "indicator": "Describe the significance of understanding the problem specification to interpret it accurately."}, {"po": "PO12", "comp_id": "13.1", "comp_text": "Identify the root causes of a given real-world problem.", "indicator": "Plan a structured process for building the logic."}, {"po": "PO12", "comp_id": "13.2", "comp_text": "Design efficient system for addressing feasible solutions", "indicator": "Describe the main components of the problem statement and identify some key outcomes."}, {"po": "PO12", "comp_id": "13.2", "comp_text": "Design efficient system for addressing feasible solutions", "indicator": "Identify key issues and outcomes hierarchy."}, {"po": "PO12", "comp_id": "13.3", "comp_text": "Demonstrate the ability to address practical challenges within a given problem statement.", "indicator": "Identify practical challenges within the problem statement."}, {"po": "PO12", "comp_id": "13.3", "comp_text": "Demonstrate the ability to address practical challenges within a given problem statement.", "indicator": "Analyze practical challenges in-depth and propose potential solutions within the problem statement."}, {"po": "PO12", "comp_id": "14.1", "comp_text": "Demonstrate the ability to analyze complex problems and identify key requirements.", "indicator": "Decompose the complex problems into smaller, manageble components."}, {"po": "PO12", "comp_id": "14.1", "comp_text": "Demonstrate the ability to analyze complex problems and identify key requirements.", "indicator": "Generate requirement documents using appropriate tools."}, {"po": "PO12", "comp_id": "14.2", "comp_text": "Demonstrate the ability to develop a structured, domain-specific problem-solving approach.", "indicator": "Choose problem-solving methods and tools tailored to the specific domain and problem characteristics."}, {"po": "PO12", "comp_id": "14.2", "comp_text": "Demonstrate the ability to develop a structured, domain-specific problem-solving approach.", "indicator": "Select appropriate algorithms, design patterns, modeling languages, and simulations for effective problem-solving."}, {"po": "PO12", "comp_id": "15.1", "comp_text": "Demonstrate proficiency in evolving technologies, applying skills to solve real-world problems.", "indicator": "Recognize their own multiple identities, experiences, and biases, and understand how these affect their ability to lead."}, {"po": "PO12", "comp_id": "15.1", "comp_text": "Demonstrate proficiency in evolving technologies, applying skills to solve real-world problems.", "indicator": "Apply acquired knowledge and skills in diverse domains through practical projects and real-world scenarios."}, {"po": "PO12", "comp_id": "15.2", "comp_text": "Demonstrate professional growth through learning, ethics, cultural awareness, and effective communication.", "indicator": "Able to exhibit ethical decision-making in engineering, adhering to professional codes and standards."}, {"po": "PO12", "comp_id": "15.2", "comp_text": "Demonstrate professional growth through learning, ethics, cultural awareness, and effective communication.", "indicator": "Presents technical information with human conduct, ethics,confidence, and persuasiveness in various formats, such as meetings, seminars, or conferences, showcasing expertise and professionalism."}];

const DB = (() => {

  /* ── Keys ── */
  const KEYS = {
    departments : 'obe_departments',
    users       : 'obe_users',
    courses     : 'obe_courses',
    cos         : 'obe_cos',
    poMapping   : 'obe_po_mapping',
    students    : 'obe_students',
    marksIA     : 'obe_marks_ia',
    marksMSE    : 'obe_marks_mse',
    marksESE    : 'obe_marks_ese',
    marksAssign : 'obe_marks_assign',
    survey      : 'obe_survey',
    indicatorMapping: 'obe_indicator_mapping',
    assignments : 'obe_assignments',
    submissions : 'obe_submissions',
    config      : 'obe_config',
    remedial    : 'obe_remedial',
    gaps        : 'obe_gaps',
    courseAudit : 'obe_course_audit',
    syllabus    : 'obe_syllabus',
    initialized : 'obe_initialized_v2',
  };

  /* ── Generic CRUD ── */
  function get(key)       { try { return JSON.parse(localStorage.getItem(key)) || []; } catch(e){ return []; } }
  function getObj(key)    { try { return JSON.parse(localStorage.getItem(key)) || {}; } catch(e){ return {}; } }
  function set(key, val)  { localStorage.setItem(key, JSON.stringify(val)); }
  function uid()          { return Date.now().toString(36) + Math.random().toString(36).slice(2); }

  /* ── Demo Data ── */
  const DEMO = {
    departments: [
      { id:'dept-ds',  name:'Data Science',           code:'DS',  hod:'Dr. A. Mehta', vision: 'To be a center of excellence in Data Science.', mission: 'To foster innovation and problem-solving through data-centric approaches.' },
      { id:'dept-cs',  name:'Computer Engineering',   code:'CS',  hod:'Dr. V. C. Wangikar', vision: 'To create globally competent computer professionals.', mission: 'To empower students with robust computational skills and ethical practices.' },
      { id:'dept-ai',  name:'AI & Machine Learning',  code:'AI',  hod:'Dr. R. Sharma', vision: 'To lead the future of artificial intelligence research.', mission: 'Pioneering intelligent solutions for future challenges.' },
      { id:'dept-it',  name:'Information Technology', code:'IT',  hod:'Dr. P. Kulkarni', vision: 'To innovate in IT solutions and services.', mission: 'Bridging the gap between technology and business needs.' },
    ],

    users: [
      // Admin
      { id:'usr-admin', name:'System Administrator', email:'admin@mitaoe.ac.in',    password:'admin123',   role:'admin',   deptId:null,      avatar:'A' },
      // Faculty
      { id:'usr-vw',    name:'Vaishali Wangikar',     email:'vwangikar@mitaoe.ac.in',password:'faculty123', role:'faculty', deptId:'dept-cs', avatar:'V' },
      { id:'usr-am',    name:'Prof. A. Mehta',         email:'ametha@mitaoe.ac.in',   password:'faculty123', role:'faculty', deptId:'dept-ds', avatar:'A' },
      { id:'usr-rs',    name:'Prof. R. Sharma',        email:'rsharma@mitaoe.ac.in',  password:'faculty123', role:'faculty', deptId:'dept-ai', avatar:'R' },
      // HOD
      { id:'usr-hod1',  name:'Dr. V. C. Wangikar',    email:'hod.cs@mitaoe.ac.in',   password:'hod123',     role:'hod',     deptId:'dept-cs', avatar:'H' },
      { id:'usr-hod2',  name:'Dr. A. Mehta (HOD)',    email:'hod.ds@mitaoe.ac.in',   password:'hod123',     role:'hod',     deptId:'dept-ds', avatar:'H' },
      // Students
      { id:'stu-001', name:'Rakshe Veer Tushar',       email:'student@mitaoe.ac.in',  password:'student123', role:'student', deptId:'dept-cs' },
      { id:'stu-002', name:'Narote Sanket Satish',     email:'narote@student.mitaoe.ac.in',  password:'student123', role:'student', deptId:'dept-cs' },
      { id:'stu-003', name:'Bolaj Samarth Hanmant',    email:'bolaj@student.mitaoe.ac.in',   password:'student123', role:'student', deptId:'dept-cs' },
      { id:'stu-004', name:'Om Sutar',                 email:'om.sutar@mitaoe.ac.in',        password:'student123', role:'student', deptId:'dept-cs' },
    ],

    courses: [
      {
        id:'crs-eda', code:'230331T', name:'Exploratory Data Analysis', shortName:'EDA',
        deptId:'dept-cs', facultyId:'usr-vw', semester:'V', year:'2025-26',
        class:'TY BTech', division:'A', batch:'A1, A2',
        champion:'Dr. V. C. Wangikar', champDate:'2025-07-21',
        lecturesPerWeek:3, totalStudents:41,
        examScheme:{ ia:30, mse:20, ese:50 },
        attainmentLevels:{ 1:65, 2:75, 3:85 },
        directWeight:80, indirectWeight:20,
        teachingPhilosophy:'Foster Curiosity and Inquiry, Emphasize the Iterative Nature of EDA, Develop Critical Thinking Skills, Balance Theory with Practice, Promote Data Storytelling.',
        status:'active'
      },
      {
        id:'crs-ml',  code:'230332T', name:'Machine Learning',          shortName:'ML',
        deptId:'dept-cs', facultyId:'usr-vw', semester:'V', year:'2025-26',
        class:'TY BTech', division:'A', batch:'A1',
        champion:'Dr. V. C. Wangikar', champDate:'2025-07-21',
        lecturesPerWeek:3, totalStudents:41,
        examScheme:{ ia:30, mse:20, ese:50 },
        attainmentLevels:{ 1:65, 2:75, 3:85 },
        directWeight:80, indirectWeight:20,
        teachingPhilosophy:'Blend theory with hands-on ML implementation.',
        status:'active'
      },
      {
        id:'crs-dw',  code:'230333T', name:'Data Warehousing & Mining', shortName:'DWM',
        deptId:'dept-ds', facultyId:'usr-am',  semester:'V', year:'2025-26',
        class:'TY BTech', division:'A', batch:'A1',
        champion:'Dr. A. Mehta', champDate:'2025-07-21',
        lecturesPerWeek:3, totalStudents:38,
        examScheme:{ ia:30, mse:20, ese:50 },
        attainmentLevels:{ 1:65, 2:75, 3:85 },
        directWeight:80, indirectWeight:20,
        teachingPhilosophy:'Practical data engineering skills.',
        status:'active'
      },
    ],

    // Course Outcomes for EDA
    cos: [
      { id:'co-1', courseId:'crs-eda', no:1, code:'CO1', text:'Select the efficient data warehouse architecture for the given case study.', bloomsLevel:'L3', assessedThrough:['ia','mse','ese'] },
      { id:'co-2', courseId:'crs-eda', no:2, code:'CO2', text:'Develop a data mart using different modeling techniques for given applications and present it in a group.', bloomsLevel:'L3', assessedThrough:['ia','ese'] },
      { id:'co-3', courseId:'crs-eda', no:3, code:'CO3', text:'Analyze the prediction by hypothesis testing using data analysis tools.', bloomsLevel:'L4', assessedThrough:['ia','mse','ese'] },
      { id:'co-4', courseId:'crs-eda', no:4, code:'CO4', text:'Construct a model for providing predictions on given datasets by identifying trends and detecting outliers on real-time application using available tools and technology.', bloomsLevel:'L4', assessedThrough:['ia','mse','ese'] },
      { id:'co-5', courseId:'crs-eda', no:5, code:'CO5', text:'', bloomsLevel:'', assessedThrough:[] },
      { id:'co-6', courseId:'crs-eda', no:6, code:'CO6', text:'', bloomsLevel:'', assessedThrough:[] },
      // ML COs
      { id:'co-ml-1', courseId:'crs-ml', no:1, code:'CO1', text:'Apply supervised learning algorithms to solve classification and regression problems.', bloomsLevel:'L3', assessedThrough:['ia','mse','ese'] },
      { id:'co-ml-2', courseId:'crs-ml', no:2, code:'CO2', text:'Implement unsupervised learning techniques for clustering and dimensionality reduction.', bloomsLevel:'L3', assessedThrough:['ia','ese'] },
      { id:'co-ml-3', courseId:'crs-ml', no:3, code:'CO3', text:'Evaluate model performance using appropriate metrics and cross-validation.', bloomsLevel:'L4', assessedThrough:['ia','mse','ese'] },
      { id:'co-ml-4', courseId:'crs-ml', no:4, code:'CO4', text:'Design and implement neural network architectures for real-world applications.', bloomsLevel:'L5', assessedThrough:['ia','ese'] },
    ],

    // CO-PO Mapping for EDA (from Sheet 6C)
    poMapping: [
      // CO1: PO1=2, PO2=3, PO3=3, PO4=1, PO5=1, PO11=1, PSO1=2, PSO3=1
      { courseId:'crs-eda', coNo:1, po:'PO1', val:2 }, { courseId:'crs-eda', coNo:1, po:'PO2', val:3 },
      { courseId:'crs-eda', coNo:1, po:'PO3', val:3 }, { courseId:'crs-eda', coNo:1, po:'PO4', val:1 },
      { courseId:'crs-eda', coNo:1, po:'PO5', val:1 }, { courseId:'crs-eda', coNo:1, po:'PO11',val:1 },
      { courseId:'crs-eda', coNo:1, po:'PSO1',val:2 }, { courseId:'crs-eda', coNo:1, po:'PSO3',val:1 },
      // CO2: PO1=2, PO2=3, PO3=3, PO4=1, PO5=3, PO11=1, PSO1=3, PSO2=1, PSO3=2
      { courseId:'crs-eda', coNo:2, po:'PO1', val:2 }, { courseId:'crs-eda', coNo:2, po:'PO2', val:3 },
      { courseId:'crs-eda', coNo:2, po:'PO3', val:3 }, { courseId:'crs-eda', coNo:2, po:'PO4', val:1 },
      { courseId:'crs-eda', coNo:2, po:'PO5', val:3 }, { courseId:'crs-eda', coNo:2, po:'PO11',val:1 },
      { courseId:'crs-eda', coNo:2, po:'PSO1',val:3 }, { courseId:'crs-eda', coNo:2, po:'PSO2',val:1 },
      { courseId:'crs-eda', coNo:2, po:'PSO3',val:2 },
      // CO3: PO1=3, PO2=3, PO3=3, PO4=2, PO5=3, PO7=1, PO11=1, PSO1=3, PSO2=3, PSO3=3
      { courseId:'crs-eda', coNo:3, po:'PO1', val:3 }, { courseId:'crs-eda', coNo:3, po:'PO2', val:3 },
      { courseId:'crs-eda', coNo:3, po:'PO3', val:3 }, { courseId:'crs-eda', coNo:3, po:'PO4', val:2 },
      { courseId:'crs-eda', coNo:3, po:'PO5', val:3 }, { courseId:'crs-eda', coNo:3, po:'PO7', val:1 },
      { courseId:'crs-eda', coNo:3, po:'PO11',val:1 }, { courseId:'crs-eda', coNo:3, po:'PSO1',val:3 },
      { courseId:'crs-eda', coNo:3, po:'PSO2',val:3 }, { courseId:'crs-eda', coNo:3, po:'PSO3',val:3 },
      // CO4: same as CO3
      { courseId:'crs-eda', coNo:4, po:'PO1', val:3 }, { courseId:'crs-eda', coNo:4, po:'PO2', val:3 },
      { courseId:'crs-eda', coNo:4, po:'PO3', val:3 }, { courseId:'crs-eda', coNo:4, po:'PO4', val:2 },
      { courseId:'crs-eda', coNo:4, po:'PO5', val:3 }, { courseId:'crs-eda', coNo:4, po:'PO7', val:1 },
      { courseId:'crs-eda', coNo:4, po:'PO11',val:1 }, { courseId:'crs-eda', coNo:4, po:'PSO1',val:3 },
      { courseId:'crs-eda', coNo:4, po:'PSO2',val:3 }, { courseId:'crs-eda', coNo:4, po:'PSO3',val:3 },
    ],

    // Students for EDA (real names from Excel)
    students: [
      { id:'s01', courseId:'crs-eda', prn:'202201040001', name:'Rakshe Veer Tushar',       preSurveyScore:3,  learnerType:'slow' },
      { id:'s02', courseId:'crs-eda', prn:'202201040003', name:'Narote Sanket Satish',     preSurveyScore:8,  learnerType:'advanced' },
      { id:'s03', courseId:'crs-eda', prn:'202201040004', name:'Bolaj Samarth Hanmant',    preSurveyScore:7,  learnerType:'advanced' },
      { id:'s04', courseId:'crs-eda', prn:'202201040005', name:'Sarode Lokesh Vasudev',    preSurveyScore:6,  learnerType:'average' },
      { id:'s05', courseId:'crs-eda', prn:'202201040006', name:'Thorat Harshada Subhash',  preSurveyScore:7,  learnerType:'advanced' },
      { id:'s06', courseId:'crs-eda', prn:'202201040007', name:'Kulkarni Parth Dipak',     preSurveyScore:5,  learnerType:'average' },
      { id:'s07', courseId:'crs-eda', prn:'202201040008', name:'Pawar Aniket Suraj',       preSurveyScore:6,  learnerType:'average' },
      { id:'s08', courseId:'crs-eda', prn:'202201040009', name:'Maske Prashik Ghansham',   preSurveyScore:4,  learnerType:'average' },
      { id:'s09', courseId:'crs-eda', prn:'202201040010', name:'Om Sutar',                 preSurveyScore:8,  learnerType:'advanced' },
      { id:'s10', courseId:'crs-eda', prn:'202201040011', name:'Vemula Ramani Bhumaiah',   preSurveyScore:7,  learnerType:'advanced' },
      { id:'s11', courseId:'crs-eda', prn:'202201040012', name:'Gite Abhijeet Shantilal',  preSurveyScore:5,  learnerType:'average' },
      { id:'s12', courseId:'crs-eda', prn:'202201040013', name:'Dasari Essak Mahesh',      preSurveyScore:6,  learnerType:'average' },
      { id:'s13', courseId:'crs-eda', prn:'202201040014', name:'Raut Krishna Bhimrao',     preSurveyScore:3,  learnerType:'slow' },
      { id:'s14', courseId:'crs-eda', prn:'202201040015', name:'Shinde Vaibhav Ajay',      preSurveyScore:7,  learnerType:'advanced' },
      { id:'s15', courseId:'crs-eda', prn:'202201040016', name:'Ghodake Vipul Vijaykumar', preSurveyScore:5,  learnerType:'average' },
      { id:'s16', courseId:'crs-eda', prn:'202201040017', name:'Pendam Tejas Pradip',      preSurveyScore:8,  learnerType:'advanced' },
      { id:'s17', courseId:'crs-eda', prn:'202201040019', name:'Bingi Vidya Balganesh',    preSurveyScore:6,  learnerType:'average' },
      { id:'s18', courseId:'crs-eda', prn:'202201040020', name:'Divekar Swarup Arjun',     preSurveyScore:4,  learnerType:'average' },
      { id:'s19', courseId:'crs-eda', prn:'202201040021', name:'Amrik Bhadra',             preSurveyScore:7,  learnerType:'advanced' },
      { id:'s20', courseId:'crs-eda', prn:'202201040022', name:'Chavan Snehal Suraj',      preSurveyScore:5,  learnerType:'average' },
      { id:'s21', courseId:'crs-eda', prn:'202201040023', name:'Pande Aniruddha Pradip',   preSurveyScore:6,  learnerType:'average' },
      { id:'s22', courseId:'crs-eda', prn:'202201040024', name:'Popalghat Amol Santosh',   preSurveyScore:7,  learnerType:'advanced' },
      { id:'s23', courseId:'crs-eda', prn:'202201040025', name:'Lohkare Girish Gokul',     preSurveyScore:4,  learnerType:'average' },
      { id:'s24', courseId:'crs-eda', prn:'202201040026', name:'Darade Tejashri Krushna',  preSurveyScore:8,  learnerType:'advanced' },
      { id:'s25', courseId:'crs-eda', prn:'202201040027', name:'Jadhav Vaibhav Satish',    preSurveyScore:5,  learnerType:'average' },
      { id:'s26', courseId:'crs-eda', prn:'202201040029', name:'Sumit Kedar',              preSurveyScore:3,  learnerType:'slow' },
    ],

    // IA Question structure for EDA
    iaQuestions: [
      { courseId:'crs-eda', assessmentType:'ia', assessmentNo:1,
        questions:[
          { qNo:1, desc:'For CARGO shipper application, identify and justify appropriate Data Warehouse architecture.', bloomsLevel:'L5', coNo:1, maxMarks:3 },
          { qNo:2, desc:'For CARGO shipper application, apply dimensional modelling. Identify dimensions, measures, and draw the model.', bloomsLevel:'L5', coNo:2, maxMarks:3 },
        ]
      },
      { courseId:'crs-eda', assessmentType:'mse', assessmentNo:1,
        questions:[
          { qNo:1, desc:'Explain OLAP operations with suitable examples.', bloomsLevel:'L3', coNo:1, maxMarks:6 },
          { qNo:2, desc:'Apply hypothesis testing on given dataset to derive conclusions.', bloomsLevel:'L4', coNo:3, maxMarks:7 },
          { qNo:3, desc:'Describe types of data preprocessing techniques.', bloomsLevel:'L2', coNo:3, maxMarks:7 },
        ]
      },
    ],

    // Sample IA marks (per student per question)
    marksIA: [
      // Assessment 1, Q1 (CO1, max 3), Q2 (CO2, max 3)
      {courseId:'crs-eda',prn:'202201040001',assessmentNo:1,qNo:1,marks:1},{courseId:'crs-eda',prn:'202201040001',assessmentNo:1,qNo:2,marks:2},
      {courseId:'crs-eda',prn:'202201040003',assessmentNo:1,qNo:1,marks:3},{courseId:'crs-eda',prn:'202201040003',assessmentNo:1,qNo:2,marks:3},
      {courseId:'crs-eda',prn:'202201040004',assessmentNo:1,qNo:1,marks:3},{courseId:'crs-eda',prn:'202201040004',assessmentNo:1,qNo:2,marks:2},
      {courseId:'crs-eda',prn:'202201040005',assessmentNo:1,qNo:1,marks:2},{courseId:'crs-eda',prn:'202201040005',assessmentNo:1,qNo:2,marks:3},
      {courseId:'crs-eda',prn:'202201040006',assessmentNo:1,qNo:1,marks:2},{courseId:'crs-eda',prn:'202201040006',assessmentNo:1,qNo:2,marks:2},
      {courseId:'crs-eda',prn:'202201040007',assessmentNo:1,qNo:1,marks:3},{courseId:'crs-eda',prn:'202201040007',assessmentNo:1,qNo:2,marks:3},
      {courseId:'crs-eda',prn:'202201040008',assessmentNo:1,qNo:1,marks:2},{courseId:'crs-eda',prn:'202201040008',assessmentNo:1,qNo:2,marks:2},
      {courseId:'crs-eda',prn:'202201040009',assessmentNo:1,qNo:1,marks:3},{courseId:'crs-eda',prn:'202201040009',assessmentNo:1,qNo:2,marks:3},
      {courseId:'crs-eda',prn:'202201040010',assessmentNo:1,qNo:1,marks:3},{courseId:'crs-eda',prn:'202201040010',assessmentNo:1,qNo:2,marks:3},
      {courseId:'crs-eda',prn:'202201040011',assessmentNo:1,qNo:1,marks:2},{courseId:'crs-eda',prn:'202201040011',assessmentNo:1,qNo:2,marks:2},
      {courseId:'crs-eda',prn:'202201040012',assessmentNo:1,qNo:1,marks:2},{courseId:'crs-eda',prn:'202201040012',assessmentNo:1,qNo:2,marks:3},
      {courseId:'crs-eda',prn:'202201040013',assessmentNo:1,qNo:1,marks:1},{courseId:'crs-eda',prn:'202201040013',assessmentNo:1,qNo:2,marks:1},
      {courseId:'crs-eda',prn:'202201040014',assessmentNo:1,qNo:1,marks:3},{courseId:'crs-eda',prn:'202201040014',assessmentNo:1,qNo:2,marks:3},
      {courseId:'crs-eda',prn:'202201040015',assessmentNo:1,qNo:1,marks:2},{courseId:'crs-eda',prn:'202201040015',assessmentNo:1,qNo:2,marks:2},
      {courseId:'crs-eda',prn:'202201040016',assessmentNo:1,qNo:1,marks:3},{courseId:'crs-eda',prn:'202201040016',assessmentNo:1,qNo:2,marks:3},
      {courseId:'crs-eda',prn:'202201040019',assessmentNo:1,qNo:1,marks:2},{courseId:'crs-eda',prn:'202201040019',assessmentNo:1,qNo:2,marks:2},
      {courseId:'crs-eda',prn:'202201040020',assessmentNo:1,qNo:1,marks:2},{courseId:'crs-eda',prn:'202201040020',assessmentNo:1,qNo:2,marks:3},
      {courseId:'crs-eda',prn:'202201040021',assessmentNo:1,qNo:1,marks:3},{courseId:'crs-eda',prn:'202201040021',assessmentNo:1,qNo:2,marks:3},
      {courseId:'crs-eda',prn:'202201040022',assessmentNo:1,qNo:1,marks:2},{courseId:'crs-eda',prn:'202201040022',assessmentNo:1,qNo:2,marks:2},
      {courseId:'crs-eda',prn:'202201040023',assessmentNo:1,qNo:1,marks:3},{courseId:'crs-eda',prn:'202201040023',assessmentNo:1,qNo:2,marks:3},
      {courseId:'crs-eda',prn:'202201040024',assessmentNo:1,qNo:1,marks:3},{courseId:'crs-eda',prn:'202201040024',assessmentNo:1,qNo:2,marks:2},
      {courseId:'crs-eda',prn:'202201040025',assessmentNo:1,qNo:1,marks:2},{courseId:'crs-eda',prn:'202201040025',assessmentNo:1,qNo:2,marks:2},
      {courseId:'crs-eda',prn:'202201040026',assessmentNo:1,qNo:1,marks:3},{courseId:'crs-eda',prn:'202201040026',assessmentNo:1,qNo:2,marks:3},
      {courseId:'crs-eda',prn:'202201040027',assessmentNo:1,qNo:1,marks:2},{courseId:'crs-eda',prn:'202201040027',assessmentNo:1,qNo:2,marks:3},
      {courseId:'crs-eda',prn:'202201040029',assessmentNo:1,qNo:1,marks:1},{courseId:'crs-eda',prn:'202201040029',assessmentNo:1,qNo:2,marks:1},
    ],

    // Exit survey data (from Sheet 14H, 5-point scale per CO)
    survey: [
      {courseId:'crs-eda',prn:'202201040001',co:1,score:1},{courseId:'crs-eda',prn:'202201040001',co:2,score:1},{courseId:'crs-eda',prn:'202201040001',co:3,score:1},{courseId:'crs-eda',prn:'202201040001',co:4,score:1},
      {courseId:'crs-eda',prn:'202201040003',co:1,score:4},{courseId:'crs-eda',prn:'202201040003',co:2,score:4},{courseId:'crs-eda',prn:'202201040003',co:3,score:4},{courseId:'crs-eda',prn:'202201040003',co:4,score:4},
      {courseId:'crs-eda',prn:'202201040004',co:1,score:4},{courseId:'crs-eda',prn:'202201040004',co:2,score:4},{courseId:'crs-eda',prn:'202201040004',co:3,score:4},{courseId:'crs-eda',prn:'202201040004',co:4,score:4},
      {courseId:'crs-eda',prn:'202201040005',co:1,score:4},{courseId:'crs-eda',prn:'202201040005',co:2,score:4},{courseId:'crs-eda',prn:'202201040005',co:3,score:4},{courseId:'crs-eda',prn:'202201040005',co:4,score:4},
      {courseId:'crs-eda',prn:'202201040006',co:1,score:4},{courseId:'crs-eda',prn:'202201040006',co:2,score:4},{courseId:'crs-eda',prn:'202201040006',co:3,score:4},{courseId:'crs-eda',prn:'202201040006',co:4,score:4},
      {courseId:'crs-eda',prn:'202201040007',co:1,score:4},{courseId:'crs-eda',prn:'202201040007',co:2,score:4},{courseId:'crs-eda',prn:'202201040007',co:3,score:4},{courseId:'crs-eda',prn:'202201040007',co:4,score:4},
      {courseId:'crs-eda',prn:'202201040008',co:1,score:4},{courseId:'crs-eda',prn:'202201040008',co:2,score:4},{courseId:'crs-eda',prn:'202201040008',co:3,score:4},{courseId:'crs-eda',prn:'202201040008',co:4,score:4},
      {courseId:'crs-eda',prn:'202201040009',co:1,score:4},{courseId:'crs-eda',prn:'202201040009',co:2,score:4},{courseId:'crs-eda',prn:'202201040009',co:3,score:4},{courseId:'crs-eda',prn:'202201040009',co:4,score:4},
      {courseId:'crs-eda',prn:'202201040010',co:1,score:4},{courseId:'crs-eda',prn:'202201040010',co:2,score:4},{courseId:'crs-eda',prn:'202201040010',co:3,score:4},{courseId:'crs-eda',prn:'202201040010',co:4,score:4},
      {courseId:'crs-eda',prn:'202201040011',co:1,score:4},{courseId:'crs-eda',prn:'202201040011',co:2,score:4},{courseId:'crs-eda',prn:'202201040011',co:3,score:4},{courseId:'crs-eda',prn:'202201040011',co:4,score:4},
    ],

    // Assignments
    assignments: [
      {
        id:'asgn-1', courseId:'crs-eda', no:1,
        title:'Data Warehouse Architecture & Dimensional Modelling',
        description:'Apply Data Warehouse Approach and Dimensional Modelling on a given case study.',
        rbtLevel:3, coNos:[1,2], poNos:['PO1','PO2','PO3','PO4','PO5'],
        maxMarks:10, dueDate:'2025-08-30', aiGenerated:false,
        questions:[
          { qNo:1, text:'For CARGO shipper application, which Data Warehouse will be applicable? Justify your answer w.r.t. Principle, Architecture, Advantage, Disadvantage, Application [5 Marks]', coNo:1, marks:5 },
          { qNo:2, text:'For CARGO shipper application, apply dimensional modelling: i) Identify 4 dimensions [1M] ii) Identify 2 Measures [1M] iii) Select type with justification [1M] iv) Draw the model [2M]', coNo:2, marks:5 },
        ],
        rubrics:[
          { criterion:'Implementation Accuracy', coNo:1, exceptional:'Correctly identifies and justifies all architecture components (5pts)', best:'Minor errors in justification (4pts)', average:'Partial justification (2pts)', low:'Incorrect or missing (1pt)' },
          { criterion:'Dimensional Model Completeness', coNo:2, exceptional:'All 4 dimensions, 2 measures, correct model drawn (5pts)', best:'3 dimensions, minor errors (4pts)', average:'2 dimensions identified (2pts)', low:'Incomplete (<2 dimensions) (1pt)' },
        ],
        createdAt: '2025-08-01'
      },
      {
        id:'asgn-2', courseId:'crs-eda', no:2,
        title:'Hypothesis Testing & Regression Methods',
        description:'Demonstrate Hypothesis Test and Regression methods after applying on a real life example.',
        rbtLevel:3, coNos:[3,4], poNos:['PO1','PO2','PO3','PO4','PO5'],
        maxMarks:10, dueDate:'2025-09-30', aiGenerated:true,
        questions:[
          { qNo:1, text:'Apply t-test to determine if there is a significant difference between two sample means. Use a real-world dataset. [5 Marks]', coNo:3, marks:5 },
          { qNo:2, text:'Build a linear regression model to predict housing prices. Report R², MSE, and interpret coefficients. [5 Marks]', coNo:4, marks:5 },
        ],
        rubrics:[
          { criterion:'Hypothesis Test Accuracy', coNo:3, exceptional:'Correct test selection, computation, and interpretation (5pts)', best:'Correct test, minor computation error (4pts)', average:'Test selected correctly, wrong conclusion (2pts)', low:'Wrong test applied (1pt)' },
          { criterion:'Regression Model Quality', coNo:4, exceptional:'Correct model, high R², proper interpretation (5pts)', best:'Correct model, minor interpretation error (4pts)', average:'Model built, interpretation incomplete (2pts)', low:'Model incorrect (1pt)' },
        ],
        createdAt: '2025-09-01'
      },
    ],

    config: {
      aiEnabled: false,   // will be true in Phase 2
      aiModel: 'claude-3-5-sonnet',
      aiApiKey: '',
      s3Bucket: '',
      maxAICalls: 50,
      aiCallsUsed: 3,
      attainmentDefaultLevels: { 1:65, 2:75, 3:85 },
      directWeight: 80,
      indirectWeight: 20,
      collegeFullName: 'MIT Academy of Engineering, Alandi (D), Pune – 412105',
      collegeName: 'MITAOE',
      academicYear: '2025-26',
      instituteVision: 'To develop holistic leaders who will shape the future.',
      instituteMission: 'To leave no stone unturned in our endeavor to ensure that every alumnus looks back at us and says MITAOE has not merely taught me, it has educated me.',
    }
  };

  /* ── Initialize DB with demo data ── */
  function init() {
    if (localStorage.getItem(KEYS.initialized)) return;
    set(KEYS.departments, DEMO.departments);
    set(KEYS.users,       DEMO.users);
    set(KEYS.courses,     DEMO.courses);
    set(KEYS.cos,         DEMO.cos);
    set(KEYS.poMapping,   DEMO.poMapping);
    set(KEYS.students,    DEMO.students);
    set(KEYS.marksIA,     DEMO.marksIA);
    set(KEYS.marksMSE,    []);
    set(KEYS.marksESE,    []);
    set(KEYS.marksAssign, []);
    set(KEYS.survey,      DEMO.survey);
    set(KEYS.assignments, DEMO.assignments);
    set(KEYS.submissions, []);
    set(KEYS.config,      DEMO.config);
    set(KEYS.syllabus,    []);
    // Store IA question structures in config
    const cfg = getObj(KEYS.config);
    cfg.iaQuestions = DEMO.iaQuestions;
    set(KEYS.config, cfg);
    localStorage.setItem(KEYS.initialized, '1');
  }

  /* ── Departments ── */
  const departments = {
    all()       { return get(KEYS.departments); },
    byId(id)    { return departments.all().find(d=>d.id===id); },
    add(d)      { const all=departments.all(); d.id=uid(); all.push(d); set(KEYS.departments,all); return d; },
    update(d)   { const all=departments.all().map(x=>x.id===d.id?d:x); set(KEYS.departments,all); return d; },
    delete(id)  { set(KEYS.departments, departments.all().filter(d=>d.id!==id)); },
  };

  /* ── Users ── */
  const users = {
    all()              { return get(KEYS.users); },
    byId(id)           { return users.all().find(u=>u.id===id); },
    byEmail(email)     { return users.all().find(u=>u.email===email); },
    byRole(role)       { return users.all().filter(u=>u.role===role); },
    byDept(deptId)     { return users.all().filter(u=>u.deptId===deptId); },
    authenticate(email,pw){ return users.all().find(u=>u.email===email&&u.password===pw); },
    add(u)             { const all=users.all(); u.id=uid(); all.push(u); set(KEYS.users,all); return u; },
    update(u)          { const all=users.all().map(x=>x.id===u.id?u:x); set(KEYS.users,all); return u; },
    delete(id)         { set(KEYS.users, users.all().filter(u=>u.id!==id)); },
  };

  /* ── Courses ── */
  const courses = {
    all()            { return get(KEYS.courses); },
    get()            { return get(KEYS.courses); }, // alias for all()
    byId(id)         { return courses.all().find(c=>c.id===id); },
    byFaculty(fid)   { 
      const u = users.byId(fid);
      if (u && u.role === 'hod') return courses.byDept(u.deptId);
      return courses.all().filter(c=>c.facultyId===fid); 
    },
    byDept(did)      { return courses.all().filter(c=>c.deptId===did); },
    add(c)           { const all=courses.all(); c.id=uid(); all.push(c); set(KEYS.courses,all); return c; },
    update(c)        { const all=courses.all().map(x=>x.id===c.id?c:x); set(KEYS.courses,all); return c; },
    delete(id)       { set(KEYS.courses, courses.all().filter(c=>c.id!==id)); },
  };

  /* ── Course Outcomes ── */
  const cos = {
    all()              { return get(KEYS.cos); },
    byCourse(cid)      { return cos.all().filter(c=>c.courseId===cid).sort((a,b)=>a.no-b.no); },
    byId(id)           { return cos.all().find(c=>c.id===id); },
    add(c)             { const all=cos.all(); c.id=uid(); all.push(c); set(KEYS.cos,all); return c; },
    update(c)          { const all=cos.all().map(x=>x.id===c.id?c:x); set(KEYS.cos,all); return c; },
    saveAll(cid, list) { const others=cos.all().filter(c=>c.courseId!==cid); set(KEYS.cos,[...others,...list]); },
    delete(id)         { set(KEYS.cos, cos.all().filter(c=>c.id!==id)); },
  };

  /* ── PO Mapping ── */
  const poMapping = {
    byCourse(cid)      { return get(KEYS.poMapping).filter(m=>m.courseId===cid); },
    getValue(cid,coNo,po) {
      const m=get(KEYS.poMapping).find(x=>x.courseId===cid&&x.coNo===coNo&&x.po===po);
      return m ? m.val : 0;
    },
    setValue(cid,coNo,po,val) {
      let all=get(KEYS.poMapping);
      const idx=all.findIndex(x=>x.courseId===cid&&x.coNo===coNo&&x.po===po);
      if(idx>=0) all[idx].val=val; else all.push({courseId:cid,coNo,po,val});
      set(KEYS.poMapping,all);
    },
    saveMatrix(cid, matrix) {
      let all=get(KEYS.poMapping).filter(m=>m.courseId!==cid);
      all=[...all,...matrix]; set(KEYS.poMapping,all);
    },
  };

  /* ── Students ── */
  const students = {
    all()              { return get(KEYS.students); },
    byCourse(cid)      { return students.all().filter(s=>s.courseId===cid); },
    byPRN(cid,prn)     { return students.all().find(s=>s.courseId===cid&&s.prn===prn); },
    add(s)             { const all=students.all(); s.id=uid(); all.push(s); set(KEYS.students,all); return s; },
    update(s)          { const all=students.all().map(x=>x.id===s.id?s:x); set(KEYS.students,all); return s; },
    saveAll(cid,list)  { const others=students.all().filter(s=>s.courseId!==cid); set(KEYS.students,[...others,...list]); },
    delete(id)         { set(KEYS.students, students.all().filter(s=>s.id!==id)); },
  };

  /* ── Marks ── */
  const marks = {
    // IA
    getIA(cid)            { return get(KEYS.marksIA).filter(m=>m.courseId===cid); },
    getIAMark(cid,prn,aNo,qNo){ return get(KEYS.marksIA).find(m=>m.courseId===cid&&m.prn===prn&&m.assessmentNo===aNo&&m.qNo===qNo); },
    setIA(cid,prn,aNo,qNo,v)  {
      let all=get(KEYS.marksIA);
      const idx=all.findIndex(m=>m.courseId===cid&&m.prn===prn&&m.assessmentNo===aNo&&m.qNo===qNo);
      if(idx>=0)all[idx].marks=v; else all.push({courseId:cid,prn,assessmentNo:aNo,qNo,marks:v});
      set(KEYS.marksIA,all);
    },
    saveIA(cid,list)      { const others=get(KEYS.marksIA).filter(m=>m.courseId!==cid); set(KEYS.marksIA,[...others,...list]); },
    // MSE
    getMSE(cid)           { return get(KEYS.marksMSE).filter(m=>m.courseId===cid); },
    setMSE(cid,prn,qNo,v) {
      let all=get(KEYS.marksMSE);
      const idx=all.findIndex(m=>m.courseId===cid&&m.prn===prn&&m.qNo===qNo);
      if(idx>=0)all[idx].marks=v; else all.push({courseId:cid,prn,qNo,marks:v});
      set(KEYS.marksMSE,all);
    },
    saveMSE(cid,list)     { const others=get(KEYS.marksMSE).filter(m=>m.courseId!==cid); set(KEYS.marksMSE,[...others,...list]); },
    // ESE
    getESE(cid)           { return get(KEYS.marksESE).filter(m=>m.courseId===cid); },
    setESE(cid,prn,qNo,v) {
      let all=get(KEYS.marksESE);
      const idx=all.findIndex(m=>m.courseId===cid&&m.prn===prn&&m.qNo===qNo);
      if(idx>=0)all[idx].marks=v; else all.push({courseId:cid,prn,qNo,marks:v});
      set(KEYS.marksESE,all);
    },
    saveESE(cid,list)     { const others=get(KEYS.marksESE).filter(m=>m.courseId!==cid); set(KEYS.marksESE,[...others,...list]); },
    // Assignment
    getAssign(cid)           { return get(KEYS.marksAssign).filter(m=>m.courseId===cid); },
    setAssign(cid,prn,asgnId,marks){ 
      let all=get(KEYS.marksAssign);
      const idx=all.findIndex(m=>m.courseId===cid&&m.prn===prn&&m.assignmentId===asgnId);
      if(idx>=0)all[idx].marks=marks; else all.push({courseId:cid,prn,assignmentId:asgnId,marks});
      set(KEYS.marksAssign,all);
    },
  };

  /* ── Survey ── */
  const survey = {
    byCourse(cid)         { return get(KEYS.survey).filter(s=>s.courseId===cid); },
    getScore(cid,prn,co)  { const s=get(KEYS.survey).find(x=>x.courseId===cid&&x.prn===prn&&x.co===co); return s?s.score:null; },
    setScore(cid,prn,co,score) {
      let all=get(KEYS.survey);
      const idx=all.findIndex(x=>x.courseId===cid&&x.prn===prn&&x.co===co);
      if(idx>=0)all[idx].score=score; else all.push({courseId:cid,prn,co,score});
      set(KEYS.survey,all);
    },
    saveAll(cid,list)     { const others=get(KEYS.survey).filter(s=>s.courseId!==cid); set(KEYS.survey,[...others,...list]); },
  };

  /* ── Assignments ── */
  const assignments = {
    all()              { return get(KEYS.assignments); },
    byCourse(cid)      { return assignments.all().filter(a=>a.courseId===cid); },
    byId(id)           { return assignments.all().find(a=>a.id===id); },
    add(a)             { const all=assignments.all(); a.id=uid(); a.createdAt=new Date().toISOString(); all.push(a); set(KEYS.assignments,all); return a; },
    update(a)          { const all=assignments.all().map(x=>x.id===a.id?a:x); set(KEYS.assignments,all); return a; },
    delete(id)         { set(KEYS.assignments, assignments.all().filter(a=>a.id!==id)); },
  };

  /* ── Submissions ── */
  const submissions = {
    all()              { return get(KEYS.submissions); },
    byAssignment(aid)  { return submissions.all().filter(s=>s.assignmentId===aid); },
    byStudent(prn)     { return submissions.all().filter(s=>s.prn===prn); },
    add(s)             { const all=submissions.all(); s.id=uid(); s.submittedAt=new Date().toISOString(); all.push(s); set(KEYS.submissions,all); return s; },
    update(s)          { const all=submissions.all().map(x=>x.id===s.id?s:x); set(KEYS.submissions,all); return s; },
  };
  /* ── Config ── */
  const config = {
    get()           { return getObj(KEYS.config); },
    set(cfg)        { set(KEYS.config, cfg); },
    update(patch)   { const cfg={...config.get(),...patch}; set(KEYS.config,cfg); return cfg; },
    getIAQuestions(cid, type) {
      const cfg=config.get();
      return (cfg.iaQuestions||[]).filter(q=>q.courseId===cid&&q.assessmentType===type);
    },
    saveIAQuestions(cid, type, list) {
      const cfg = config.get();
      // Remove existing entries for this course+type (all assessmentNos in the list)
      const listAssessNos = list.map(l => l.assessmentNo);
      const others = (cfg.iaQuestions || []).filter(q =>
        !(q.courseId === cid && q.assessmentType === type && listAssessNos.includes(q.assessmentNo))
      );
      cfg.iaQuestions = [...others, ...list];
      set(KEYS.config, cfg);
    },
  };

  /* ── Reset (for dev) ── */
  function reset() {
    Object.values(KEYS).forEach(k=>localStorage.removeItem(k));
    init();
  }

  const indicatorMapping = {
    get: (courseId) => {
      const data = get(KEYS.indicatorMapping) || {};
      return data[courseId] || {};
    },
    save: (courseId, mappingObj) => {
      const data = get(KEYS.indicatorMapping) || {};
      data[courseId] = mappingObj;
      set(KEYS.indicatorMapping, data);
    }
  };

  const remedial = {
    all() { return get(KEYS.remedial); },
    byCourse(cid) { return remedial.all().filter(r => r.courseId === cid); },
    get(cid, prn) { return remedial.all().find(r => r.courseId === cid && r.prn === prn); },
    save(cid, prn, data) {
      let all = remedial.all();
      const idx = all.findIndex(r => r.courseId === cid && r.prn === prn);
      if (idx >= 0) {
        all[idx] = { ...all[idx], ...data };
      } else {
        all.push({ courseId: cid, prn, ...data });
      }
      set(KEYS.remedial, all);
    }
  };

  const gaps = {
    all() { return get(KEYS.gaps); },
    byDept(did) { return gaps.all().filter(g => g.deptId === did); },
    add(gapObj) { const all = gaps.all(); all.push({ id: uid(), ...gapObj }); set(KEYS.gaps, all); },
    delete(id) { set(KEYS.gaps, gaps.all().filter(g => g.id !== id)); }
  };

  const courseAudit = {
    all() { return get(KEYS.courseAudit); },
    byCourse(cid) { return courseAudit.all().find(a => a.courseId === cid); },
    save(cid, data) {
      let all = courseAudit.all();
      const idx = all.findIndex(a => a.courseId === cid);
      if (idx >= 0) all[idx] = { ...all[idx], ...data };
      else all.push({ courseId: cid, ...data });
      set(KEYS.courseAudit, all);
    }
  };

  const syllabus = {
    all() { return get(KEYS.syllabus); },
    byCourse(cid) { return syllabus.all().find(s => s.courseId === cid) || { courseId: cid, modules: [], books: [] }; },
    save(cid, data) {
      let all = syllabus.all();
      const idx = all.findIndex(s => s.courseId === cid);
      if (idx >= 0) all[idx] = { ...all[idx], ...data };
      else all.push({ courseId: cid, ...data });
      set(KEYS.syllabus, all);
    }
  };

  /* ── Public API ── */
  return { init, reset, uid, departments, users, courses, cos, poMapping, indicatorMapping, remedial, students, marks, survey, assignments, submissions, config, gaps, courseAudit, syllabus, KEYS };

})();

// Auto-initialize on load
DB.init();
