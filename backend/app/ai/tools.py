"""
LangGraph Tools for AI-Powered HCP Interaction Logging
Provides 5+ tools for interaction processing, compliance, and follow-up
"""

from typing import Optional, Dict, List, Any
from pydantic import BaseModel, Field
import json


# ============================================================================
# TOOL SCHEMAS
# ============================================================================

class LogInteractionInput(BaseModel):
    """Input schema for LogInteractionTool"""
    hcp_name: str = Field(..., description="Name of the healthcare professional")
    interaction_type: str = Field(
        ..., 
        description="Type: 'Visit', 'Call', or 'Virtual'"
    )
    notes: str = Field(..., description="Summarized interaction notes")


class EditInteractionInput(BaseModel):
    """Input schema for EditInteractionTool"""
    interaction_id: int = Field(..., description="ID of interaction to edit")
    field: str = Field(
        ..., 
        description="Field to edit: 'hcp_name', 'interaction_type', or 'notes'"
    )
    value: str = Field(..., description="New value for the field")


class HcpLookupInput(BaseModel):
    """Input schema for HcpLookupTool"""
    hcp_name: str = Field(..., description="Name to search for")


class ComplianceCheckInput(BaseModel):
    """Input schema for ComplianceCheckTool"""
    text: str = Field(..., description="Text to check for compliance issues")


class NextBestActionInput(BaseModel):
    """Input schema for NextBestActionTool"""
    hcp_name: str = Field(..., description="HCP name for context")
    interaction_type: str = Field(..., description="Type of last interaction")
    notes: str = Field(..., description="Summary of interaction")


# ============================================================================
# TOOL IMPLEMENTATIONS
# ============================================================================

class LogInteractionTool:
    """
    TOOL 1: Extract and structure interaction data from conversation
    Converts free-text description into structured interaction record
    """
    
    def __init__(self, db_session=None):
        self.db_session = db_session
        self.name = "log_interaction"
        self.description = "Extract HCP name, interaction type, and notes from conversation"
    
    def execute(self, hcp_name: str, interaction_type: str, notes: str) -> Dict[str, Any]:
        """
        Log an interaction to the database
        
        Args:
            hcp_name: Name of healthcare professional
            interaction_type: Visit, Call, or Virtual
            notes: Interaction summary
            
        Returns:
            Dict with success status and interaction data
        """
        # Validate interaction type
        valid_types = ["Visit", "Call", "Virtual"]
        if interaction_type not in valid_types:
            return {
                "status": "error",
                "message": f"Invalid type. Must be one of: {valid_types}",
                "data": None
            }
        
        # Return structured data (actual DB save happens in API layer)
        return {
            "status": "success",
            "message": f"Extracted interaction for {hcp_name}",
            "data": {
                "hcp_name": hcp_name,
                "interaction_type": interaction_type,
                "notes": notes
            }
        }


class EditInteractionTool:
    """
    TOOL 2: Modify previously logged interaction
    Allows correction or updates to existing records
    """
    
    def __init__(self, db_session=None):
        self.db_session = db_session
        self.name = "edit_interaction"
        self.description = "Edit a specific field of an existing interaction"
    
    def execute(self, interaction_id: int, field: str, value: str) -> Dict[str, Any]:
        """
        Edit an interaction field
        
        Args:
            interaction_id: ID of interaction to edit
            field: Field name (hcp_name, interaction_type, notes)
            value: New value
            
        Returns:
            Dict with success status
        """
        valid_fields = ["hcp_name", "interaction_type", "notes"]
        if field not in valid_fields:
            return {
                "status": "error",
                "message": f"Cannot edit field '{field}'. Valid: {valid_fields}",
                "data": None
            }
        
        if field == "interaction_type" and value not in ["Visit", "Call", "Virtual"]:
            return {
                "status": "error",
                "message": "Invalid interaction type",
                "data": None
            }
        
        return {
            "status": "success",
            "message": f"Updated {field} for interaction {interaction_id}",
            "data": {
                "interaction_id": interaction_id,
                "field": field,
                "new_value": value
            }
        }


