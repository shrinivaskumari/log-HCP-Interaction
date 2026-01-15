from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from sqlalchemy.pool import StaticPool
from typing import Generator
import os

# MySQL connection string (for production)
# Uncomment the line below and update credentials to use MySQL
# DATABASE_URL = "mysql+pymysql://root:password@localhost:3306/hcp_crm"

# SQLite for development/testing (no external DB needed)
DATABASE_URL = "sqlite:///./hcp_crm.db"

# Create engine
is_sqlite = "sqlite" in DATABASE_URL

if is_sqlite:
    engine = create_engine(
        DATABASE_URL,
        echo=False,
        connect_args={"check_same_thread": False},
        poolclass=StaticPool,
    )
else:
    engine = create_engine(
        DATABASE_URL,
        echo=False,
        pool_pre_ping=True,
        pool_recycle=3600,
    )

# Session factory
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Base class for all models
Base = declarative_base()


def get_db() -> Generator:
    """
    Dependency injection for database session.
    Usage: @app.post("/interactions") def create(db: Session = Depends(get_db))
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def create_tables():
    """Create all tables in the database"""
    Base.metadata.create_all(bind=engine)
