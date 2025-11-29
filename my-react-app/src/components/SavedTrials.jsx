// src/components/SavedTrials.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./SavedTrials.css";

const SAVED_TRIALS_KEY = "saved_trials_v1";

const getTrialKey = (trial) => {
  if (trial.nct_id) return `nct:${trial.nct_id}`;
  if (trial.url) return `url:${trial.url}`;
  return `title:${trial.title || "unknown"}`;
};

const SavedTrials = () => {
  const navigate = useNavigate();
  const [trials, setTrials] = useState([]);

  // load saved trials
  useEffect(() => {
    try {
      const raw = localStorage.getItem(SAVED_TRIALS_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        setTrials(parsed);
      }
    } catch {
      // ignore parse errors
    }
  }, []);

  const handleRemove = (trial) => {
    setTrials((prev) => {
      const key = getTrialKey(trial);
      const updated = prev.filter((t) => getTrialKey(t) !== key);
      localStorage.setItem(SAVED_TRIALS_KEY, JSON.stringify(updated));
      return updated;
    });
  };

  return (
    <div className="saved-container">
      {/* === Top Navigation === */}
      <header className="nav-header">
        <div className="nav-left">
          <div className="logo-icon-circle">AI</div>
          <h2 className="logo-text">AI Clinical Trial Matchmaker</h2>
        </div>

        <nav className="nav-right">
          <button onClick={() => navigate("/home")}>Home</button>
          <button onClick={() => navigate("/search")}>Search</button>
          <button onClick={() => navigate("/profile")}>Profile</button>
          <button className="active">Saved</button>
        </nav>
      </header>

      {/* === Page Content === */}
      <main className="saved-content">
        <h2 className="page-title">Saved Clinical Trials</h2>

        {trials.length === 0 ? (
          <p className="empty-message">
            You have not saved any trials yet. Go to Search and tap "Save trial" to bookmark.
          </p>
        ) : (
          <>
            <div className="trials-grid">
              {trials.map((trial, index) => (
                <div key={index} className="trial-card">
                  <h4>{trial.title || "Untitled trial"}</h4>
                  <p className="trial-meta">
                    <strong>Status:</strong> {trial.status || "N/A"} <br />
                    <strong>Sponsor:</strong> {trial.sponsor || "N/A"} <br />
                    <strong>Location:</strong>{" "}
                    {trial.location ||
                      [trial.city, trial.state, trial.country]
                        .filter(Boolean)
                        .join(", ") ||
                      "N/A"}
                  </p>

                  {trial.summary && (
                    <p className="trial-summary">
                      {trial.summary.length > 220
                        ? trial.summary.slice(0, 220).trim() + "..."
                        : trial.summary}
                    </p>
                  )}

                  <div className="trial-actions">
                    {trial.url && (
                      <a
                        href={trial.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="view-btn"
                      >
                        Open Trial
                      </a>
                    )}
                    {trial.google_maps_url && (
                      <a
                        href={trial.google_maps_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="view-btn"
                      >
                        Open Maps
                      </a>
                    )}
                    <button
                      className="remove-btn"
                      onClick={() => handleRemove(trial)}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        <button className="back-btn" onClick={() => navigate("/search")}>
          Back to Search
        </button>
      </main>

      {/* === Footer === */}
      <footer className="footer">
        <div className="footer-links">
          <a href="#contact">Contact Us</a>
          <a href="#privacy">Privacy Policy</a>
          <a href="#terms">Terms of Service</a>
        </div>
        <p>© 2025 AI Clinical Trial Matchmaker</p>
      </footer>
    </div>
  );
};

export default SavedTrials;
