import React, { useState } from "react";
import LogInteraction from "./LogInteraction";
import ChatInteraction from "./ChatInteraction";
import InteractionList from "./InteractionList";
import "./styles.css";

/**
 * Main App Component
 * Modern CRM with form and AI chat side-by-side
 */
function App() {
  const [refreshInteractions, setRefreshInteractions] = useState(false);
  const [extractedData, setExtractedData] = useState(null);
  const [historyOpen, setHistoryOpen] = useState(false);

  const handleInteractionSaved = () => {
    setRefreshInteractions((prev) => !prev);
    setExtractedData(null); // Clear extracted data after saving
  };

  const handleDataExtracted = (data) => {
    setExtractedData(data);
  };

  return (
    <div className="app-container">
      <header className="app-header">
        <div className="header-content">
          <h1 className="app-title">Log HCP Interaction</h1>
          {/* History Toggle Button */}
          <button 
            className="history-toggle-btn"
            onClick={() => setHistoryOpen(!historyOpen)}
            title="View Interaction History"
          >
            📋 History
          </button>
        </div>
      </header>

      <main className="app-main">
        <div className="container">
          {/* Main Content Grid - Form and AI Chat */}
          <div className="content-grid-modern">
            {/* Left Side: Interaction Details Form */}
            <section className="form-section-modern">
              <div className="card-modern">
                <div className="card-header-modern">
                  <h2>Interaction Details</h2>
                </div>
                <div className="card-body-modern">
                  <LogInteraction 
                    onSuccess={handleInteractionSaved} 
                    extractedData={extractedData}
                    onDataUsed={() => setExtractedData(null)}
                  />
                </div>
              </div>
            </section>

            {/* Right Side: AI Assistant Chat */}
            <section className="chat-section-modern">
              <div className="card-modern">
                <div className="card-header-modern">
                  <span className="ai-badge">🤖 AI Assistant</span>
                  <p className="card-subtitle-modern">Log interaction via chat</p>
                </div>
                <div className="card-body-modern">
                  <ChatInteraction 
                    onSuccess={handleInteractionSaved}
                    onDataExtracted={handleDataExtracted}
                  />
                </div>
              </div>
            </section>
          </div>
        </div>
      </main>

      {/* History Drawer Modal */}
      {historyOpen && (
        <div className="history-overlay" onClick={() => setHistoryOpen(false)}>
          <div className="history-drawer" onClick={(e) => e.stopPropagation()}>
            <div className="history-drawer-header">
              <h3>Interaction History</h3>
              <button 
                className="history-close-btn"
                onClick={() => setHistoryOpen(false)}
              >
                ✕
              </button>
            </div>
            <div className="history-drawer-content">
              <InteractionList 
                refreshTrigger={refreshInteractions}
                isDrawer={true}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
