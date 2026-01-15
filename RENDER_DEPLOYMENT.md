# HCP CRM Deployment Guide - Render

## Prerequisites
- GitHub account with the project repository
- Render account (render.com)
- Groq API key for AI functionality

## Deployment Steps

### 1. Push Code to GitHub
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/hcp-crm.git
git push -u origin main
```

### 2. Deploy Backend on Render

1. Go to [render.com](https://dashboard.render.com)
2. Click "New +" → "Web Service"
3. Connect your GitHub repository
4. Fill in the deployment details:
   - **Name:** hcp-crm-backend
   - **Runtime:** Python 3.9
   - **Build Command:** `pip install -r requirements.txt`
   - **Start Command:** `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
   - **Root Directory:** backend

5. Add Environment Variables:
   - `GROQ_API_KEY`: Your Groq API key
   - `DATABASE_URL`: SQLite or PostgreSQL connection string (optional)
   - `ENVIRONMENT`: production

6. Click "Create Web Service"
7. Copy the Backend URL (e.g., https://hcp-crm-backend.onrender.com)

### 3. Deploy Frontend on Render

1. Click "New +" → "Static Site"
2. Connect your GitHub repository
3. Fill in the deployment details:
   - **Name:** hcp-crm-frontend
   - **Build Command:** `npm install && npm run build`
   - **Publish Directory:** build
   - **Root Directory:** frontend

4. Add Environment Variables (Build-time):
   - `REACT_APP_API_URL`: https://hcp-crm-backend.onrender.com

5. Click "Create Static Site"

### 4. Update Frontend API Configuration

Update the API URL in `frontend/src/api.js`:
```javascript
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';
```

### 5. Verify Deployment

- Backend: Visit `https://hcp-crm-backend.onrender.com/docs`
- Frontend: Visit your frontend URL from Render dashboard

### 6. Setup Auto-Deploy

Both services will auto-deploy when you push to the main branch.

## Troubleshooting

### Backend logs
Check Render dashboard → Backend service → Logs

### Frontend build issues
- Clear build cache in Render dashboard
- Ensure `npm install` completes successfully
- Check for missing dependencies

### API Connection issues
- Verify `REACT_APP_API_URL` environment variable
- Check CORS settings in backend
- Ensure backend is running (check `/docs` endpoint)

### Database issues
- For production, use PostgreSQL instead of SQLite
- Add database URL to environment variables
- Run migrations if needed

## Important Notes

- **Free tier limitations**: Render spins down free services after 15 minutes of inactivity
- **Cold starts**: First request after inactivity may take 30+ seconds
- **Upgrade to paid** for better performance and uptime
- **Database**: SQLite works but won't persist on free tier; use PostgreSQL for production
- **API Key**: Keep GROQ_API_KEY secure in environment variables

## Database Migration (Optional)

If switching from SQLite to PostgreSQL:

1. Create PostgreSQL database on Render or Neon
2. Update `DATABASE_URL` environment variable
3. Run migrations in backend

## Next Steps

1. Monitor the application performance
2. Set up error logging/monitoring
3. Configure custom domain (if needed)
4. Scale services as traffic increases
