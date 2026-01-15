# HCP CRM Quick Deployment Checklist

## Before Deploying to Render

### Backend Setup
- [ ] Verify `requirements.txt` has all dependencies
- [ ] Check `app/main.py` has proper CORS configuration
- [ ] Test backend locally: `uvicorn app.main:app --host 127.0.0.1 --port 8000`
- [ ] Verify database migrations work

### Frontend Setup
- [ ] Update `frontend/src/api.js` to use environment variable
- [ ] Test build locally: `npm run build`
- [ ] Verify no hardcoded URLs
- [ ] Check all API endpoints are correct

### Environment Variables
- [ ] Have Groq API key ready
- [ ] Decide on database (SQLite for MVP, PostgreSQL for production)
- [ ] Prepare any other required env vars

## Deployment Steps

### Step 1: Push to GitHub
```bash
git init
git add .
git commit -m "Deploy to Render"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/hcp-crm.git
git push -u origin main
```

### Step 2: Deploy Backend
1. Visit https://render.com/dashboard
2. Click "New" → "Web Service"
3. Select GitHub repository
4. Configure:
   - **Name:** hcp-crm-backend
   - **Runtime:** Python 3.9
   - **Root Directory:** backend
   - **Build:** `pip install -r requirements.txt`
   - **Start:** `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
5. Set environment variables:
   - `GROQ_API_KEY` = your-key
6. Click "Create Web Service"
7. **Note the Backend URL** (e.g., https://hcp-crm-backend.onrender.com)

### Step 3: Deploy Frontend
1. Click "New" → "Static Site"
2. Select GitHub repository
3. Configure:
   - **Name:** hcp-crm-frontend
   - **Root Directory:** frontend
   - **Build:** `npm install && npm run build`
   - **Publish:** build
4. Set environment variables:
   - `REACT_APP_API_URL` = https://hcp-crm-backend.onrender.com
5. Click "Create Static Site"

### Step 4: Verify
- Backend: https://hcp-crm-backend.onrender.com/docs
- Frontend: Your frontend URL

## After Deployment

- Monitor logs in Render dashboard
- Test all features
- Set up error tracking (optional)
- Configure custom domain (optional)

## Support Links
- Render Docs: https://render.com/docs
- FastAPI Docs: https://fastapi.tiangolo.com/
- React Docs: https://react.dev/

## Note
Free tier services spin down after 15 minutes of inactivity. Upgrade to paid for always-on service.
