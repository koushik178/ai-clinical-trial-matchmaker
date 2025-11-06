import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Search.css";
import Sidebar from "../components/Sidebar";   // ✅ import the reusable sidebar
import heartImg from "../assets/login.png";

function Search() {
  const navigate = useNavigate();
  const [activeKey, setActiveKey] = useState("find");  // ✅ sidebar active state

  return (
    <div className="search-container">
      {/* Sidebar (same as Home) */}
      <Sidebar activeKey={activeKey} setActiveKey={setActiveKey} />

      {/* Main content */}
      <main className="search-main">
        <h2 className="search-title">Discover Relevant Trials</h2>

        {/* Search Bar */}
        <div className="search-bar">
          <input type="text" placeholder="Enter your details" />
          <button className="find-btn">Find</button>
        </div>

        {/* Popular Trials */}
        <div className="section">
          <h4 className="section-title">Popular Trials</h4>
          <div className="tag-container">
            {[
              "Cancer Research",
              "Diabetes Study",
              "Heart Health",
              "Mental Wellness",
              "Pediatric Trials",
              "Neurology Trials",
              "Rare Diseases",
            ].map((t, i) => (
              <button key={i} className="tag-btn">
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* Trial Categories */}
        <div className="section">
          <h4 className="section-title">Trial Categories</h4>
          <div className="category-row">
            {["Onco", "Ca", "Endocri", "Psychiat", "Pediatr"].map((cat, i) => (
              <button key={i} className="category-btn">
                ✅ {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Eligibility and Status */}
        <div className="section filters">
          <div>
            <h4>Eligibility</h4>
            <div className="filter-icons">
              <span>✅</span>
              <span>✅</span>
              <span>✅</span>
              <span>✅</span>
              <span>✅</span>
            </div>
          </div>
          <div>
            <h4>Status</h4>
            <div className="status-tags">
              <button>✅ Open</button>
              <button>Closed</button>
              <button>✅ Upcoming</button>
            </div>
          </div>
        </div>

        {/* Recommended Section */}
        <div className="section">
          <h4 className="section-title">Recommended for You</h4>
          <div className="recommendations">
            {[
              { title: "Heart Health Study", doctor: "Dr. Emily Carter" },
              { title: "Diabetes Management", doctor: "Dr. John Smith" },
              { title: "Pediatric Cancer", doctor: "Dr. Sarah Johnson" },
              { title: "How to Participate?", doctor: "Dr. Alex Lee" },
            ].map((rec, i) => (
              <div key={i} className="rec-card">
                <img src={heartImg} alt={rec.title} />
                <h5>{rec.title}</h5>
                <p>{rec.doctor}</p>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}

export default Search;
