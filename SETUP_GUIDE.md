# HCP Interaction CRM - Setup & Running Guide

## Project Overview
This is an AI-ready CRM system for logging and tracking Healthcare Professional (HCP) interactions. The project uses:
- **Backend**: FastAPI (Python) with SQLAlchemy ORM
- **Database**: MySQL with pymysql driver
- **Frontend**: React 18 with functional components and plain CSS

---

## 📋 Prerequisites

Before running the project, ensure you have:
- **Python 3.9+** installed
- **Node.js 16+** and npm installed
- **MySQL Server** running locally (or configured connection)

### Verify installations:
```bash
python --version
node --version
npm --version
mysql --version
```

---

## 🗄️ Database Setup

### 1. Create MySQL Database

Open MySQL command line or MySQL Workbench:

```sql
-- Create the database
CREATE DATABASE hcp_crm CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Verify creation
SHOW DATABASES;
```

**Note**: The tables will be created automatically when the backend starts up for the first time.

### 2. Verify Connection

```sql
USE hcp_crm;
SHOW TABLES;  -- Should show 'interactions' table after first backend run
```

---

## 🚀 Backend Setup & Running

### 1. Navigate to backend directory
```bash
cd hcp-crm/backend
```

### 2. Create a Python virtual environment
```bash
# Windows
python -m venv venv
venv\Scripts\activate

# macOS/Linux
python3 -m venv venv
source venv/bin/activate
```

### 3. Install dependencies
```bash
pip install -r requirements.txt
```

### 4. Start the FastAPI server
```bash
# Development mode (with hot reload)
python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

# Or use
python app/main.py
```

**✓ Backend is running at**: `http://localhost:8000`
**✓ API Documentation**: `http://localhost:8000/docs` (Swagger UI)
**✓ Alternative Docs**: `http://localhost:8000/redoc` (ReDoc)

### Backend API Endpoints

| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/health` | Health check |
| GET | `/` | API info |
| POST | `/interactions` | Create new interaction |
| GET | `/interactions` | Fetch all interactions |
| GET | `/interactions/{id}` | Fetch specific interaction |

---

## ⚛️ Frontend Setup & Running

### 1. Navigate to frontend directory
```bash
cd hcp-crm/frontend
```

### 2. Install dependencies
```bash
npm install
```

### 3. Start the React development server
```bash
npm start
```

**✓ Frontend opens at**: `http://localhost:3000`

### Available npm scripts

```bash
npm start    # Start development server
npm build    # Build for production
npm test     # Run tests
```

---

## 🔄 Architecture & Data Flow

### User Journey: Create Interaction

```
1. User fills form in React UI (LogInteraction component)
   └─ HCP Name, Interaction Type, Notes

2. User clicks "Save Interaction" button
   └─ Form validation (client-side)

3. React calls FastAPI API (api.js → POST /interactions)
   └─ Sends JSON data to backend

4. FastAPI validates & processes request (routes/interaction.py)
   └─ Validates interaction type
   └─ Validates required fields

5. SQLAlchemy ORM saves to MySQL database
   └─ Creates new Interaction record

6. Backend returns success response with ID & timestamp
   └─ Status 201 Created

7. React displays success message
   └─ Clears form

8. React automatically refreshes interaction list
   └─ Calls GET /interactions
   └─ InteractionList component fetches and displays data in table
```

### Database Schema

```
Table: interactions
├─ id (INT, Primary Key, Auto-increment)
├─ hcp_name (VARCHAR 255, Indexed, Required)
├─ interaction_type (VARCHAR 50, Required) → Values: "Visit", "Call", "Virtual"
├─ notes (TEXT, Optional)
└─ created_at (DATETIME, Auto-set to current timestamp)
```

---

## 📁 Project Structure

```
hcp-crm/
├── backend/
│   ├── app/
│   │   ├── __init__.py                 # Package initializer
│   │   ├── main.py                     # FastAPI app & startup logic
│   │   ├── database.py                 # SQLAlchemy config, connection
│   │   ├── models.py                   # SQLAlchemy ORM models
│   │   ├── schemas.py                  # Pydantic request/response schemas
│   │   └── routes/
│   │       ├── __init__.py
│   │       └── interaction.py          # Interaction API routes
│   ├── requirements.txt                # Python dependencies
│   └── venv/                          # Virtual environment (created on setup)
│
└── frontend/
    ├── public/
    │   └── index.html                 # HTML entry point
    ├── src/
    │   ├── api.js                     # API service module
    │   ├── App.js                     # Main React component
    │   ├── LogInteraction.jsx         # Form component
    │   ├── InteractionList.jsx        # Table component
    │   ├── index.js                   # React DOM render
    │   └── styles.css                 # Global styles (plain CSS)
    ├── package.json                   # NPM dependencies
    └── node_modules/                  # Dependencies (created on npm install)
```

