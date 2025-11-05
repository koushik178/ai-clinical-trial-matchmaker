import React from "react";
import "./TrialDetails.css";
import { Link } from "react-router-dom";

export default function TrialDetails() {
  return (
    <div className="trial-details-page">
      {/* Top Navbar */}
      <header className="navbar">
        <div className="navbar-left">
          <span className="navbar-logo">🧪</span>
          <h2 className="navbar-title">AI Clinical Trial Matchmaker</h2>
        </div>
        <nav className="navbar-links">
          <Link to="/home" className="nav-item">Home</Link>
          <Link to="/search" className="nav-item">Search</Link>
          <Link to="/profile" className="nav-item">Profile</Link>
          <Link to="/saved" className="nav-item">Saved</Link>
        </nav>
      </header>

      {/* Main content */}
      <main className="trial-details-container">
        <section className="trial-section intro">
          <h3 className="trial-title">
            Trial Name: Innovative Treatment for Diabetes
          </h3>
          <p className="trial-desc">
            This clinical trial aims to explore an innovative treatment for diabetes
            that focuses on balancing insulin levels through natural supplements.
          </p>
        </section>

        <section className="trial-section criteria">
          <h4>Eligibility Criteria</h4>
          <ul>
            <li>Aged between 18 and 65 years</li>
            <li>Diagnosed with Type 2 Diabetes</li>
            <li>No history of cardiovascular complications</li>
            <li>Non-smoker</li>
          </ul>
        </section>

        <section className="trial-section contact">
          <h4>Contact Information</h4>
          <div className="contact-details">
            <p>
              <span className="contact-icon">📞</span> Contact: Dr. Emily Johnson
              <span className="contact-info"> Phone: (123) 456-7890 </span>
              <span className="contact-info">
                Email:{" "}
                <a href="mailto:emily.johnson@clinicaltrials.org">
                  emily.johnson@clinicaltrials.org
                </a>
              </span>
            </p>
          </div>
        </section>

        <button className="save-trial-btn">Save Trial</button>
      </main>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-left">
          <a href="#">About Us</a>
          <a href="#">Contact</a>
          <a href="#">Terms of Service</a>
        </div>
        <div className="footer-right">
          <a href="#">Privacy Policy</a>
          <a href="#">Help</a>
          <a href="#">Feedback</a>
        </div>
      </footer>
    </div>
  );
}
