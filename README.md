# 💻 Head-2-Code – Online Coding Platform

Head-2-Code is a feature-rich online coding platform designed to help developers practice programming, participate in coding contests, and improve their problem-solving skills.

The platform combines real-time competitive programming, multi-language code execution, and AI-powered coding assistance to provide an interactive and engaging coding experience.

Built using **Node.js, Express.js, MongoDB, Socket.IO, Judge0 API, Gemini API, and Monaco Editor**, Head-2-Code focuses on performance, scalability, and real-time collaboration.

---

## 🚀 Features

### 🧑‍💻 Online Code Editor
- Integrated Monaco Editor for a powerful coding experience.
- Supports multiple programming languages.
- Provides a user-friendly environment for writing and executing code.
- Displays instant execution results and verdicts.

### ⚡ Online Judge System
- Integrated Judge0 API for code execution.
- Supports multi-language programming submissions.
- Evaluates code against predefined test cases.
- Provides instant verdicts for submitted solutions.
- Optimized test-case evaluation and submission processing.

### 🏆 Competitive Coding Contests
- Friend-based coding contests.
- Custom contest creation.
- Real-time contest participation.
- Daily programming practice problems.
- Live synchronization between contest participants.

### 🤖 AI-Powered Coding Assistant
- Integrated Gemini API for intelligent coding assistance.
- Provides real-time programming hints.
- Helps identify and debug coding errors.
- Offers automated complexity analysis.
- Assists users in understanding and improving their solutions.

### 🔄 Real-Time Communication
- Implemented Socket.IO for real-time communication.
- Enables live contest synchronization.
- Supports real-time updates between users.
- Improves the overall interactive coding experience.

### 🔐 Authentication & Security
- Implemented authentication mechanisms for secure access.
- Protected backend APIs.
- Designed a scalable backend architecture using REST APIs.
- Supports secure communication between the frontend and backend.

### ⚙️ Performance & Scalability
- Designed the backend using Node.js and Express.js.
- Optimized database queries for improved performance.
- Supported 50+ concurrent users during testing.
- Achieved sub-300ms latency for real-time interactions.
- Optimized average submission response time to below 250ms.

---

## 🏗️ System Architecture

Head-2-Code follows a client-server architecture with real-time communication and external API integrations.

```text
                  ┌────────────────────────┐
                  │        Frontend        │
                  │   Coding Platform UI   │
                  └────────────┬───────────┘
                               │
                               ▼
                  ┌────────────────────────┐
                  │       Backend          │
                  │   Node.js + Express    │
                  └────────────┬───────────┘
                               │
          ┌────────────────────┼────────────────────┐
          │                    │                    │
          ▼                    ▼                    ▼
   ┌─────────────┐    ┌──────────────┐    ┌──────────────┐
   │   MongoDB   │    │   Socket.IO  │    │  REST APIs   │
   │   Database  │    │ Real-Time    │    │              │
   └─────────────┘    │ Communication│    └──────────────┘
                      └──────────────┘
                               │
             ┌─────────────────┼─────────────────┐
             │                 │                 │
             ▼                 ▼                 ▼
      ┌─────────────┐  ┌─────────────┐  ┌─────────────┐
      │   Judge0    │  │   Gemini    │  │   Monaco    │
      │ Code Engine │  │ AI Assistant│  │   Editor    │
      └─────────────┘  └─────────────┘  └─────────────┘
🧑‍💻 Technology Stack
Frontend
HTML5
CSS3
JavaScript
Monaco Editor
Backend
Node.js
Express.js
REST APIs
Database
MongoDB
Real-Time Communication
Socket.IO
Code Execution
Judge0 API
Artificial Intelligence
Gemini API
Deployment
AWS
Development Tools
Git
GitHub
Postman
📂 Project Structure
Head-2-Code/
│
├── frontend/
│   ├── components/
│   ├── pages/
│   ├── services/
│   └── assets/
│
├── backend/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   ├── services/
│   └── server.js
│
├── README.md
└── .gitignore

The folder structure may vary depending on the actual implementation.


🔄 Application Workflow

Users register or log in to the platform.
Users access daily coding problems or participate in contests.
Users write code using the Monaco Editor.
Code submissions are sent to the backend.
The backend forwards the code to the Judge0 API.
Judge0 executes the code against the required test cases.
The platform receives the execution result and displays the verdict.
Users can use the Gemini-powered AI assistant for hints, debugging, and complexity analysis.
Socket.IO enables real-time contest updates and synchronization.


⚙️ Installation & Setup

1. Clone the Repository
git clone https://github.com/Abhishekyadav620/Head-2-Code.git
2. Navigate to the Project
cd Head-2-Code
3. Install Dependencies

Install the required dependencies for the frontend and backend.

npm install

If the project has separate frontend and backend directories:

cd frontend
npm install

cd ../backend
npm install
4. Configure Environment Variables

Create a .env file in the backend directory.

Example:

PORT=5000

MONGO_URI=your_mongodb_connection_string

JWT_SECRET=your_jwt_secret

JUDGE0_API_URL=your_judge0_api_url
JUDGE0_API_KEY=your_judge0_api_key

GEMINI_API_KEY=your_gemini_api_key

SOCKET_PORT=5001

Do not share API keys or sensitive credentials publicly.

5. Run the Application

Start the backend:

npm start

Start the frontend using the appropriate command configured in your project.

npm run dev
