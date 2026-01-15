from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import desc
from typing import List

from app.database import get_db
from app.models import Interaction, InteractionType
from app.schemas import InteractionCreate, InteractionResponse, InteractionListResponse

router = APIRouter(prefix="/interactions", tags=["interactions"])


@router.post("", response_model=InteractionResponse, status_code=status.HTTP_201_CREATED)
def create_interaction(
    interaction: InteractionCreate,
    db: Session = Depends(get_db)
) -> InteractionResponse:
    """
    Create a new HCP interaction.
    
    - **hcp_name**: Name of the healthcare professional
    - **interaction_type**: Type of interaction (Visit, Call, Virtual)
    - **notes**: Optional detailed notes about the interaction
    """
    # Validate interaction type
    valid_types = [t.value for t in InteractionType]
    if interaction.interaction_type not in valid_types:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid interaction_type. Must be one of: {', '.join(valid_types)}"
        )
    
    # Create new interaction object
    db_interaction = Interaction(
        hcp_name=interaction.hcp_name,
        interaction_type=interaction.interaction_type,
        notes=interaction.notes
    )
    
    # Save to database
    db.add(db_interaction)
    db.commit()
    db.refresh(db_interaction)
    
    return db_interaction


@router.get("", response_model=InteractionListResponse)
def get_interactions(
    limit: int = 50,
    offset: int = 0,
    db: Session = Depends(get_db)
) -> InteractionListResponse:
    """
    Fetch all HCP interactions with pagination.
    
    - **limit**: Number of records to return (default 50, max 100)
    - **offset**: Number of records to skip (default 0)
    """
    # Validate limit
    limit = min(limit, 100)  # Max 100 per request
    
    # Query interactions, ordered by most recent first
    interactions = db.query(Interaction).order_by(
        desc(Interaction.created_at)
    ).offset(offset).limit(limit).all()
    
    # Count total interactions
    total_count = db.query(Interaction).count()
    
    return InteractionListResponse(
        count=total_count,
        interactions=interactions
    )


@router.get("/{interaction_id}", response_model=InteractionResponse)
def get_interaction(
    interaction_id: int,
    db: Session = Depends(get_db)
) -> InteractionResponse:
    """Get a specific interaction by ID"""
    interaction = db.query(Interaction).filter(
        Interaction.id == interaction_id
    ).first()
    
    if not interaction:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Interaction with id {interaction_id} not found"
        )
    
    return interaction


@router.delete("/{interaction_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_interaction(
    interaction_id: int,
    db: Session = Depends(get_db)
):
    """Delete an interaction by ID"""
    interaction = db.query(Interaction).filter(
        Interaction.id == interaction_id
    ).first()
    
    if not interaction:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Interaction with id {interaction_id} not found"
        )
    
    db.delete(interaction)
    db.commit()
    
    return None
