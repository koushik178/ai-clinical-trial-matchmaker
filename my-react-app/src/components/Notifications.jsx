import React from "react";
import "./Notifications.css";
import Sidebar from "./Sidebar"; // ✅ Import the reusable sidebar
import user1 from "../assets/login.png"; // Replace later with actual profile photos

const Notifications = () => {
  return (
    <div className="notifications-container">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <main className="notifications-main">
        {/* Header Bar */}
        <header className="notifications-header">
          <input
            type="text"
            className="search-input"
            placeholder="Search trials"
          />
          <div className="header-actions">
            <button className="create-btn">Create</button>
            <div className="icons">
              <span>💬</span>
              <span>🔔</span>
              <img src={user1} alt="User" className="profile-pic" />
            </div>
          </div>
        </header>

        {/* Title */}
        <h2 className="notif-title">Notifications</h2>

        <div className="notif-grid">
          {/* Left Panel - Matches */}
          <section className="notif-section">
            <div className="notif-header">
              <h4>New Matches</h4>
              <select className="filter-select">
                <option>This week</option>
                <option>Today</option>
                <option>This month</option>
              </select>
            </div>

            {/* Notification Cards */}
            <div className="notif-card">
              <img src={user1} alt="John" className="notif-avatar" />
              <div className="notif-content">
                <div className="notif-info">
                  <h5>John Smith</h5>
                  <p>found a trial - 1234</p>
                </div>
                <p className="notif-message">
                  Great opportunity, check it out!
                </p>
                <div className="notif-actions">
                  <span>Like</span>
                  <span>Reply</span>
                </div>
              </div>
              <div className="notif-time">
                <span>2h</span>
                <span className="dot"></span>
              </div>
            </div>

            <div className="notif-card">
              <img src={user1} alt="Emily" className="notif-avatar" />
              <div className="notif-content">
                <div className="notif-info">
                  <h5>Emily Johnson</h5>
                  <p>found a trial - 5678</p>
                </div>
                <p className="notif-message">This could be helpful!</p>
                <div className="notif-actions">
                  <span>Like</span>
                  <span>Reply</span>
                </div>
              </div>
              <div className="notif-time">
                <span>3h</span>
                <span className="dot"></span>
              </div>
            </div>
          </section>

          {/* Right Panel - Filter */}
          <aside className="notif-filter">
            <h4>Filter</h4>
            <div className="filter-list">
              {["Comments", "Matches", "Reviews", "Mentions", "Updates", "Messages"].map(
                (item, i) => (
                  <label key={i} className="filter-item">
                    <input type="checkbox" defaultChecked />
                    {item}
                  </label>
                )
              )}
            </div>
            <div className="filter-buttons">
              <button className="select-btn">Select all</button>
              <button className="unselect-btn">Unselect all</button>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
};

export default Notifications;
