import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Home.css";
import profilePic from "../assets/login.png"; // temporary placeholder

const Home = () => {
  const navigate = useNavigate();

  // collapsible sidebar state
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [activeKey, setActiveKey] = useState("find");

  // mock user data (easily replaceable with API)
  const user = {
    name: "John Doe",
    age: 35,
    gender: "Male",
    city: "New York",
    condition: "Diabetes",
  };

  const trials = {
    found: 15,
    matches: 5,
    matchedTrials: 3,
    favorites: 2,
  };

  // nav config (easy to extend / route later)
  const navItems = [
    { key: "find", label: "Find trials easily", icon: "🔍", onClick: () => navigate("/search") },
    { key: "details", label: "Trial Details", icon: "📋", onClick: () => {} },
    { key: "saved", label: "Saved Trials", icon: "⭐", onClick: () => {} },
    { key: "alerts", label: "Alerts", icon: "🔔", onClick: () => {} },
  ];

  return (
    <div className={`home-container ${isCollapsed ? "sidebar-collapsed" : ""}`}>
      {/* Sidebar */}
      <aside className="sidebar" aria-label="Primary">
        <div className="sidebar-top">
          <h2 className="brand">
            <span className="brand-line">Clinical</span>
            <span className="brand-line">Trial</span>
          </h2>

          <button
            className="collapse-toggle"
            aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            aria-expanded={!isCollapsed}
            onClick={() => setIsCollapsed((v) => !v)}
          >
            <span className="bar" />
            <span className="bar" />
            <span className="bar" />
          </button>
        </div>

        <nav className="nav-list">
          {navItems.map(({ key, label, icon, onClick }) => (
            <button
              key={key}
              className={`nav-btn ${activeKey === key ? "active" : ""}`}
              onClick={() => {
                setActiveKey(key);
                onClick?.();
              }}
            >
              <span className="nav-ico" aria-hidden="true">{icon}</span>
              <span className="nav-label">{label}</span>
            </button>
          ))}
        </nav>

        <div className="sidebar-footer">
          <button className="start-btn" onClick={() => navigate("/search")}>
            <span className="start-ico" aria-hidden="true">▶</span>
            <span className="start-label">Start Search</span>
          </button>

          <div className="aux-links">
            <button className="aux-btn">
              <span className="aux-ico" aria-hidden="true">⚙</span>
              <span className="aux-label">Profile</span>
            </button>
            <button className="aux-btn">
              <span className="aux-ico" aria-hidden="true">↪</span>
              <span className="aux-label">Log out</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        <div className="breadcrumb">Home / Clinical Trials</div>

        <section className="welcome-box">
          <h2 className="welcome-title">Welcome, {user.name}!</h2>
          <p className="welcome-copy">
            Today is Monday, January 12. You have 1 trial matched, and your next follow-up
            is scheduled for next week. Stay informed and engaged with your health.
          </p>
        </section>

        <section className="stats-grid">
          <div className="stat-card">
            <h3>Trials Found</h3>
            <p className="stat-num">{trials.found}</p>
          </div>

          <div className="stat-card">
            <h3>Your Health</h3>
            <p className="stat-sub">Conditions</p>
          </div>

          <div className="stat-card">
            <h3>Trial Matches</h3>
            <p className="stat-sub">{trials.matches} available</p>
          </div>
        </section>

        <section className="age-filter">
          {["18-30", "31-45", "46-60", "61+", "All"].map((age) => (
            <button key={age} className="chip">{age}</button>
          ))}
        </section>

        <section className="details-grid">
          <div className="detail-card">
            <h4>Eligibility</h4>
            <p>Age & Condition</p>
          </div>
          <div className="detail-card">
            <h4>Matched Trials</h4>
            <p>{trials.matchedTrials} trials</p>
          </div>
          <div className="detail-card">
            <h4>Favorites</h4>
            <p>{trials.favorites} saved</p>
          </div>
        </section>
      </main>

      {/* Right Profile Panel */}
      <aside className="profile-panel" aria-label="User summary">
        <div className="profile-card">
          <img src={profilePic} alt="" />
          <h3 className="profile-name">{user.name}</h3>

          <div className="profile-meta">
            <div><span className="meta-k">Condition</span><span className="meta-v">{user.condition}</span></div>
            <div><span className="meta-k">City</span><span className="meta-v">{user.city}</span></div>
            <div><span className="meta-k">Age</span><span className="meta-v">30–40</span></div>
          </div>
        </div>

        <div className="calendar">
          <div className="days">
            {["27 Mon", "28 Tue", "29 Wed", "30 Thu", "31 Fri"].map((d) => (
              <span key={d} className={`day ${d.includes("29") ? "active" : ""}`}>{d}</span>
            ))}
          </div>
        </div>

        <div className="upcoming">
          <button className="pill">📅  Trial for Diabetes</button>
          <button className="pill">⏰  Follow-up Appointment</button>
          <button className="pill">⭐  Recommended Trials</button>
        </div>

        <button className="edit-btn">Edit Info</button>
      </aside>
    </div>
  );
};

export default Home;
