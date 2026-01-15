from pydantic import BaseModel, Field
from datetime import datetime
from typing import Optional, List


class InteractionCreate(BaseModel):
    """Schema for creating a new interaction"""
    hcp_name: str = Field(..., min_length=1, max_length=255, description="Healthcare Professional Name")
    interaction_type: str = Field(..., description="Type of interaction: Visit, Call, or Virtual")
    notes: Optional[str] = Field(None, max_length=5000, description="Detailed notes about the interaction")

    class Config:
        json_schema_extra = {
            "example": {
                "hcp_name": "Dr. John Smith",
                "interaction_type": "Visit",
                "notes": "Discussed new product features"
            }
        }


class InteractionResponse(InteractionCreate):
    """Schema for interaction response"""
    id: int
    created_at: datetime

    class Config:
        from_attributes = True
        json_schema_extra = {
            "example": {
                "id": 1,
                "hcp_name": "Dr. John Smith",
                "interaction_type": "Visit",
                "notes": "Discussed new product features",
                "created_at": "2024-01-15T10:30:00"
            }
        }


class InteractionListResponse(BaseModel):
    """Schema for list of interactions"""
    count: int
    interactions: List[InteractionResponse]

    class Config:
        json_schema_extra = {
            "example": {
                "count": 2,
                "interactions": [
                    {
                        "id": 1,
                        "hcp_name": "Dr. John Smith",
                        "interaction_type": "Visit",
                        "notes": "Discussed new product features",
                        "created_at": "2024-01-15T10:30:00"
                    }
                ]
            }
        }