---

## 🔧 Configuration

### Database Connection
Edit [backend/app/database.py](backend/app/database.py) line 7:
```python
DATABASE_URL = "mysql+pymysql://root:password@localhost:3306/hcp_crm"
                                    ↑ ↑        ↑     ↑ ↑
                                user pass   host port  db
```

### API Base URL (Frontend)
Edit [frontend/src/api.js](frontend/src/api.js) line 3:
```javascript
const API_BASE_URL = "http://localhost:8000";
```

### CORS Settings
Edit [backend/app/main.py](backend/app/main.py) lines 13-18 to allow different frontend URLs:
```python
allow_origins=["http://localhost:3000", "http://localhost:8080", "*"]
```

---

## 🧪 Testing the Application

### 1. Test Backend API (using curl or Postman)

**Create an interaction:**
```bash
curl -X POST http://localhost:8000/interactions \
  -H "Content-Type: application/json" \
  -d '{
    "hcp_name": "Dr. Sarah Johnson",
    "interaction_type": "Visit",
    "notes": "Discussed new treatment options"
  }'
```

**Fetch all interactions:**
```bash
curl http://localhost:8000/interactions
```

### 2. Test Frontend UI

1. Navigate to `http://localhost:3000`
2. Fill in the form:
   - HCP Name: "Dr. John Smith"
   - Interaction Type: "Call"
   - Notes: "Follow-up discussion"
3. Click "Save Interaction"
4. Verify success message appears
5. Verify interaction appears in the table below

---

## 🎨 UI Features

- ✅ Centered card layout with professional styling
- ✅ Header with gradient background
- ✅ Form with validation
- ✅ Dropdown for interaction type
- ✅ Success/Error alerts with animations
- ✅ Responsive table with interaction data
- ✅ Type badges with color coding
- ✅ Date/time formatting
- ✅ Loading states
- ✅ Mobile-responsive design
- ✅ Clean CSS (no frameworks)

---

## 🚨 Troubleshooting

### Backend Issues

**Port 8000 already in use:**
```bash
# Use a different port
python -m uvicorn app.main:app --reload --port 8001
# Then update frontend API_BASE_URL to http://localhost:8001
```

**MySQL connection error:**
- Verify MySQL server is running
- Check credentials in database.py
- Ensure database `hcp_crm` exists
```bash
mysql -u root -p -e "SHOW DATABASES;"
```

**Import errors:**
```bash
# Reinstall dependencies
pip install -r requirements.txt --force-reinstall
```

### Frontend Issues

**Port 3000 already in use:**
```bash
# React will ask to use port 3001
# Or manually set
PORT=3001 npm start
```

**CORS errors:**
- Verify backend CORS settings allow frontend origin
- Check both servers are running
- Verify API_BASE_URL in api.js matches backend URL

**Blank page:**
- Check browser console for errors (F12)
- Verify backend is running and accessible
- Clear browser cache and hard refresh (Ctrl+Shift+R)

---

## 📝 Next Steps: Adding AI Features

The codebase is designed to easily integrate AI later:

1. **Sentiment Analysis**: Analyze interaction notes for sentiment
2. **Smart Summaries**: Auto-generate summaries using LLMs
3. **Next Action Prediction**: Suggest next interaction steps
4. **Pattern Recognition**: Identify interaction patterns using ML
5. **Chatbot Integration**: Add LangGraph-based interaction suggestions

The architecture supports adding these features by extending:
- Schemas for AI predictions
- Routes with AI processing
- Frontend components for AI insights

---

## 📚 Technology Stack Reference

| Layer | Technology | Purpose |
|-------|-----------|---------|
| Frontend | React 18 | UI framework |
| Styling | Plain CSS | No dependencies |
| Backend | FastAPI | Web framework |
| ORM | SQLAlchemy | Database abstraction |
| Database | MySQL | Data persistence |
| Driver | pymysql | Python-MySQL bridge |
| Validation | Pydantic | Request/response validation |
| Server | Uvicorn | ASGI server |

---

## 💡 Key Concepts

### Dependency Injection (Backend)
```python
def get_interactions(db: Session = Depends(get_db)):
    # db is automatically provided by FastAPI
```

### Component State (Frontend)
```javascript
const [formData, setFormData] = useState({ ... })
// React manages component state
```

### API Service Layer (Frontend)
```javascript
// Centralized API calls in api.js
export const createInteraction = async (data) => { ... }
```

---

## 📄 License

This project is part of an AI-first CRM initiative.

---

## Support

For issues or questions, refer to:
- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [React Documentation](https://react.dev/)
- [SQLAlchemy Documentation](https://docs.sqlalchemy.org/)
- [MySQL Documentation](https://dev.mysql.com/doc/)

---

**Happy coding! 🚀**
