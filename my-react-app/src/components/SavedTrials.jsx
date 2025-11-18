import React from "react";
import { useNavigate } from "react-router-dom";
import "./SavedTrials.css";

const SavedTrials = () => {
  const navigate = useNavigate();

  const trials = [
    {
      title: "Trial on New Cancer Drug",
      desc: "Saved to monitor efficacy data.",
    },
    {
      title: "Diabetes Treatment Study",
      desc: "Interested in the novel approach.",
    },
    {
      title: "Alzheimer's Disease Research",
      desc: "Potential breakthrough in treatment.",
    },
  ];

  return (
    <div className="saved-container">
      {/* === Top Navigation === */}
      <header className="nav-header">
        <div className="nav-left">
          <span className="logo-icon">🧪</span>
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

        <div className="trials-grid">
          {trials.map((trial, index) => (
            <div key={index} className="trial-card">
              <h4>{trial.title}</h4>
              <p>{trial.desc}</p>
              <button className="remove-btn">Remove</button>
            </div>
          ))}
        </div>

        <button className="back-btn" onClick={() => navigate("/search")}>
          Back to Search
        </button>
      </main>

      {/* === Footer === */}
      <footer className="footer">
        <div className="footer-links">
          <a href="#">Contact Us</a>
          <a href="#">Privacy Policy</a>
          <a href="#">Terms of Service</a>
        </div>
        <p>© 2025 AI Clinical Trial Matchmaker</p>
      </footer>
    </div>
  );
};

export default SavedTrials;