class HcpLookupTool:
    """
    TOOL 3: Search for existing HCP records
    Prevents duplicate HCP entries and maintains referential integrity
    """
    
    def __init__(self, db_session=None):
        self.db_session = db_session
        self.name = "hcp_lookup"
        self.description = "Search for existing HCP records by name"
    
    def execute(self, hcp_name: str = None, text: str = None) -> Dict[str, Any]:
        """
        Look up HCP by name
        
        Args:
            hcp_name: Name to search for
            text: Alternative parameter name for HCP name
            
        Returns:
            Dict with HCP data or not found
        """
        # Handle both parameter names
        search_term = hcp_name or text or "Unknown"
        
        # Simulate lookup (in real scenario, queries DB)
        return {
            "status": "success",
            "message": f"HCP lookup for '{search_term}'",
            "data": {
                "found": False,
                "suggestions": [
                    "Dr. Sarah Johnson",
                    "Dr. John Smith",
                    "Dr. Michael Chen"
                ]
            }
        }


class ComplianceCheckTool:
    """
    TOOL 4: Validate interaction notes for compliance
    Detects risky language, off-label mentions, or regulatory concerns
    """
    
    def __init__(self, db_session=None):
        self.db_session = db_session
        self.name = "compliance_check"
        self.description = "Check interaction notes for compliance issues"
    
    def execute(self, text: str) -> Dict[str, Any]:
        """
        Check text for compliance concerns
        
        Args:
            text: Interaction notes to check
            
        Returns:
            Dict with compliance status and suggestions
        """
        # Simulate compliance check
        risky_keywords = ["off-label", "experimental", "unlicensed", "unapproved"]
        found_issues = [kw for kw in risky_keywords if kw.lower() in text.lower()]
        
        if found_issues:
            return {
                "status": "warning",
                "message": f"Compliance issues detected: {found_issues}",
                "data": {
                    "compliant": False,
                    "issues": found_issues,
                    "suggestion": "Consider rephrasing to avoid regulatory concerns"
                }
            }
        
        return {
            "status": "success",
            "message": "No compliance issues detected",
            "data": {
                "compliant": True,
                "issues": []
            }
        }


class NextBestActionTool:
    """
    TOOL 5: Suggest follow-up actions based on interaction
    Uses interaction context to recommend next steps
    """
    
    def __init__(self, db_session=None):
        self.db_session = db_session
        self.name = "next_best_action"
        self.description = "Suggest recommended follow-up actions"
    
    def execute(self, hcp_name: str, interaction_type: str, notes: str) -> Dict[str, Any]:
        """
        Get next recommended actions
        
        Args:
            hcp_name: HCP name for context
            interaction_type: Type of interaction
            notes: Interaction summary
            
        Returns:
            Dict with suggested actions
        """
        # Logic for suggesting next actions
        actions = []
        
        if interaction_type == "Visit":
            actions.append("Schedule follow-up call within 2 weeks")
            actions.append("Send meeting summary email")
        elif interaction_type == "Call":
            actions.append("Log action items if discussed")
            actions.append("Consider scheduling in-person visit")
        elif interaction_type == "Virtual":
            actions.append("Send recording summary")
            actions.append("Plan next virtual or in-person meeting")
        
        # Add compliance-based actions
        if "feedback" in notes.lower():
            actions.append("Document feedback for product team")
        if "issues" in notes.lower() or "problem" in notes.lower():
            actions.append("Escalate to support team if needed")
        
        return {
            "status": "success",
            "message": f"Generated recommendations for {hcp_name}",
            "data": {
                "hcp_name": hcp_name,
                "recommended_actions": actions,
                "priority": "High" if len(actions) > 2 else "Normal"
            }
        }


# ============================================================================
# TOOL REGISTRY
# ============================================================================

def get_all_tools(db_session=None) -> Dict[str, Any]:
    """
    Get all available tools
    Returns dict mapping tool names to tool instances
    """
    return {
        "log_interaction": LogInteractionTool(db_session),
        "edit_interaction": EditInteractionTool(db_session),
        "hcp_lookup": HcpLookupTool(db_session),
        "compliance_check": ComplianceCheckTool(db_session),
        "next_best_action": NextBestActionTool(db_session),
    }


def execute_tool(tool_name: str, tool_input: Dict[str, Any], db_session=None) -> Dict[str, Any]:
    """
    Execute a tool by name with given input
    
    Args:
        tool_name: Name of tool to execute
        tool_input: Input parameters for tool
        db_session: Database session for tools that need it
        
    Returns:
        Tool execution result
    """
    tools = get_all_tools(db_session)
    
    if tool_name not in tools:
        return {
            "status": "error",
            "message": f"Tool '{tool_name}' not found",
            "data": None
        }
    
    tool = tools[tool_name]
    
    try:
        return tool.execute(**tool_input)
    except Exception as e:
        return {
            "status": "error",
            "message": f"Tool execution failed: {str(e)}",
            "data": None
        }
