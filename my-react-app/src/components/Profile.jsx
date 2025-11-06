import React, { useEffect, useState } from "react";
import Sidebar from "./Sidebar.jsx";
import "./Profile.css";

// display defaults (shown until API data loads)
const DEFAULT_USER = {
  name: "Emi Martinez",
  sex: "M",
  age: 28,
  lastSearch: "Last",
  location: "New",
  number: "—",
  condition: "Asthma",
};

const DEFAULT_TRIALS = [
  { id: "t1", title: "Asthma study", doctor: "Dr. Emily Carter" },
  { id: "t2", title: "Diabetes trial", doctor: "Dr. Robert Lee" },
];

const DEFAULT_MEDS = [
  { id: "m1", title: "Albuterol inhaler", details: "As needed" },
  { id: "m2", title: "Ibuprofen", details: "As needed" },
];

const DEFAULT_METRICS = [
  { id: "sleep", icon: "🛏️", title: "Sleep", sub: "avg. 6h 45 min" },
  { id: "steps", icon: "🚶", title: "Steps", sub: "avg. 7,500" },
  { id: "weight", icon: "⚖️", title: "Weight", sub: "70 kg" },
  { id: "cal", icon: "🔥", title: "Calories", sub: "avg. 2,300 kcal" },
  { id: "water", icon: "💧", title: "Hydration", sub: "adequate" },
];

export default function Profile() {
  const [user, setUser] = useState(DEFAULT_USER);
  const [trialHistory, setTrialHistory] = useState(DEFAULT_TRIALS);
  const [meds, setMeds] = useState(DEFAULT_MEDS);
  const [metrics, setMetrics] = useState(DEFAULT_METRICS);

  // single number instead of sparkline
  const [heartBpm, setHeartBpm] = useState(72);

  // (backend/Amman): plug real endpoints + auth when ready
  useEffect(() => {

    // fetch("/api/users/me")
    
  }, []);

  useEffect(() => {
    
    // fetch("/api/users/me/metrics")
    
  }, []);

  return (
    <div className="pf-wrap">
      <header className="pf-topbar">
        <div className="pf-brand">TrialFind</div>
      </header>

      <div className="pf-grid">
        <Sidebar />

        <main className="pf-main">
          <h1 className="pf-title">
            Participant <span className="pf-name">{user.name}</span>
          </h1>

          {/* top info strip */}
          <section className="pf-info">
            <div className="pf-card pf-id">
              <div className="pf-avatar" aria-hidden="true" />
              <div>
                <div className="pf-id-label">Participant</div>
                <div className="pf-id-name">{user.name}</div>
              </div>
            </div>

            <div className="pf-card pf-brief">
              <div><b>Sex:</b> {user.sex}</div>
              <div><b>Age:</b> {user.age}</div>
              <div><b>Condition</b></div>
            </div>

            <div className="pf-card pf-brief">
              <div><b>Last trial search:</b> {user.lastSearch}</div>
              <div><b>Location:</b> {user.location}</div>
              <div><b>Participant nr:</b> {user.number}</div>
            </div>
          </section>

          {/* first row */}
          <section className="pf-row">
            <div className="pf-card pf-list">
              <h3>Trial history</h3>
              <ul>
                {trialHistory.map(t => (
                  <li key={t.id}>
                    <span className="pf-dot" />
                    <div>
                      <div className="pf-li-title">{t.title}</div>
                      <div className="pf-li-sub">{t.doctor}</div>
                    </div>
                    <span className="pf-arrow">›</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="pf-card pf-health">
              <h3>Health info</h3>
              <div className="pf-health-grid">
                <div className="pf-doc-ico" aria-hidden="true" />
                <ul className="pf-health-notes">
                  <li>Asthma mild</li>
                  <li>Heart rate stable</li>
                  <li>Cholesterol normal</li>
                </ul>
              </div>
            </div>

            <aside className="pf-side-cards">
              {metrics.map(m => (
                <div key={m.id} className="pf-card pf-metric">
                  <div className="pf-metric-row">
                    <span className="pf-metric-ico" aria-hidden="true">{m.icon}</span>
                    <div className="pf-metric-labels">
                      <div className="pf-metric-title">{m.title}</div>
                      <div className="pf-metric-sub">{m.sub}</div>
                    </div>
                  </div>
                </div>
              ))}
            </aside>
          </section>

          {/* second row */}
          <section className="pf-row">
            <div className="pf-card pf-list">
              <h3>Medication history</h3>
              <ul>
                {meds.map(m => (
                  <li key={m.id}>
                    <span className="pf-pill" />
                    <div>
                      <div className="pf-li-title">{m.title}</div>
                      <div className="pf-li-sub">{m.details}</div>
                    </div>
                    <span className="pf-arrow">›</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* bpm display (no sparkline) */}
            <div className="pf-card pf-heart">
              <h3>Heart rate</h3>
              <div className="pf-bpm">
                <span className="pf-bpm-num">{heartBpm}</span>
                <span className="pf-bpm-unit">bpm</span>
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
