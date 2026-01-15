import React, { useState } from "react";
import { aiChat, confirmAndSave } from "./api";

/**
 * ChatInteraction Component
 * AI-powered conversational interaction logging using LangGraph
 */
const ChatInteraction = ({ onSuccess, onDataExtracted }) => {
  const [chatMessages, setChatMessages] = useState([
    {
      type: "assistant",
      content:
        "Hi! I can help you log an HCP interaction. Just describe your meeting or call in natural language, and I'll extract the details for you.",
    },
  ]);

  const [userInput, setUserInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [extractedData, setExtractedData] = useState(null);
  const [showConfirmation, setShowConfirmation] = useState(false);

  const handleSendMessage = async (e) => {
    e.preventDefault();

    if (!userInput.trim()) return;

    // Add user message to chat
    const userMessage = { type: "user", content: userInput };
    setChatMessages((prev) => [...prev, userMessage]);

    setIsLoading(true);
    setUserInput("");

    try {
      // Call AI endpoint
      const response = await aiChat(userInput);

      // Add assistant response
      if (response.status === "success" && response.extracted_interaction) {
        setChatMessages((prev) => [
          ...prev,
          {
            type: "assistant",
            content: `✓ I've extracted the interaction data and filled the form on the left. Please review and edit if needed, then click "Save Interaction".
            
• HCP: ${response.extracted_interaction.hcp_name}
• Type: ${response.extracted_interaction.interaction_type}
• Notes: ${response.extracted_interaction.notes}`,
          },
        ]);

        setExtractedData(response.extracted_interaction);
        setShowConfirmation(false);

        // Send data to form
        if (onDataExtracted) {
          onDataExtracted(response.extracted_interaction);
        }

        // Show compliance checks if any
        if (response.tool_results && response.tool_results.length > 0) {
          const toolMessages = response.tool_results
            .map((t) => `${t.tool}: ${JSON.stringify(t.result)}`)
            .join("\n");
          setChatMessages((prev) => [
            ...prev,
            {
              type: "assistant",
              content: `Tool Results:\n${toolMessages}`,
            },
          ]);
        }
      } else if (response.status === "incomplete") {
        setChatMessages((prev) => [
          ...prev,
          {
            type: "assistant",
            content:
              response.message ||
              "I need more details. Could you provide more information about the interaction?",
          },
        ]);
      } else {
        setChatMessages((prev) => [
          ...prev,
          {
            type: "assistant",
            content:
              response.message || "Sorry, I couldn't process that. Please try again.",
          },
        ]);
      }
    } catch (error) {
      setChatMessages((prev) => [
        ...prev,
        {
          type: "assistant",
          content: `Error: ${error.message}. Please try again.`,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleConfirmAndSave = async () => {
    if (!extractedData) return;

    setIsLoading(true);

    try {
      const result = await confirmAndSave(extractedData);

      setChatMessages((prev) => [
        ...prev,
        {
          type: "assistant",
          content: `✓ Interaction saved successfully! (ID: ${result.interaction_id})`,
        },
      ]);

      setShowConfirmation(false);
      setExtractedData(null);

      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      setChatMessages((prev) => [
        ...prev,
        {
          type: "assistant",
          content: `Error saving interaction: ${error.message}`,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (field, value) => {
    setExtractedData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <div className="chat-interaction">
      <div className="chat-header">
        <h2>🤖 AI-Powered Interaction Logger</h2>
        <p className="chat-subtitle">
          Describe your HCP interaction and I'll extract the details
        </p>
      </div>

      {/* Chat Messages */}
      <div className="chat-messages">
        {chatMessages.map((msg, idx) => (
          <div key={idx} className={`chat-message chat-${msg.type}`}>
            {msg.type === "assistant" && <span className="chat-badge">AI</span>}
            <div className="message-content">{msg.content}</div>
          </div>
        ))}
        {isLoading && (
          <div className="chat-message chat-assistant loading">
            <span className="chat-badge">AI</span>
            <div className="message-content">Processing...</div>
          </div>
        )}
      </div>

      {/* Input Area */}
      <form onSubmit={handleSendMessage} className="chat-input-form">
        <input
          type="text"
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          placeholder="Describe your interaction... (e.g., 'I just had a virtual meeting with Dr. Sarah Johnson about our new product launch...')"
          className="chat-input"
          disabled={isLoading}
        />
        <button type="submit" className="chat-send-btn" disabled={isLoading}>
          {isLoading ? "Processing..." : "Send"}
        </button>
      </form>
    </div>
  );
};

export default ChatInteraction;
