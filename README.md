# 🚀 Quick Start - HCP Interaction CRM

## ⚡ 5-Minute Setup

### Step 1: Create Database (MySQL)
```sql
CREATE DATABASE hcp_crm CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### Step 2: Start Backend
```bash
cd hcp-crm/backend
python -m venv venv
venv\Scripts\activate  # Windows
pip install -r requirements.txt
python -m uvicorn app.main:app --reload
```
✅ Backend runs at: **http://localhost:8000**

### Step 3: Start Frontend (new terminal)
```bash
cd hcp-crm/frontend
npm install
npm start
```
✅ Frontend opens at: **http://localhost:3000**

---

## 📊 What You Get

| Feature | Status |
|---------|--------|
| Log new interactions | ✅ Working |
| Save to MySQL | ✅ Working |
| Display recent interactions | ✅ Working |
| Success alerts | ✅ Working |
| Professional UI | ✅ Clean design |
| Mobile responsive | ✅ Yes |
| AI-ready code | ✅ Ready to extend |

---

## 🎯 Test It Now

1. **Form**: Fill in all fields and click "Save Interaction"
2. **Success Message**: See green checkmark alert
3. **Table**: Interaction appears below in the table
4. **API**: Visit http://localhost:8000/docs for live API testing

---

## 📚 Full Documentation

See [SETUP_GUIDE.md](SETUP_GUIDE.md) for:
- Detailed setup instructions
- Database schema
- API endpoints
- Troubleshooting
- Next steps for AI integration

---

## 🔄 Data Flow

```
User Input (React) 
    ↓
LogInteraction Form 
    ↓
api.js (HTTP POST)
    ↓
FastAPI Backend (routes/interaction.py)
    ↓
SQLAlchemy ORM (models.py)
    ↓
MySQL Database
    ↓
Response with ID & timestamp
    ↓
Success Message + Refresh List
```

---

## 💾 Project Files

```
hcp-crm/
├── backend/app/
│   ├── main.py          ← FastAPI app
│   ├── models.py        ← Database models
│   ├── schemas.py       ← API schemas
│   ├── database.py      ← DB connection
│   └── routes/
│       └── interaction.py ← API endpoints
├── frontend/src/
│   ├── App.js           ← Main component
│   ├── LogInteraction.jsx ← Form
│   ├── InteractionList.jsx ← Table
│   ├── api.js           ← API calls
│   └── styles.css       ← All styling
└── SETUP_GUIDE.md       ← Full docs
```

---

**Ready to use! No AI yet, but fully prepared for it. 🎉**
