"""
AI Chat API Routes
Endpoint for conversational interaction logging using LangGraph and Groq
"""

from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel, Field
from sqlalchemy.orm import Session
from typing import Optional, Dict, Any

from app.database import get_db
from app.models import Interaction
from app.ai import get_agent


# ============================================================================
# SCHEMAS
# ============================================================================

class AIChatRequest(BaseModel):
    """Request schema for AI chat"""
    user_message: str = Field(..., description="User's description of interaction")


class InteractionExtract(BaseModel):
    """Extracted interaction data from AI"""
    hcp_name: str
    interaction_type: str
    notes: str


class AIChatResponse(BaseModel):
    """Response schema for AI chat"""
    status: str
    message: str
    extracted_interaction: Optional[InteractionExtract] = None
    tool_results: list[Dict[str, Any]] = []
    conversation_steps: int = 0


# ============================================================================
# ROUTES
# ============================================================================

router = APIRouter(prefix="/ai", tags=["ai"])


@router.post("/chat", response_model=AIChatResponse)
def ai_chat(
    request: AIChatRequest,
    db: Session = Depends(get_db)
) -> AIChatResponse:
    """
    AI-powered conversational interaction logging
    
    Uses LangGraph agent with Groq LLM (gemma2-9b-it) to:
    1. Understand free-text interaction description
    2. Extract HCP name, interaction type, notes
    3. Check compliance with regulatory tools
    4. Suggest next actions
    
    Args:
        request: User message describing the interaction
        db: Database session
        
    Returns:
        Extracted interaction data ready for confirmation/save
    """
    
    try:
        # Get LangGraph agent
        agent = get_agent()
        
        # Process user input through agent graph
        result = agent.process_conversation(request.user_message)
        
        # Extract the interaction data
        extracted_data = result.get("extracted_interaction")
        
        if not extracted_data:
            return AIChatResponse(
                status="incomplete",
                message="Could not extract interaction data. Please provide more details.",
                extracted_interaction=None,
                tool_results=result.get("tool_results", []),
                conversation_steps=result.get("conversation_steps", 0)
            )
        
        # Validate extracted data
        try:
            interaction_extract = InteractionExtract(**extracted_data)
        except Exception as e:
            return AIChatResponse(
                status="error",
                message=f"Extracted data validation failed: {str(e)}",
                extracted_interaction=None,
                tool_results=result.get("tool_results", []),
                conversation_steps=result.get("conversation_steps", 0)
            )
        
        return AIChatResponse(
            status="success",
            message="Interaction processed successfully. Please review and confirm before saving.",
            extracted_interaction=interaction_extract,
            tool_results=result.get("tool_results", []),
            conversation_steps=result.get("conversation_steps", 0)
        )
    
    except ValueError as e:
        if "GROQ_API_KEY" in str(e):
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="GROQ_API_KEY not configured. Set environment variable to enable AI features."
            )
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"AI processing failed: {str(e)}"
        )


@router.post("/chat/confirm", response_model=Dict[str, Any])
def confirm_and_save_interaction(
    interaction_data: InteractionExtract,
    db: Session = Depends(get_db)
) -> Dict[str, Any]:
    """
    Confirm extracted interaction and save to database
    
    User reviews the AI-extracted data and confirms it's correct
    before this endpoint saves it to the database
    
    Args:
        interaction_data: Confirmed interaction data
        db: Database session
        
    Returns:
        Saved interaction with ID and timestamp
    """
    
    try:
        # Validate interaction type
        valid_types = ["Visit", "Call", "Virtual"]
        if interaction_data.interaction_type not in valid_types:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Invalid interaction_type. Must be one of: {valid_types}"
            )
        
        # Create and save interaction
        db_interaction = Interaction(
            hcp_name=interaction_data.hcp_name,
            interaction_type=interaction_data.interaction_type,
            notes=interaction_data.notes
        )
        
        db.add(db_interaction)
        db.commit()
        db.refresh(db_interaction)
        
        return {
            "status": "success",
            "message": "Interaction saved successfully",
            "interaction_id": db_interaction.id,
            "created_at": db_interaction.created_at.isoformat(),
            "data": {
                "id": db_interaction.id,
                "hcp_name": db_interaction.hcp_name,
                "interaction_type": db_interaction.interaction_type,
                "notes": db_interaction.notes
            }
        }
    
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to save interaction: {str(e)}"
        )
