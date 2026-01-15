"""
LangGraph Agent for AI-Powered HCP Interaction Processing
Orchestrates conversation flow, calls LLM, invokes tools, and manages state
"""

import json
from typing import Dict, Any, Annotated, TypedDict, Optional
from langchain_groq import ChatGroq
from langchain_core.messages import BaseMessage, HumanMessage, AIMessage, ToolMessage
from langgraph.graph import StateGraph, END
import os

from app.ai.tools import (
    LogInteractionTool,
    EditInteractionTool,
    HcpLookupTool,
    ComplianceCheckTool,
    NextBestActionTool,
    execute_tool
)


# ============================================================================
# STATE DEFINITION
# ============================================================================

class AgentState(TypedDict):
    """LangGraph agent state - maintained across all nodes"""
    messages: Annotated[list[BaseMessage], lambda x, y: x + y]
    conversation_history: list[Dict[str, str]]
    extracted_interaction: Optional[Dict[str, Any]]
    tool_calls: list[Dict[str, Any]]
    final_result: Optional[Dict[str, Any]]


# ============================================================================
# LANGGRAPH AGENT SETUP
# ============================================================================

class HCPInteractionAgent:
    """
    LangGraph-based agent for processing HCP interactions
    Uses Groq LLM (gemma2-9b-it) to understand conversation and invoke tools
    """
    
    def __init__(self, groq_api_key: Optional[str] = None):
        """
        Initialize the agent
        
        Args:
            groq_api_key: Groq API key (uses env variable if not provided)
        """
        self.groq_api_key = groq_api_key or os.getenv("GROQ_API_KEY")
        
        if not self.groq_api_key:
            raise ValueError("GROQ_API_KEY environment variable not set")
        
        # Initialize Groq LLM with llama-3.3-70b-versatile
        self.llm = ChatGroq(
            model="llama-3.3-70b-versatile",
            temperature=0.1,  # Low temperature for structured output
            groq_api_key=self.groq_api_key,
            max_tokens=2048
        )
        
        # Initialize tools
        self.tools = {
            "log_interaction": LogInteractionTool(),
            "edit_interaction": EditInteractionTool(),
            "hcp_lookup": HcpLookupTool(),
            "compliance_check": ComplianceCheckTool(),
            "next_best_action": NextBestActionTool(),
        }
        
        # Build LangGraph
        self.graph = self._build_graph()
    
    def _build_graph(self):
        """Build LangGraph workflow"""
        workflow = StateGraph(AgentState)
        
        # Define nodes
        workflow.add_node("receive_input", self._receive_input)
        workflow.add_node("process_with_llm", self._process_with_llm)
        workflow.add_node("invoke_tools", self._invoke_tools)
        workflow.add_node("generate_response", self._generate_response)
        
        # Define edges
        workflow.set_entry_point("receive_input")
        workflow.add_edge("receive_input", "process_with_llm")
        workflow.add_edge("process_with_llm", "invoke_tools")
        workflow.add_edge("invoke_tools", "generate_response")
        workflow.add_edge("generate_response", END)
        
        return workflow.compile()
    
    def _receive_input(self, state: AgentState) -> AgentState:
        """
        NODE 1: Receive and validate user input
        """
        # Input is already in messages
        return state
    
    def _process_with_llm(self, state: AgentState) -> AgentState:
        """
        NODE 2: Use Groq LLM to analyze conversation
        
        The LLM will:
        1. Understand the user's intent (e.g., "I just met with Dr. Smith...")
        2. Extract relevant information
        3. Decide which tools to call
        4. Return tool calls and structured data
        """
        messages = state["messages"]
        
        # System prompt for the agent
        system_prompt = """You are an AI assistant for healthcare CRM interactions. 
Your job is to:
1. Understand user descriptions of HCP meetings/calls
2. Extract: HCP name, interaction type (Visit/Call/Virtual), and key notes
3. Decide which tools to use from: log_interaction, edit_interaction, hcp_lookup, compliance_check, next_best_action
4. Return a JSON response with extracted data

When user describes an interaction, respond with:
{
    "understanding": "brief summary of what happened",
    "extracted_data": {
        "hcp_name": "name extracted",
        "interaction_type": "Visit/Call/Virtual",
        "notes": "key points summarized"
    },
    "tools_to_call": [
        {"name": "compliance_check", "input": {"text": "notes"}},
        {"name": "next_best_action", "input": {"hcp_name": "...", "interaction_type": "...", "notes": "..."}}
    ]
}"""
        
        # Call LLM
        response = self.llm.invoke(
            messages + [{"role": "system", "content": system_prompt}]
        )
        
        # Update messages
        new_messages = messages + [response]
        
        # Try to extract tool calls from LLM response
        tool_calls = []
        try:
            content = response.content
            # Simple parsing - in production, use structured output
            if "{" in content:
                json_str = content[content.find("{"):content.rfind("}")+1]
                parsed = json.loads(json_str)
                
                if "extracted_data" in parsed:
                    state["extracted_interaction"] = parsed["extracted_data"]
                
                if "tools_to_call" in parsed:
                    tool_calls = parsed["tools_to_call"]
        except:
            pass
        
        return {
            **state,
            "messages": new_messages,
            "tool_calls": tool_calls
        }
    
    def _invoke_tools(self, state: AgentState) -> AgentState:
        """
        NODE 3: Execute tools based on LLM recommendations
        
        This is where the 5 tools are actually called:
        - log_interaction: Extract and structure interaction data
        - edit_interaction: Modify interactions
        - hcp_lookup: Search for existing HCPs
        - compliance_check: Validate compliance
        - next_best_action: Suggest follow-ups
        """
        tool_calls = state.get("tool_calls", [])
        tool_results = []
        
        for tool_call in tool_calls:
            tool_name = tool_call.get("name")
            tool_input = tool_call.get("input", {})
            
            # Execute the tool
            result = execute_tool(tool_name, tool_input)
            tool_results.append({
                "tool": tool_name,
                "input": tool_input,
                "result": result
            })
        
        # Add tool messages
        new_messages = state["messages"]
        if tool_results:
            tool_message = ToolMessage(
                content=json.dumps(tool_results),
                tool_call_id="hcp-tools"
            )
            new_messages = new_messages + [tool_message]
        
        return {
            **state,
            "messages": new_messages,
            "tool_calls": tool_results
        }
    
    def _generate_response(self, state: AgentState) -> AgentState:
        """
        NODE 4: Generate final response with extracted data
        
        Returns structured interaction data ready for database insertion
        """
        # Compile final result from extracted interaction
        final_result = {
            "status": "success",
            "extracted_interaction": state.get("extracted_interaction"),
            "tool_results": state.get("tool_calls", []),
            "conversation_steps": len(state["messages"])
        }
        
        return {
            **state,
            "final_result": final_result
        }
    
    def process_conversation(self, user_input: str) -> Dict[str, Any]:
        """
        Main entry point: Process user input through the graph
        
        Args:
            user_input: User's description of the interaction
            
        Returns:
            Structured result with extracted interaction data
        """
        # Initialize state
        initial_state: AgentState = {
            "messages": [HumanMessage(content=user_input)],
            "conversation_history": [],
            "extracted_interaction": None,
            "tool_calls": [],
            "final_result": None
        }
        
        # Run graph
        final_state = self.graph.invoke(initial_state)
        
        return final_state.get("final_result", {})


# ============================================================================
# AGENT INITIALIZATION
# ============================================================================

# Global agent instance
_agent_instance: Optional[HCPInteractionAgent] = None


def get_agent() -> HCPInteractionAgent:
    """
    Get or create global agent instance
    Uses lazy initialization
    """
    global _agent_instance
    
    if _agent_instance is None:
        _agent_instance = HCPInteractionAgent()
    
    return _agent_instance


def reset_agent():
    """Reset the global agent instance"""
    global _agent_instance
    _agent_instance = None
