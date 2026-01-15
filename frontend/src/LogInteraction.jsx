import React, { useState } from "react";
import { createInteraction } from "./api";

/**
 * LogInteraction Component
 * Form to log new HCP interactions
 */
const LogInteraction = ({ onSuccess }) => {
  const [formData, setFormData] = useState({
    hcp_name: "",
    interaction_type: "Visit",
    notes: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const interactionTypes = ["Visit", "Call", "Virtual"];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setSuccessMessage("");
    setErrorMessage("");

    try {
      // Validate required fields
      if (!formData.hcp_name.trim()) {
        setErrorMessage("HCP Name is required");
        setIsLoading(false);
        return;
      }

      // Call API to create interaction
      const result = await createInteraction(formData);

      // Show success message
      setSuccessMessage(`✓ Interaction logged successfully! (ID: ${result.id})`);

      // Reset form
      setFormData({
        hcp_name: "",
        interaction_type: "Visit",
        notes: "",
      });

      // Notify parent component to refresh interactions list
      if (onSuccess) {
        onSuccess();
      }

      // Clear success message after 4 seconds
      setTimeout(() => setSuccessMessage(""), 4000);
    } catch (error) {
      setErrorMessage(`Error: ${error.message}`);
      console.error("Form submission error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form className="log-interaction-form" onSubmit={handleSubmit}>
      <div className="form-group">
        <label htmlFor="hcp_name" className="form-label">
          HCP Name <span className="required">*</span>
        </label>
        <input
          id="hcp_name"
          type="text"
          name="hcp_name"
          value={formData.hcp_name}
          onChange={handleInputChange}
          placeholder="Enter healthcare professional name"
          className="form-input"
          disabled={isLoading}
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="interaction_type" className="form-label">
          Interaction Type <span className="required">*</span>
        </label>
        <select
          id="interaction_type"
          name="interaction_type"
          value={formData.interaction_type}
          onChange={handleInputChange}
          className="form-input"
          disabled={isLoading}
        >
          {interactionTypes.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
      </div>

      <div className="form-group">
        <label htmlFor="notes" className="form-label">
          Interaction Notes
        </label>
        <textarea
          id="notes"
          name="notes"
          value={formData.notes}
          onChange={handleInputChange}
          placeholder="Enter detailed notes about the interaction (optional)"
          className="form-input form-textarea"
          rows="4"
          disabled={isLoading}
        ></textarea>
      </div>

      {successMessage && (
        <div className="alert alert-success">{successMessage}</div>
      )}

      {errorMessage && <div className="alert alert-error">{errorMessage}</div>}

      <button
        type="submit"
        className="submit-button"
        disabled={isLoading}
      >
        {isLoading ? "Saving..." : "Save Interaction"}
      </button>
    </form>
  );
};

export default LogInteraction;
