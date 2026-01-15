from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from app.database import create_tables
from app.routes import interaction
from app.routes import ai_chat

# Create FastAPI application
app = FastAPI(
    title="HCP Interaction CRM API",
    description="AI-first CRM system for logging HCP (Healthcare Professional) interactions using LangGraph and Groq LLM",
    version="2.0.0"
)

# Configure CORS for React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:8080", "*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Create database tables on startup
@app.on_event("startup")
def startup_event():
    """Initialize database tables on application startup"""
    print("Initializing database tables...")
    create_tables()
    print("Database tables created successfully!")


# Health check endpoint
@app.get("/health")
def health_check():
    """Health check endpoint"""
    return JSONResponse(
        status_code=200,
        content={"status": "healthy", "service": "HCP Interaction CRM API"}
    )


# Include routers
app.include_router(interaction.router)
app.include_router(ai_chat.router)


# Root endpoint
@app.get("/")
def root():
    """Root endpoint with API information"""
    return {
        "message": "HCP Interaction CRM API",
        "version": "1.0.0",
        "docs": "/docs",
        "health": "/health"
    }


if __name__ == "__main__":
    import uvicorn
    
    # Run the server
    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info"
    )
