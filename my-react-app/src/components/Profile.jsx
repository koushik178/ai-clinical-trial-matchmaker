import React from "react";
import "./Profile.css";
import Sidebar from "./Sidebar";
import loginImage from "../assets/login.png"; // replaced doctorIcon with login.png

const Profile = () => {
  const trialHistory = [
    { title: "Asthma study", doctor: "Dr. Emily Carter" },
    { title: "Diabetes trial", doctor: "Dr. Robert Lee" },
  ];

  const medicationHistory = [
    { title: "Albuterol inhaler", desc: "As needed" },
    { title: "Ibuprofen", desc: "As needed" },
  ];

  const healthStats = [
    { icon: "🛏️", title: "Sleep", desc: "avg. 6h 45min" },
    { icon: "🚶", title: "Steps", desc: "avg. 7,500" },
    { icon: "⚖️", title: "Weight", desc: "70 kg" },
    { icon: "🔥", title: "Calories", desc: "avg. 2,300 kcal" },
    { icon: "💧", title: "Hydration", desc: "adequate" },
  ];

  return (
    <div className="profile-page">
      <Sidebar />

      <div className="profile-main">
        <header className="profile-header">
          <h2>
            Participant <span className="participant-name">Alex Johnson</span>
          </h2>
        </header>

        <section className="participant-info">
          <div className="participant-card">
            <div className="participant-avatar">
              <img src={loginImage} alt="Participant" />
            </div>
            <div className="participant-text">
              <h3>Participant</h3>
              <h2>Alex Johnson</h2>
            </div>
          </div>

          <div className="participant-details">
            <p><strong>Sex:</strong> Male</p>
            <p><strong>Age:</strong> 28</p>
            <p><strong>Condition:</strong> Asthma</p>
            <p><strong>Last trial search:</strong> Last</p>
            <p><strong>Location:</strong> New</p>
            <p><strong>Participant nr:</strong> —</p>
          </div>
        </section>

        <div className="profile-content">
          <div className="left-section">
            <div className="info-box">
              <h3>Trial history</h3>
              {trialHistory.map((item, i) => (
                <div key={i} className="info-item">
                  <span className="icon">📄</span>
                  <div>
                    <p className="title">{item.title}</p>
                    <p className="desc">{item.doctor}</p>
                  </div>
                  <span className="arrow">›</span>
                </div>
              ))}
            </div>

            <div className="info-box">
              <h3>Medication history</h3>
              {medicationHistory.map((item, i) => (
                <div key={i} className="info-item">
                  <span className="icon">💊</span>
                  <div>
                    <p className="title">{item.title}</p>
                    <p className="desc">{item.desc}</p>
                  </div>
                  <span className="arrow">›</span>
                </div>
              ))}
            </div>
          </div>

          <div className="middle-section">
            <div className="info-box health-box">
              <h3>Health info</h3>
              <div className="health-content">
                <img src={loginImage} alt="Health" className="health-img" />
                <div className="health-desc">
                  <p>Asthma mild</p>
                  <p>Heart rate stable</p>
                  <p>Cholesterol normal</p>
                </div>
              </div>
            </div>

            <div className="info-box heart-box">
              <h3>Heart rate</h3>
              <div className="heart-graph">
                {[...Array(20)].map((_, i) => (
                  <div
                    key={i}
                    className="bar"
                    style={{
                      height: `${60 + Math.sin(i / 2) * 15}px`,
                    }}
                  ></div>
                ))}
              </div>
            </div>
          </div>

          <div className="right-section">
            {healthStats.map((item, i) => (
              <div key={i} className="stat-card">
                <span className="stat-icon">{item.icon}</span>
                <div>
                  <p className="stat-title">{item.title}</p>
                  <p className="stat-desc">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
