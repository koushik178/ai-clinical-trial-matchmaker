import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./Sidebar.css";

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const navItems = [
    { key: "/search", label: "Find trials easily", icon: "🔍", onClick: () => navigate("/search") },
    { key: "/details", label: "Trial Details", icon: "📋", onClick: () => navigate("/details") },
    { key: "/saved", label: "Saved Trials", icon: "⭐", onClick: () => navigate("/saved") },
    { key: "/notifications", label: "Alerts", icon: "🔔", onClick: () => navigate("/notifications") },
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
          onClick={() => setCollapsed((prev) => !prev)}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          <span className="bar" />
          <span className="bar" />
          <span className="bar" />
        </button>
      </div>

      {/* Nav Items */}
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
        <button className="start-btn" onClick={() => navigate("/search")}>
          <span className="start-ico">▶</span>
          <span className="start-label">Start Search</span>
        </button>

        <div className="aux-links">
          <button className="aux-btn">
            <span className="aux-ico">⚙</span>
            <span className="aux-label">Profile</span>
          </button>
          <button className="aux-btn">
            <span className="aux-ico">↪</span>
            <span className="aux-label">Log out</span>
          </button>
        </div>
      </div>
    </aside>
  );
}
