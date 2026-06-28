# AI OBE System

This is the LangChain and Python Agentic AI powered Outcome-Based Education (OBE) System.

## How to Start the Project

You need to start two things: the **Python Backend** and the **HTML Frontend**.

### Step 1: Start the Python AI Backend
1. Open a terminal (Command Prompt or PowerShell).
2. Navigate to the backend folder:
   ```cmd
   cd C:\Users\LOQ\OneDrive\Desktop\AI_OBE_System\backend
   ```
3. Activate the virtual environment:
   ```cmd
   .\venv\Scripts\activate
   ```
4. Start the FastAPI server:
   ```cmd
   uvicorn main:app --reload
   ```
   *(Keep this terminal window open in the background!)*

### Step 2: Open the Frontend
1. Open your File Explorer.
2. Navigate to `C:\Users\LOQ\OneDrive\Desktop\AI_OBE_System\frontend`.
3. Double-click on **`login.html`** to open it in your web browser (Chrome/Edge).
4. On the login page, you can use the "Quick Login Demo" buttons (e.g., click "Fill" under Faculty) and click **Sign In**.

### Step 3: Test the AI Features
* Go to **Syllabus Setup** and try "Auto-Fill from PDF".
* Go to **CO & PO Setup** and try "Check Bloom's with AI" or "Auto-Map to POs".
* Go to **Assignments & AI** and generate questions!

*(Note: Ensure you are connected to the internet so the backend can reach the Google Gemini API).*
