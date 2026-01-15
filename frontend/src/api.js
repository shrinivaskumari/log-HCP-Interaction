/**
 * API Service Module
 * Handles all communication with the FastAPI backend
 * Includes both traditional endpoints and AI-powered endpoints
 */

const API_BASE_URL = "http://localhost:8000";

/**
 * Create a new HCP interaction
 * @param {Object} interactionData - The interaction data
 * @param {string} interactionData.hcp_name - Name of the healthcare professional
 * @param {string} interactionData.interaction_type - Type of interaction (Visit, Call, Virtual)
 * @param {string} interactionData.notes - Notes about the interaction
 * @returns {Promise<Object>} The created interaction with ID and timestamp
 */
export const createInteraction = async (interactionData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/interactions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(interactionData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || "Failed to create interaction");
    }

    return await response.json();
  } catch (error) {
    console.error("Error creating interaction:", error);
    throw error;
  }
};

/**
 * Fetch all HCP interactions
 * @param {number} limit - Number of records to fetch (default 50)
 * @param {number} offset - Number of records to skip (default 0)
 * @returns {Promise<Object>} List of interactions with count
 */
export const fetchInteractions = async (limit = 50, offset = 0) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/interactions?limit=${limit}&offset=${offset}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch interactions");
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching interactions:", error);
    throw error;
  }
};

/**
 * Fetch a specific interaction by ID
 * @param {number} interactionId - The ID of the interaction
 * @returns {Promise<Object>} The interaction details
 */
export const fetchInteractionById = async (interactionId) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/interactions/${interactionId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch interaction");
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching interaction:", error);
    throw error;
  }
};

/**
 * AI Chat - Process interaction description through LangGraph agent
 * Uses Groq LLM (gemma2-9b-it) to extract structured data from conversation
 * @param {string} userMessage - User's description of the interaction
 * @returns {Promise<Object>} Extracted interaction data and tool results
 */
export const aiChat = async (userMessage) => {
  try {
    const response = await fetch(`${API_BASE_URL}/ai/chat`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user_message: userMessage,
      }),
    });

    if (!response.ok) {
      let errorMsg = "AI processing failed";
      try {
        const error = await response.json();
        errorMsg = error.detail || error.message || errorMsg;
      } catch (e) {
        errorMsg = `Server error (${response.status})`;
      }
      throw new Error(errorMsg);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error in AI chat:", error);
    throw error;
  }
};

/**
 * Confirm and save AI-extracted interaction to database
 * User reviews the LLM-extracted data and confirms before saving
 * @param {Object} interactionData - Confirmed interaction data
 * @param {string} interactionData.hcp_name - HCP name
 * @param {string} interactionData.interaction_type - Interaction type
 * @param {string} interactionData.notes - Interaction notes
 * @returns {Promise<Object>} Saved interaction with ID
 */
export const confirmAndSave = async (interactionData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/ai/chat/confirm`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(interactionData),
    });

    if (!response.ok) {
      let errorMsg = "Failed to save interaction";
      try {
        const error = await response.json();
        errorMsg = error.detail || error.message || errorMsg;
      } catch (e) {
        errorMsg = `Server error (${response.status})`;
      }
      throw new Error(errorMsg);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error confirming interaction:", error);
    throw error;
  }
};

/**
 * Delete an interaction by ID
 * @param {number} interactionId - The ID of the interaction to delete
 * @returns {Promise<void>}
 */
export const deleteInteraction = async (interactionId) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/interactions/${interactionId}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      let errorMsg = "Failed to delete interaction";
      try {
        const error = await response.json();
        errorMsg = error.detail || error.message || errorMsg;
      } catch (e) {
        errorMsg = `Server error (${response.status})`;
      }
      throw new Error(errorMsg);
    }

    return true;
  } catch (error) {
    console.error("Error deleting interaction:", error);
    throw error;
  }
};
