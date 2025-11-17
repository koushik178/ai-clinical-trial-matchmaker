import React, { useEffect, useState } from "react";
import "./Home.css";
import profilePic from "../assets/login.png";
import Sidebar from "./Sidebar"; // ✅ Reusable Sidebar component

const Home = () => {
  // keep original fallback user object so UI doesn't change if fetch fails
  const fallbackUser = {
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

  const [apiUser, setApiUser] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("access_token");
        if (!token) return; // not logged in

        const res = await fetch(
          "https://ai-clinical-trial-matchmaker.onrender.com/profile/me",
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              Accept: "application/json",
            },
          }
        );

        if (!res.ok) {
          // don't throw — just skip using API data
          console.warn("Failed to fetch profile:", res.statusText);
          return;
        }

        const data = await res.json();

        // API returns { user: {...}, patient_profile: {...} } in many examples;
        // If the endpoint returns nested data, prefer user object inside it.
        if (data.user) {
          setApiUser(data.user);
        } else {
          // otherwise if endpoint returns a flat user object, use that
          setApiUser(data);
        }
      } catch (err) {
        console.error("Profile fetch error:", err);
      }
    };

    fetchProfile();
  }, []);

  // choose display user: prefer API user first_name, fallback to hard-coded
  const displayName =
    (apiUser && (apiUser.first_name || apiUser.name))
      ? (apiUser.first_name ? apiUser.first_name : apiUser.name)
      : fallbackUser.name;

  return (
    <div className="home-container">
      {/* ✅ Sidebar imported instead of inline code */}
      <Sidebar />

      {/* Main Content */}
      <main className="main-content">
        <div className="breadcrumb">Home / Clinical Trials</div>

        <section className="welcome-box">
          <h2 className="welcome-title">Welcome, {displayName}!</h2>
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
          <h4 className="age-filter-title">Age filter</h4>
          {["18-30", "31-45", "46-60", "61+", "All"].map((age) => (
            <button key={age} className="chip active-chip">{age}</button>
          ))}
        </section>

        {/* Trial and Search Details Section */}
        <section className="bottom-grid">
          {/* Left Side — Search Trials */}
          <div className="search-trials">
            <h4>Search Trials</h4>
            <div className="search-item">
              <span>Find</span>
              <div className="progress">
                <div className="bar green" style={{ width: "80%" }}></div>
              </div>
            </div>
            <div className="search-item">
              <span>Health Conditions</span>
              <div className="progress">
                <div className="bar green" style={{ width: "60%" }}></div>
              </div>
            </div>
            <div className="search-item">
              <span>Age</span>
              <div className="progress">
                <div className="bar green" style={{ width: "90%" }}></div>
              </div>
            </div>

            <div className="search-trials-meta">
              <div>
                <p>Your Clinical</p>
                <p><strong>Diabetes</strong></p>
              </div>
              <div>
                <p>Explore</p>
                <p><strong>Cancer</strong></p>
              </div>
              <div>
                <p>Join</p>
                <p><strong>65+</strong></p>
              </div>
              <div>
                <p>More Detail</p>
                <p><strong>15</strong></p>
              </div>
            </div>
          </div>

          {/* Right Side — Trial Details */}
          <div className="trial-details-container">
            <div className="trial-card">
              <div className="icon">ℹ️</div>
              <div>
                <h4>Eligibility</h4>
                <p>Age & Condition</p>
              </div>
            </div>
            <div className="trial-card">
              <div className="icon">✅</div>
              <div>
                <h4>Matched Trials</h4>
                <p>3 trials</p>
              </div>
            </div>
            <div className="trial-card">
              <div className="icon">⭐</div>
              <div>
                <h4>Favorites</h4>
                <p>2 saved</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Right Profile Panel */}
      <aside className="profile-panel" aria-label="User summary">
        <div className="profile-card">
          <img src={profilePic} alt="Profile" />
          <h3 className="profile-name">{displayName}</h3>

          <div className="profile-meta">
            <div><span className="meta-k">Condition</span><span className="meta-v">{fallbackUser.condition}</span></div>
            <div><span className="meta-k">City</span><span className="meta-v">{fallbackUser.city}</span></div>
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
          <button className="pill">📅 Trial for Diabetes</button>
          <button className="pill">⏰ Follow-up Appointment</button>
          <button className="pill">⭐ Recommended Trials</button>
        </div>

        <button className="edit-btn">Edit Info</button>
      </aside>
    </div>
  );
};

export default Home;
