import React, { useState, useEffect } from "react";
import { fetchInteractions, deleteInteraction } from "./api";

/**
 * InteractionList Component
 * Displays aggregated HCP interactions (latest per HCP) in attractive cards
 * Can be used as full-width list or drawer mode
 */
const InteractionList = ({ refreshTrigger, isDrawer = false }) => {
  const [interactions, setInteractions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const loadInteractions = async () => {
    setIsLoading(true);
    setErrorMessage("");

    try {
      const response = await fetchInteractions(100, 0);
      const allInteractions = response.interactions || [];
      
      // Aggregate interactions: keep only latest per HCP name
      const aggregated = {};
      allInteractions.forEach((interaction) => {
        const hcpName = interaction.hcp_name;
        if (!aggregated[hcpName] || 
            new Date(interaction.created_at) > new Date(aggregated[hcpName].created_at)) {
          aggregated[hcpName] = interaction;
        }
      });
      
      // Convert to array and sort by creation date (newest first)
      const aggregatedList = Object.values(aggregated).sort(
        (a, b) => new Date(b.created_at) - new Date(a.created_at)
      );
      
      setInteractions(aggregatedList);
    } catch (error) {
      setErrorMessage("Failed to load interactions. Please try again.");
      console.error("Error loading interactions:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadInteractions();
  }, []);

  useEffect(() => {
    if (refreshTrigger) {
      loadInteractions();
    }
  }, [refreshTrigger]);

  const handleDeleteInteraction = async (id) => {
    try {
      await deleteInteraction(id);
      // Remove from state
      setInteractions(interactions.filter(i => i.id !== id));
      setDeleteConfirm(null);
      loadInteractions(); // Refresh to ensure consistency
    } catch (error) {
      console.error("Error deleting interaction:", error);
      setErrorMessage(error.message || "Error deleting interaction");
    }
  };

  const getSentimentEmoji = (sentiment) => {
    switch (sentiment) {
      case "Positive":
        return "👍";
      case "Negative":
        return "👎";
      default:
        return "😐";
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case "Meeting":
        return "📋";
      case "Visit":
        return "🏥";
      case "Call":
        return "☎️";
      case "Virtual":
        return "💻";
      default:
        return "📝";
    }
  };

  return (
    <div className="interactions-container">
      {errorMessage && <div className="alert alert-error">{errorMessage}</div>}

      {isLoading ? (
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Loading interactions...</p>
        </div>
      ) : interactions.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📭</div>
          <h3>No interactions yet</h3>
          <p>Use the AI Assistant to log your first interaction</p>
        </div>
      ) : (
        <div className="interactions-grid">
          {interactions.map((interaction) => (
            <div key={interaction.id} className="interaction-card-attractive">
              {/* Header with HCP Name and Type */}
              <div className="card-header-section">
                <div className="hcp-info">
                  <div className="type-badge">
                    {getTypeIcon(interaction.interaction_type)} {interaction.interaction_type}
                  </div>
                  <h3 className="hcp-name">{interaction.hcp_name}</h3>
                </div>
                <div className="sentiment-badge">
                  {getSentimentEmoji(interaction.hcp_sentiment)} {interaction.hcp_sentiment}
                </div>
              </div>

              {/* Date and Time */}
              <div className="card-meta-row">
                {interaction.date && (
                  <div className="meta-item">
                    <span className="meta-icon">📅</span>
                    <span className="meta-label">Date</span>
                    <span className="meta-value">{interaction.date}</span>
                  </div>
                )}
                {interaction.time && (
                  <div className="meta-item">
                    <span className="meta-icon">⏰</span>
                    <span className="meta-label">Time</span>
                    <span className="meta-value">{interaction.time}</span>
                  </div>
                )}
              </div>

              {/* Attendees */}
              {interaction.attendees && (
                <div className="card-field">
                  <div className="field-label">👥 Attendees</div>
                  <div className="field-value">{interaction.attendees}</div>
                </div>
              )}

              {/* Topics Discussed */}
              {interaction.topics_discussed && (
                <div className="card-field">
                  <div className="field-label">💬 Topics Discussed</div>
                  <div className="field-value">{interaction.topics_discussed}</div>
                </div>
              )}

              {/* Materials Shared */}
              {interaction.materials_shared && (
                <div className="card-field">
                  <div className="field-label">📄 Materials Shared</div>
                  <div className="field-value">{interaction.materials_shared}</div>
                </div>
              )}

              {/* Samples Distributed */}
              {interaction.samples_distributed && (
                <div className="card-field">
                  <div className="field-label">📦 Samples Distributed</div>
                  <div className="field-value">{interaction.samples_distributed}</div>
                </div>
              )}

              {/* Outcomes */}
              {interaction.outcomes && (
                <div className="card-field">
                  <div className="field-label">🎯 Outcomes</div>
                  <div className="field-value">{interaction.outcomes}</div>
                </div>
              )}

              {/* Follow-up Actions */}
              {interaction.follow_up_actions && (
                <div className="card-field">
                  <div className="field-label">📌 Follow-up Actions</div>
                  <div className="field-value">{interaction.follow_up_actions}</div>
                </div>
              )}

              {/* Additional Notes */}
              {interaction.notes && (
                <div className="card-field">
                  <div className="field-label">📝 Notes</div>
                  <div className="field-value">{interaction.notes}</div>
                </div>
              )}

              {/* Footer with ID, Timestamp, and Delete Button */}
              <div className="card-footer">
                <div className="footer-info">
                  <small className="card-id">ID: {interaction.id}</small>
                  <small className="card-timestamp">
                    {new Date(interaction.created_at).toLocaleString()}
                  </small>
                </div>
                <button
                  className="btn-delete"
                  onClick={() => setDeleteConfirm(interaction.id)}
                  title="Delete this interaction"
                >
                  🗑️ Delete
                </button>
              </div>

              {/* Delete Confirmation Modal */}
              {deleteConfirm === interaction.id && (
                <div className="delete-confirmation">
                  <p>Delete this interaction?</p>
                  <div className="confirmation-buttons">
                    <button
                      className="btn-confirm-delete"
                      onClick={() => handleDeleteInteraction(interaction.id)}
                    >
                      ✓ Confirm
                    </button>
                    <button
                      className="btn-cancel-delete"
                      onClick={() => setDeleteConfirm(null)}
                    >
                      ✕ Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default InteractionList;
