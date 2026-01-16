# 🏥 HCP Interaction CRM with AI Agent

> An intelligent CRM system for healthcare professionals powered by LangGraph AI agents

[![Python](https://img.shields.io/badge/Python-3.11+-blue.svg)](https://www.python.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.104+-green.svg)](https://fastapi.tiangolo.com/)
[![React](https://img.shields.io/badge/React-18.2-blue.svg)](https://reactjs.org/)
[![LangGraph](https://img.shields.io/badge/LangGraph-AI-orange.svg)](https://langchain-ai.github.io/langgraph/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

## 📋 Table of Contents

- [Overview](#overview)
- [Architecture](#architecture)
- [LangGraph AI Agent](#langgraph-ai-agent)
- [AI Tools](#ai-tools)
- [Features](#features)
- [Quick Start](#quick-start)
- [Screenshots](#screenshots)
- [Video Demo](#video-demo)
- [Technology Stack](#technology-stack)
- [API Documentation](#api-documentation)
- [Contributing](#contributing)

## 🎯 Overview

HCP Interaction CRM is a modern customer relationship management system designed for healthcare sales representatives. It combines traditional CRM functionality with cutting-edge AI capabilities powered by **LangGraph** and **Groq LLM** to intelligently process, analyze, and manage healthcare professional interactions.

### Key Capabilities

- 🤖 **AI-Powered Interaction Logging**: Natural language processing to extract structured data from conversation
- 🔍 **Intelligent HCP Lookup**: Smart search and duplicate prevention
- ✅ **Compliance Checking**: Automated validation of interaction notes for regulatory compliance
- 📊 **Next Best Action**: AI-driven recommendations for follow-up activities
- 💾 **Persistent Storage**: MySQL database with SQLAlchemy ORM
- 🎨 **Modern UI**: Clean, responsive React interface


## 🏗️ Architecture

### System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         FRONTEND (React 18)                             │
│  ┌──────────────────────┐         ┌──────────────────────────────┐     │
│  │  LogInteraction.jsx  │         │   InteractionList.jsx        │     │
│  │  - Form inputs       │         │   - Display table            │     │
│  │  - Validation        │         │   - Real-time updates        │     │
│  └──────────┬───────────┘         └──────────┬───────────────────┘     │
│             │                                 │                         │
│             └────────────┬────────────────────┘                         │
│                          │                                              │
│                  ┌───────▼────────┐                                     │
│                  │   api.js       │                                     │
│                  │   HTTP Client  │                                     │
│                  └───────┬────────┘                                     │
└──────────────────────────┼──────────────────────────────────────────────┘
                           │ REST API (JSON)
                           │
┌──────────────────────────▼──────────────────────────────────────────────┐
│                      BACKEND (FastAPI)                                  │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │                    API Layer (main.py)                          │   │
│  │  - CORS middleware                                              │   │
│  │  - Route handlers                                               │   │
│  │  - Request validation                                           │   │
│  └────────────────────────┬────────────────────────────────────────┘   │
│                           │                                             │
│  ┌────────────────────────▼────────────────────────────────────────┐   │
│  │              AI Agent Layer (LangGraph)                         │   │
│  │  ┌──────────────────────────────────────────────────────────┐  │   │
│  │  │  agent.py - LangGraph Orchestration                      │  │   │
│  │  │  ┌────────────┐  ┌────────────┐  ┌────────────┐         │  │   │
│  │  │  │ Receive    │→ │ Process    │→ │ Invoke     │→ END    │  │   │
│  │  │  │ Input      │  │ with LLM   │  │ Tools      │         │  │   │
│  │  │  └────────────┘  └────────────┘  └────────────┘         │  │   │
│  │  │                                                           │  │   │
│  │  │  Groq LLM (llama-3.3-70b-versatile)                      │  │   │
│  │  └──────────────────────────────────────────────────────────┘  │   │
│  │  ┌──────────────────────────────────────────────────────────┐  │   │
│  │  │  tools.py - AI Tool Implementations                      │  │   │
│  │  │  • LogInteractionTool                                    │  │   │
│  │  │  • EditInteractionTool                                   │  │   │
│  │  │  • HcpLookupTool                                         │  │   │
│  │  │  • ComplianceCheckTool                                   │  │   │
│  │  │  • NextBestActionTool                                    │  │   │
│  │  └──────────────────────────────────────────────────────────┘  │   │
│  └────────────────────────┬────────────────────────────────────────┘   │
│                           │                                             │
│  ┌────────────────────────▼────────────────────────────────────────┐   │
│  │              Database Layer (SQLAlchemy)                        │   │
│  │  - models.py: ORM models                                        │   │
│  │  - database.py: Connection management                           │   │
│  │  - schemas.py: Pydantic validation                              │   │
│  └────────────────────────┬────────────────────────────────────────┘   │
└───────────────────────────┼─────────────────────────────────────────────┘
                            │ SQL Queries
                            │
┌───────────────────────────▼─────────────────────────────────────────────┐
│                      DATABASE (MySQL)                                   │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │  Table: interactions                                             │  │
│  │  - id (PK, AUTO_INCREMENT)                                       │  │
│  │  - hcp_name (VARCHAR, INDEXED)                                   │  │
│  │  - interaction_type (VARCHAR)                                    │  │
│  │  - notes (TEXT)                                                  │  │
│  │  - created_at (DATETIME)                                         │  │
│  └──────────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────────┘
```


## 🤖 LangGraph AI Agent

### What is LangGraph?

**LangGraph** is a framework for building stateful, multi-actor applications with Large Language Models (LLMs). It extends LangChain with the ability to create cyclical graphs, making it ideal for agent workflows that require:

- **State Management**: Maintain context across multiple steps
- **Tool Orchestration**: Coordinate multiple AI tools
- **Decision Making**: Route between different processing paths
- **Error Recovery**: Handle failures gracefully

### Our LangGraph Implementation

The HCP Interaction Agent uses a **4-node graph** to process user interactions:

```python
┌─────────────┐     ┌──────────────────┐     ┌──────────────┐     ┌──────────────────┐
│   Receive   │ ──→ │  Process with    │ ──→ │   Invoke     │ ──→ │    Generate      │
│   Input     │     │  LLM (Groq)      │     │   Tools      │     │    Response      │
└─────────────┘     └──────────────────┘     └──────────────┘     └──────────────────┘
      ↓                      ↓                       ↓                      ↓
  User says:          LLM extracts:           Tools execute:          Returns:
  "I met with         - HCP name              - Compliance check      - Structured data
   Dr. Smith          - Type: Visit           - Next actions          - Tool results
   yesterday..."      - Key notes             - HCP lookup            - Recommendations
```

### Agent Workflow

#### Node 1: Receive Input
- Accepts natural language description from user
- Validates input format
- Initializes agent state

#### Node 2: Process with LLM
- **LLM Model**: Groq's `llama-3.3-70b-versatile`
- **Temperature**: 0.1 (low for structured output)
- **Task**: Extract structured data from conversation
- **Output**: JSON with HCP name, interaction type, notes, and tool recommendations

Example LLM extraction:
```json
{
  "understanding": "User met with Dr. Smith for a product demo",
  "extracted_data": {
    "hcp_name": "Dr. Sarah Smith",
    "interaction_type": "Visit",
    "notes": "Discussed new product features, positive feedback"
  },
  "tools_to_call": [
    {"name": "compliance_check", "input": {"text": "..."}},
    {"name": "next_best_action", "input": {...}}
  ]
}
```

#### Node 3: Invoke Tools
- Executes recommended tools in parallel
- Collects results from each tool
- Handles tool errors gracefully

#### Node 4: Generate Response
- Compiles final structured output
- Combines extracted data with tool results
- Returns ready-to-save interaction record

### State Management

The agent maintains state across all nodes using `AgentState`:

```python
class AgentState(TypedDict):
    messages: list[BaseMessage]              # Conversation history
    conversation_history: list[Dict]         # Structured history
    extracted_interaction: Optional[Dict]    # Parsed interaction data
    tool_calls: list[Dict]                   # Tool execution results
    final_result: Optional[Dict]             # Final output
```

### Why LangGraph?

Traditional approaches require manual orchestration of LLM calls, tool execution, and state management. LangGraph provides:

✅ **Declarative Workflow**: Define the graph structure, not the execution logic  
✅ **Automatic State Passing**: State flows between nodes automatically  
✅ **Built-in Retry Logic**: Handle LLM failures gracefully  
✅ **Visualization**: Generate workflow diagrams for debugging  
✅ **Streaming Support**: Stream responses in real-time  


## 🛠️ AI Tools

The system includes **5 specialized AI tools** that work together to process interactions:

### 1. 📝 LogInteractionTool

**Purpose**: Extract and structure interaction data from natural language

**Input**:
```python
{
  "hcp_name": "Dr. Sarah Johnson",
  "interaction_type": "Visit",  # Visit | Call | Virtual
  "notes": "Discussed product features and pricing"
}
```

**Output**:
```python
{
  "status": "success",
  "message": "Extracted interaction for Dr. Sarah Johnson",
  "data": {
    "hcp_name": "Dr. Sarah Johnson",
    "interaction_type": "Visit",
    "notes": "Discussed product features and pricing"
  }
}
```

**Use Case**: Convert free-text descriptions into structured database records

---

### 2. ✏️ EditInteractionTool

**Purpose**: Modify previously logged interactions

**Input**:
```python
{
  "interaction_id": 42,
  "field": "notes",  # hcp_name | interaction_type | notes
  "value": "Updated notes with additional details"
}
```

**Output**:
```python
{
  "status": "success",
  "message": "Updated notes for interaction 42",
  "data": {
    "interaction_id": 42,
    "field": "notes",
    "new_value": "Updated notes..."
  }
}
```

**Use Case**: Correct mistakes or add information to existing records

---

### 3. 🔍 HcpLookupTool

**Purpose**: Search for existing HCP records to prevent duplicates

**Input**:
```python
{
  "hcp_name": "Dr. Smith"
}
```

**Output**:
```python
{
  "status": "success",
  "message": "HCP lookup for 'Dr. Smith'",
  "data": {
    "found": false,
    "suggestions": [
      "Dr. Sarah Smith",
      "Dr. John Smith",
      "Dr. Michael Smith"
    ]
  }
}
```

**Use Case**: Maintain data integrity and suggest similar HCP names

---

### 4. ✅ ComplianceCheckTool

**Purpose**: Validate interaction notes for regulatory compliance

**Input**:
```python
{
  "text": "Discussed off-label use of medication X"
}
```

**Output**:
```python
{
  "status": "warning",
  "message": "Compliance issues detected: ['off-label']",
  "data": {
    "compliant": false,
    "issues": ["off-label"],
    "suggestion": "Consider rephrasing to avoid regulatory concerns"
  }
}
```

**Detects**:
- Off-label mentions
- Experimental/unapproved drug references
- Unlicensed product discussions
- Other regulatory red flags

**Use Case**: Prevent compliance violations before they're saved

---

### 5. 🎯 NextBestActionTool

**Purpose**: Suggest intelligent follow-up actions based on interaction context

**Input**:
```python
{
  "hcp_name": "Dr. Sarah Johnson",
  "interaction_type": "Visit",
  "notes": "Positive feedback on product, mentioned issues with delivery"
}
```

**Output**:
```python
{
  "status": "success",
  "message": "Generated recommendations for Dr. Sarah Johnson",
  "data": {
    "hcp_name": "Dr. Sarah Johnson",
    "recommended_actions": [
      "Schedule follow-up call within 2 weeks",
      "Send meeting summary email",
      "Escalate delivery issues to support team"
    ],
    "priority": "High"
  }
}
```

**Logic**:
- **Visit** → Schedule follow-up call, send summary
- **Call** → Log action items, consider in-person visit
- **Virtual** → Send recording, plan next meeting
- **Feedback mentioned** → Document for product team
- **Issues mentioned** → Escalate to support

**Use Case**: Never miss a follow-up opportunity

---

### Tool Execution Flow

```
User Input: "I met with Dr. Smith yesterday to discuss our new product"
                                ↓
                    LangGraph Agent (LLM)
                                ↓
                    Extracts structured data
                                ↓
                    Recommends tools to call
                                ↓
        ┌───────────────┬───────────────┬───────────────┐
        ↓               ↓               ↓               ↓
  LogInteraction  HcpLookup    ComplianceCheck  NextBestAction
        ↓               ↓               ↓               ↓
    Structures      Checks for      Validates       Suggests
    the data        duplicates      compliance      follow-ups
        ↓               ↓               ↓               ↓
        └───────────────┴───────────────┴───────────────┘
                                ↓
                    Combined Results
                                ↓
                    Save to Database
```


## ✨ Features

### Core Functionality
- ✅ Log HCP interactions (Visit, Call, Virtual)
- ✅ View interaction history with timestamps
- ✅ Real-time form validation
- ✅ Success/error notifications
- ✅ Responsive design (mobile-friendly)

### AI-Powered Features
- 🤖 Natural language interaction logging
- 🔍 Intelligent HCP search and deduplication
- ✅ Automated compliance checking
- 🎯 Smart follow-up recommendations
- 📊 Context-aware action suggestions

### Technical Features
- 🚀 FastAPI backend with async support
- 💾 MySQL database with SQLAlchemy ORM
- 🔐 CORS-enabled API
- 📚 Auto-generated API documentation (Swagger UI)
- 🎨 Clean CSS (no frameworks)
- ⚡ React 18 with hooks


## 🚀 Quick Start

### Prerequisites

- **Python 3.11+** ([Download](https://www.python.org/downloads/))
- **Node.js 18+** ([Download](https://nodejs.org/))
- **MySQL 5.7+** ([Download](https://dev.mysql.com/downloads/))
- **Groq API Key** ([Get Free Key](https://console.groq.com/))

### Installation

#### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/hcp-crm.git
cd hcp-crm
```

#### 2. Set Up Database

```bash
# Start MySQL and create database
mysql -u root -p
```

```sql
CREATE DATABASE hcp_crm CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
EXIT;
```

#### 3. Configure Backend

```bash
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Set environment variables
# Windows (PowerShell):
$env:GROQ_API_KEY="<your_groq_api_key>"
$env:DATABASE_URL="mysql+pymysql://root:password@localhost/hcp_crm"

# macOS/Linux:
export GROQ_API_KEY="your_groq_api_key_here"
export DATABASE_URL="mysql+pymysql://root:password@localhost/hcp_crm"
```

#### 4. Start Backend Server

```bash
# From backend directory
python -m uvicorn app.main:app --reload
```

✅ Backend running at: **http://localhost:8000**  
📚 API docs at: **http://localhost:8000/docs**

#### 5. Configure Frontend (New Terminal)

```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm start
```

✅ Frontend running at: **http://localhost:3000**

### Verify Installation

1. Open **http://localhost:3000** in your browser
2. Fill in the form:
   - HCP Name: "Dr. Sarah Johnson"
   - Type: "Visit"
   - Notes: "Discussed new product features"
3. Click "Save Interaction"
4. See success message and new row in table


## 📸 Screenshots

### Main Dashboard
![Main Dashboard](docs/screenshots/dashboard.png)
*Clean, intuitive interface for logging and viewing HCP interactions*

### Interaction Form
![Interaction Form](docs/screenshots/form.png)
*Simple form with validation and real-time feedback*

### Interaction List
![Interaction List](docs/screenshots/list.png)
*Responsive table showing recent interactions with timestamps*

### API Documentation
![API Documentation](docs/screenshots/api-docs.png)
*Auto-generated Swagger UI for testing endpoints*

### AI Agent in Action
![AI Agent](docs/screenshots/ai-agent.png)
*LangGraph agent processing natural language input*

> **Note**: Screenshots are located in the `docs/screenshots/` directory. To add your own:
> 1. Take screenshots of the running application
> 2. Save them in `docs/screenshots/`
> 3. Update the paths above


## 🎥 Video Demo

### Full Walkthrough

[![HCP CRM Demo Video](https://img.youtube.com/vi/YOUR_VIDEO_ID/maxresdefault.jpg)](https://www.youtube.com/watch?v=YOUR_VIDEO_ID)

**Watch the complete demo** showing:
- ⚡ Quick setup and installation
- 📝 Logging interactions through the UI
- 🤖 AI agent processing natural language
- 🔍 Compliance checking in action
- 🎯 Next best action recommendations
- 📊 Viewing interaction history

### Quick Demo (2 minutes)

[![Quick Demo](https://img.youtube.com/vi/YOUR_QUICK_DEMO_ID/maxresdefault.jpg)](https://www.youtube.com/watch?v=YOUR_QUICK_DEMO_ID)

**Short version** highlighting key features

---

> **To add your video**:
> 1. Record a demo using [OBS Studio](https://obsproject.com/) or [Loom](https://www.loom.com/)
> 2. Upload to YouTube
> 3. Replace `YOUR_VIDEO_ID` with your YouTube video ID
> 4. Update thumbnail URLs if needed


## 🔧 Technology Stack

### Frontend
| Technology | Version | Purpose |
|------------|---------|---------|
| React | 18.2.0 | UI framework |
| React DOM | 18.2.0 | DOM rendering |
| Plain CSS | - | Styling (no frameworks) |
| Axios | - | HTTP client |

### Backend
| Technology | Version | Purpose |
|------------|---------|---------|
| Python | 3.11+ | Programming language |
| FastAPI | 0.104.1 | Web framework |
| Uvicorn | 0.24.0 | ASGI server |
| SQLAlchemy | 2.0.23 | ORM |
| Pydantic | 2.5.0 | Data validation |
| PyMySQL | 1.1.0 | MySQL driver |

### AI/ML
| Technology | Version | Purpose |
|------------|---------|---------|
| LangGraph | Latest | Agent orchestration |
| LangChain | Latest | LLM framework |
| Groq | Latest | LLM API (llama-3.3-70b) |

### Database
| Technology | Version | Purpose |
|------------|---------|---------|
| MySQL | 5.7+ | Relational database |

### Development Tools
| Tool | Purpose |
|------|---------|
| Git | Version control |
| npm | Package management (frontend) |
| pip | Package management (backend) |
| venv | Python virtual environment |


## 📚 API Documentation

### Base URL
```
http://localhost:8000
```

### Endpoints

#### Health Check
```http
GET /health
```

**Response**:
```json
{
  "status": "healthy",
  "timestamp": "2024-01-15T10:30:00"
}
```

---

#### Create Interaction
```http
POST /interactions
Content-Type: application/json
```

**Request Body**:
```json
{
  "hcp_name": "Dr. Sarah Johnson",
  "interaction_type": "Visit",
  "notes": "Discussed product features and pricing"
}
```

**Response** (201 Created):
```json
{
  "id": 42,
  "hcp_name": "Dr. Sarah Johnson",
  "interaction_type": "Visit",
  "notes": "Discussed product features and pricing",
  "created_at": "2024-01-15T10:30:00"
}
```

---

#### Get All Interactions
```http
GET /interactions?skip=0&limit=100
```

**Response** (200 OK):
```json
[
  {
    "id": 42,
    "hcp_name": "Dr. Sarah Johnson",
    "interaction_type": "Visit",
    "notes": "Discussed product features",
    "created_at": "2024-01-15T10:30:00"
  },
  ...
]
```

---

#### Get Single Interaction
```http
GET /interactions/{id}
```

**Response** (200 OK):
```json
{
  "id": 42,
  "hcp_name": "Dr. Sarah Johnson",
  "interaction_type": "Visit",
  "notes": "Discussed product features",
  "created_at": "2024-01-15T10:30:00"
}
```

---

#### AI Chat Endpoint
```http
POST /ai/chat
Content-Type: application/json
```

**Request Body**:
```json
{
  "message": "I met with Dr. Smith yesterday to discuss our new product"
}
```

**Response** (200 OK):
```json
{
  "status": "success",
  "extracted_interaction": {
    "hcp_name": "Dr. Smith",
    "interaction_type": "Visit",
    "notes": "Discussed new product"
  },
  "tool_results": [
    {
      "tool": "compliance_check",
      "result": {"compliant": true}
    },
    {
      "tool": "next_best_action",
      "result": {
        "recommended_actions": [
          "Schedule follow-up call within 2 weeks",
          "Send meeting summary email"
        ]
      }
    }
  ]
}
```

### Interactive API Docs

Visit **http://localhost:8000/docs** for interactive Swagger UI documentation where you can:
- Test all endpoints
- See request/response schemas
- Try different parameters
- View validation rules


## 📁 Project Structure

```
hcp-crm/
├── backend/
│   ├── app/
│   │   ├── ai/
│   │   │   ├── __init__.py
│   │   │   ├── agent.py              # LangGraph agent orchestration
│   │   │   └── tools.py              # 5 AI tools implementation
│   │   ├── routes/
│   │   │   ├── __init__.py
│   │   │   └── interaction.py        # API endpoints
│   │   ├── __init__.py
│   │   ├── main.py                   # FastAPI application
│   │   ├── database.py               # SQLAlchemy setup
│   │   ├── models.py                 # ORM models
│   │   └── schemas.py                # Pydantic schemas
│   ├── requirements.txt              # Python dependencies
│   └── hcp_crm.db                    # SQLite database (dev)
│
├── frontend/
│   ├── public/
│   │   └── index.html                # HTML entry point
│   ├── src/
│   │   ├── api.js                    # API service layer
│   │   ├── App.js                    # Main React component
│   │   ├── LogInteraction.jsx        # Form component
│   │   ├── InteractionList.jsx       # Table component
│   │   ├── index.js                  # React entry point
│   │   └── styles.css                # All CSS styles
│   ├── package.json                  # npm dependencies
│   └── package-lock.json
│
├── docs/
│   └── screenshots/                  # Application screenshots
│
├── README.md                         # This file
├── ARCHITECTURE.md                   # Detailed architecture docs
├── PROJECT_SUMMARY.md                # Project completion summary
├── SETUP_GUIDE.md                    # Detailed setup instructions
└── LICENSE                           # MIT License

```


## 🧪 Testing

### Backend Tests

```bash
cd backend
pytest tests/ -v
```

### Frontend Tests

```bash
cd frontend
npm test
```

### Manual Testing Checklist

- [ ] Backend starts without errors
- [ ] Frontend loads at http://localhost:3000
- [ ] Can submit interaction form
- [ ] Success message appears
- [ ] New interaction shows in table
- [ ] API docs accessible at /docs
- [ ] AI agent processes natural language
- [ ] Compliance check detects issues
- [ ] Next actions are suggested


## 🚢 Deployment

### Docker Deployment

#### Build Images

```bash
# Backend
cd backend
docker build -t hcp-crm-backend .

# Frontend
cd frontend
docker build -t hcp-crm-frontend .
```

#### Run with Docker Compose

```yaml
# docker-compose.yml
version: '3.8'

services:
  mysql:
    image: mysql:8.0
    environment:
      MYSQL_ROOT_PASSWORD: rootpassword
      MYSQL_DATABASE: hcp_crm
    ports:
      - "3306:3306"
    volumes:
      - mysql_data:/var/lib/mysql

  backend:
    image: hcp-crm-backend
    environment:
      DATABASE_URL: mysql+pymysql://root:rootpassword@mysql/hcp_crm
      GROQ_API_KEY: ${GROQ_API_KEY}
    ports:
      - "8000:8000"
    depends_on:
      - mysql

  frontend:
    image: hcp-crm-frontend
    ports:
      - "3000:3000"
    depends_on:
      - backend

volumes:
  mysql_data:
```

```bash
docker-compose up -d
```

### Cloud Deployment (Render)

See [RENDER_DEPLOYMENT.md](RENDER_DEPLOYMENT.md) for detailed instructions on deploying to Render.com

### Environment Variables

#### Backend
```bash
DATABASE_URL=mysql+pymysql://user:password@host/database
GROQ_API_KEY=your_groq_api_key
CORS_ORIGINS=http://localhost:3000,https://yourdomain.com
```

#### Frontend
```bash
REACT_APP_API_URL=http://localhost:8000
```


## 🤝 Contributing

We welcome contributions! Here's how you can help:

### Getting Started

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

- Follow PEP 8 for Python code
- Use ESLint for JavaScript code
- Add tests for new features
- Update documentation
- Keep commits atomic and well-described

### Areas for Contribution

- 🐛 Bug fixes
- ✨ New AI tools
- 📚 Documentation improvements
- 🎨 UI/UX enhancements
- 🧪 Test coverage
- 🌐 Internationalization


## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **LangGraph** team for the amazing agent framework
- **Groq** for fast LLM inference
- **FastAPI** for the excellent web framework
- **React** team for the UI library

## 📞 Support

- 📧 Email: support@hcp-crm.com
- 💬 Discord: [Join our community](https://discord.gg/hcp-crm)
- 🐛 Issues: [GitHub Issues](https://github.com/yourusername/hcp-crm/issues)
- 📖 Docs: [Full Documentation](https://docs.hcp-crm.com)

## 🗺️ Roadmap

### Q1 2024
- [ ] Multi-user authentication
- [ ] Role-based access control
- [ ] Advanced analytics dashboard
- [ ] Email integration

### Q2 2024
- [ ] Mobile app (React Native)
- [ ] Calendar integration
- [ ] Advanced AI insights
- [ ] Export to PDF/Excel

### Q3 2024
- [ ] Voice-to-text interaction logging
- [ ] Sentiment analysis
- [ ] Predictive analytics
- [ ] Integration with CRM systems

---

<div align="center">

**Built with ❤️ using LangGraph, FastAPI, and React**

[⭐ Star this repo](https://github.com/yourusername/hcp-crm) | [🐛 Report Bug](https://github.com/yourusername/hcp-crm/issues) | [✨ Request Feature](https://github.com/yourusername/hcp-crm/issues)

</div>
