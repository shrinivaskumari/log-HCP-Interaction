from sqlalchemy import Column, Integer, String, Text, DateTime, Enum, Date, Time
from sqlalchemy.sql import func
from app.database import Base
import enum
from datetime import datetime


class InteractionType(str, enum.Enum):
    """Enum for interaction types"""
    VISIT = "Visit"
    CALL = "Call"
    VIRTUAL = "Virtual"
    MEETING = "Meeting"


class Interaction(Base):
    """SQLAlchemy model for HCP interactions"""
    __tablename__ = "interactions"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    hcp_name = Column(String(255), nullable=False, index=True)
    interaction_type = Column(String(50), nullable=False)  # Visit, Call, Virtual, Meeting
    date = Column(Date, nullable=True)
    time = Column(Time, nullable=True)
    attendees = Column(Text, nullable=True)
    topics_discussed = Column(Text, nullable=True)
    materials_shared = Column(Text, nullable=True)
    samples_distributed = Column(Text, nullable=True)
    hcp_sentiment = Column(String(50), nullable=True)  # Positive, Neutral, Negative
    outcomes = Column(Text, nullable=True)
    follow_up_actions = Column(Text, nullable=True)
    notes = Column(Text, nullable=True)
    created_at = Column(DateTime, server_default=func.now(), nullable=False)

    class Config:
        from_attributes = True

    def __repr__(self):
        return f"<Interaction(id={self.id}, hcp_name={self.hcp_name}, type={self.interaction_type})>"
