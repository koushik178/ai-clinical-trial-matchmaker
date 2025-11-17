import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./Sidebar.css";

export default function Sidebar({ setQueryFromSidebar }) {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const triggerSearch = (query) => {
    if (setQueryFromSidebar) setQueryFromSidebar(query);   // send query to Search.jsx
    navigate("/search");
  };

  const navItems = [
    { 
      key: "/search",
      label: "Find trials easily",
      icon: "🔍",
      onClick: () => triggerSearch("heart")
    },
    { 
      key: "/details",
      label: "Trial Details",
      icon: "📋",
      onClick: () => navigate("/details")
    },
    { 
      key: "/saved",
      label: "Saved Trials",
      icon: "⭐",
      onClick: () => navigate("/saved")
    },
    { 
      key: "/notifications",
      label: "Alerts",
      icon: "🔔",
      onClick: () => navigate("/notifications")
    }
  ];

  return (
    <aside className={`sidebar ${collapsed ? "collapsed" : ""}`}>
      {/* Header */}
      <div className="sidebar-top">
        <h2 className="brand">
          <span className="brand-line">Clinical</span>
          <span className="brand-line">Trial</span>
        </h2>

        <button
          className="collapse-toggle"
          onClick={() => setCollapsed(prev => !prev)}
        >
          <span className="bar" />
          <span className="bar" />
          <span className="bar" />
        </button>
      </div>

      {/* Navigation */}
      <nav className="nav-list">
        {navItems.map(({ key, label, icon, onClick }) => (
          <button
            key={key}
            className={`nav-btn ${pathname === key ? "active" : ""}`}
            onClick={onClick}
          >
            <span className="nav-ico">{icon}</span>
            <span className="nav-label">{label}</span>
          </button>
        ))}
      </nav>

      {/* Footer */}
      <div className="sidebar-footer">
        <button
          className="start-btn"
          onClick={() => triggerSearch("heart")}
        >
          <span className="start-ico">▶</span>
          <span className="start-label">Start Search</span>
        </button>

        <div className="aux-links">
          <button className="aux-btn" onClick={() => navigate("/profile-page")}>
            <span className="aux-ico">⚙</span>
            <span className="aux-label">Profile</span>
          </button>

          <button
            className="aux-btn"
            onClick={() => {
              sessionStorage.clear();
              localStorage.clear();
              navigate("/");
            }}
          >
            <span className="aux-ico">↪</span>
            <span className="aux-label">Log out</span>
          </button>
        </div>
      </div>
    </aside>
  );
}
