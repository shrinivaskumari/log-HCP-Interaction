import React, { useState, useEffect } from "react";
import { createInteraction } from "./api";

/**
 * LogInteraction Component
 * Modern form design with comprehensive fields
 */
function LogInteraction({ onSuccess, extractedData, onDataUsed }) {
  const [formData, setFormData] = useState({
    hcp_name: "",
    interaction_type: "Meeting",
    date: new Date().toISOString().split("T")[0],
    time: new Date().toTimeString().split(" ")[0].substring(0, 5),
    attendees: "",
    topics_discussed: "",
    materials_shared: "",
    samples_distributed: "",
    hcp_sentiment: "Neutral",
    outcomes: "",
    follow_up_actions: "",
    notes: "",
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  // Populate form when AI extracts data
  useEffect(() => {
    if (extractedData) {
      setFormData((prev) => ({
        ...prev,
        hcp_name: extractedData.hcp_name || prev.hcp_name,
        interaction_type: extractedData.interaction_type || prev.interaction_type,
        date: extractedData.date || prev.date,
        time: extractedData.time || prev.time,
        attendees: extractedData.attendees || prev.attendees,
        topics_discussed: extractedData.topics_discussed || prev.topics_discussed,
        materials_shared: extractedData.materials_shared || prev.materials_shared,
        samples_distributed: extractedData.samples_distributed || prev.samples_distributed,
        hcp_sentiment: extractedData.hcp_sentiment || prev.hcp_sentiment,
        outcomes: extractedData.outcomes || prev.outcomes,
        follow_up_actions: extractedData.follow_up_actions || prev.follow_up_actions,
        notes: extractedData.notes || prev.notes,
      }));
      
      if (onDataUsed) {
        onDataUsed();
      }
    }
  }, [extractedData, onDataUsed]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Only HCP Name, Date, and Time are required
    if (!formData.hcp_name.trim()) {
      newErrors.hcp_name = "HCP Name is required";
    }
    if (!formData.date) {
      newErrors.date = "Date is required";
    }
    if (!formData.time) {
      newErrors.time = "Time is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setSuccessMessage("");

    try {
      const result = await createInteraction(formData);
      setSuccessMessage(`✓ Interaction logged successfully`);

      // Reset form
      setFormData({
        hcp_name: "",
        interaction_type: "Meeting",
        date: new Date().toISOString().split("T")[0],
        time: new Date().toTimeString().split(" ")[0].substring(0, 5),
        attendees: "",
        topics_discussed: "",
        materials_shared: "",
        samples_distributed: "",
        hcp_sentiment: "Neutral",
        outcomes: "",
        follow_up_actions: "",
        notes: "",
      });

      if (onSuccess) {
        onSuccess();
      }

      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (error) {
      setErrors({
        submit: error.message || "Failed to create interaction",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="modern-form">
      {successMessage && (
        <div className="success-alert">{successMessage}</div>
      )}
      {errors.submit && <div className="error-alert">{errors.submit}</div>}

      {/* HCP Name */}
      <div className="form-field">
        <label htmlFor="hcp_name">HCP Name</label>
        <input
          id="hcp_name"
          type="text"
          name="hcp_name"
          value={formData.hcp_name}
          onChange={handleChange}
          placeholder="Search or select HCP..."
          className={`modern-input ${errors.hcp_name ? "error" : ""}`}
          disabled={isLoading}
        />
        {errors.hcp_name && (
          <span className="error-text">{errors.hcp_name}</span>
        )}
      </div>

      {/* Interaction Type and Date/Time Row */}
      <div className="form-row-split">
        <div className="form-field">
          <label htmlFor="interaction_type">Interaction Type</label>
          <select
            id="interaction_type"
            name="interaction_type"
            value={formData.interaction_type}
            onChange={handleChange}
            className="modern-select"
            disabled={isLoading}
          >
            <option value="Meeting">Meeting</option>
            <option value="Visit">Visit</option>
            <option value="Call">Call</option>
            <option value="Virtual">Virtual</option>
          </select>
        </div>
      </div>

      <div className="form-row-split">
        <div className="form-field">
          <label htmlFor="date">Date</label>
          <input
            id="date"
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            className={`modern-input ${errors.date ? "error" : ""}`}
            disabled={isLoading}
          />
          {errors.date && <span className="error-text">{errors.date}</span>}
        </div>

        <div className="form-field">
          <label htmlFor="time">Time</label>
          <input
            id="time"
            type="time"
            name="time"
            value={formData.time}
            onChange={handleChange}
            className={`modern-input ${errors.time ? "error" : ""}`}
            disabled={isLoading}
          />
          {errors.time && <span className="error-text">{errors.time}</span>}
        </div>
      </div>

      {/* Attendees */}
      <div className="form-field">
        <label htmlFor="attendees">Attendees</label>
        <input
          id="attendees"
          type="text"
          name="attendees"
          value={formData.attendees}
          onChange={handleChange}
          placeholder="Enter names or search..."
          className={`modern-input ${errors.attendees ? "error" : ""}`}
          disabled={isLoading}
        />
        {errors.attendees && (
          <span className="error-text">{errors.attendees}</span>
        )}
      </div>

      {/* Topics Discussed */}
      <div className="form-field">
        <label htmlFor="topics_discussed">Topics Discussed</label>
        <textarea
          id="topics_discussed"
          name="topics_discussed"
          value={formData.topics_discussed}
          onChange={handleChange}
          placeholder="Enter key discussion points..."
          className={`modern-textarea ${errors.topics_discussed ? "error" : ""}`}
          rows="3"
          disabled={isLoading}
        />
        {errors.topics_discussed && (
          <span className="error-text">{errors.topics_discussed}</span>
        )}
        <button type="button" className="voice-note-btn" title="Summarize from Voice Note">
          🎤 Summarize from Voice Note (Requires Consent)
        </button>
      </div>

      {/* Materials Shared / Samples Distributed */}
      <div className="form-section-header">Materials Shared / Samples Distributed</div>
      
      <div className="form-field">
        <label htmlFor="materials_shared">Materials Shared</label>
        <div className="input-with-button">
          <input
            id="materials_shared"
            type="text"
            name="materials_shared"
            value={formData.materials_shared}
            onChange={handleChange}
            placeholder="No materials added"
            className={`modern-input ${errors.materials_shared ? "error" : ""}`}
            disabled={isLoading}
          />
          {errors.materials_shared && (
            <span className="error-text">{errors.materials_shared}</span>
          )}
          <button type="button" className="search-add-btn">
            🔍 Search/Add
          </button>
        </div>
      </div>

      <div className="form-field">
        <label htmlFor="samples_distributed">Samples Distributed</label>
        <div className="input-with-button">
          <input
            id="samples_distributed"
            type="text"
            name="samples_distributed"
            value={formData.samples_distributed}
            onChange={handleChange}
            placeholder="No samples added"
            className={`modern-input ${errors.samples_distributed ? "error" : ""}`}
            disabled={isLoading}
          />
          {errors.samples_distributed && (
            <span className="error-text">{errors.samples_distributed}</span>
          )}
          <button type="button" className="search-add-btn">
            ➕ Add Sample
          </button>
        </div>
      </div>

      {/* HCP Sentiment */}
      <div className="form-field">
        <label>Observed/Inferred HCP Sentiment</label>
        <div className="sentiment-radio-group">
          <label className="radio-option">
            <input
              type="radio"
              name="hcp_sentiment"
              value="Positive"
              checked={formData.hcp_sentiment === "Positive"}
              onChange={handleChange}
              disabled={isLoading}
            />
            <span>Positive</span>
          </label>
          <label className="radio-option">
            <input
              type="radio"
              name="hcp_sentiment"
              value="Neutral"
              checked={formData.hcp_sentiment === "Neutral"}
              onChange={handleChange}
              disabled={isLoading}
            />
            <span>Neutral</span>
          </label>
          <label className="radio-option">
            <input
              type="radio"
              name="hcp_sentiment"
              value="Negative"
              checked={formData.hcp_sentiment === "Negative"}
              onChange={handleChange}
              disabled={isLoading}
            />
            <span>Negative</span>
          </label>
        </div>
      </div>

      {/* Outcomes */}
      <div className="form-field">
        <label htmlFor="outcomes">Outcomes</label>
        <textarea
          id="outcomes"
          name="outcomes"
          value={formData.outcomes}
          onChange={handleChange}
          placeholder="Key outcomes or agreements..."
          className={`modern-textarea ${errors.outcomes ? "error" : ""}`}
          rows="2"
          disabled={isLoading}
        />
        {errors.outcomes && (
          <span className="error-text">{errors.outcomes}</span>
        )}
      </div>

      {/* Follow-up Actions */}
      <div className="form-field">
        <label htmlFor="follow_up_actions">Follow-up Actions</label>
        <textarea
          id="follow_up_actions"
          name="follow_up_actions"
          value={formData.follow_up_actions}
          onChange={handleChange}
          placeholder="Enter next steps or tasks..."
          className={`modern-textarea ${errors.follow_up_actions ? "error" : ""}`}
          rows="2"
          disabled={isLoading}
        />
        {errors.follow_up_actions && (
          <span className="error-text">{errors.follow_up_actions}</span>
        )}
      </div>

      {/* Additional Notes */}
      <div className="form-field">
        <label htmlFor="notes">Additional Notes</label>
        <textarea
          id="notes"
          name="notes"
          value={formData.notes}
          onChange={handleChange}
          placeholder="Any additional notes or observations..."
          className={`modern-textarea ${errors.notes ? "error" : ""}`}
          rows="2"
          disabled={isLoading}
        />
        {errors.notes && (
          <span className="error-text">{errors.notes}</span>
        )}
      </div>

      {/* AI Suggested Follow-ups */}
      <div className="ai-suggestions">
        <div className="suggestions-header">AI Suggested Follow-ups:</div>
        <ul className="suggestions-list">
          <li>Schedule follow-up meeting in 2 weeks</li>
          <li>Send OncoBoost Phase III PDF</li>
          <li>Add Dr. Sharma to advisory board invite list</li>
        </ul>
      </div>

      <button
        type="submit"
        className="btn-submit-modern"
        disabled={isLoading}
      >
        {isLoading ? "Saving..." : "Save Interaction"}
      </button>
    </form>
  );
}

export default LogInteraction;
