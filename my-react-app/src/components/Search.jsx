// src/components/Search.jsx
import React, { useEffect, useState } from "react";
import "./Search.css";
import Sidebar from "./Sidebar";
import heartImg from "../assets/login.png";
import SkeletonCard from "./skeletons/SkeletonCard";
import LoadingSpinner from "./LoadingSpinner";

const Search = ({ initialQueryFromSidebar }) => {
  const [queryText, setQueryText] = useState(initialQueryFromSidebar || "");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);      // For main spinner
  const [skeleton, setSkeleton] = useState(false);    // For card skeletons
  const [error, setError] = useState("");             // Error message

  const token = localStorage.getItem("access_token");

  // Auto-trigger search if sidebar sends a query
  useEffect(() => {
    if (initialQueryFromSidebar) {
      setQueryText(initialQueryFromSidebar);
      handleSearch(initialQueryFromSidebar);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialQueryFromSidebar]);

  // --------------------------------------
  // 🔍 SEARCH FUNCTION
  // --------------------------------------
  const handleSearch = async (forcedQuery) => {
    const q = (forcedQuery ?? queryText).trim();
    if (!q) {
      setError("Please enter a search keyword.");
      return;
    }

    if (!token) {
      setError("You are not logged in. Please login again.");
      return;
    }

    setError("");
    setResults([]);
    setLoading(true);
    setSkeleton(true);

    try {
      const response = await fetch(
        "https://ai-clinical-trial-matchmaker.onrender.com/api/matching/search",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ query_text: q }),
        }
      );

      if (!response.ok) {
        const errTxt = await response.text().catch(() => "");
        console.error("Search error:", errTxt);
        setError("Search failed. Please try again.");
        setResults([]);
        return;
      }

      const data = await response.json();

      // ⏳ Keep skeleton on screen longer for smooth animation
      const wait = (ms) => new Promise((res) => setTimeout(res, ms));
      await wait(350);

      setResults(data.matched_trials || []);
    } catch (err) {
      console.error("Search failed:", err);
      setError("Something went wrong. Try again.");
      setResults([]);
    } finally {
      setSkeleton(false);
      setLoading(false);
    }
  };

  // --------------------------------------
  // JSX OUTPUT
  // --------------------------------------
  return (
    <div className="search-container">
      {/* Sidebar */}
      <Sidebar
        setQueryFromSidebar={(q) => {
          setQueryText(q);
          handleSearch(q);
        }}
      />

      {/* Right content */}
      <main className="search-main">
        <h2 className="search-title">Discover Relevant Trials</h2>

        {/* 🔍 Search Bar */}
        <div className="search-bar">
          <input
            type="text"
            placeholder="Enter search keyword..."
            value={queryText}
            onChange={(e) => setQueryText(e.target.value)}
          />

          <button className="find-btn" onClick={() => handleSearch()}>
            {loading ? <LoadingSpinner size={18} /> : "Find"}
          </button>
        </div>

        {/* ❗ Error message */}
        {error && <p className="search-error" style={{ color: "red" }}>{error}</p>}

        {/* Results Section */}
        <div className="section">
          <h4 className="section-title">Results</h4>

          {/* 🦴 Skeleton Cards */}
          {skeleton && (
            <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
              {Array.from({ length: 6 }).map((_, i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          )}

          {/* 🔄 Spinner */}
          {!skeleton && loading && (
            <div style={{ display: "flex", justifyContent: "center", padding: 24 }}>
              <LoadingSpinner size={48} />
            </div>
          )}

          {/* 🧩 Final results */}
          {!loading && !skeleton && (
            <>
              {results.length === 0 && !error && (
                <p style={{ marginTop: 10 }}>No trials yet. Try searching.</p>
              )}

              <div className="recommendations">
                {results.map((trial, index) => (
                  <div key={index} className="rec-card">
                    <img src={heartImg} alt="trial" />

                    <h5>{trial.title}</h5>
                    <p><strong>Status:</strong> {trial.status}</p>
                    <p><strong>Location:</strong> {trial.location}</p>

                    <p>
                      <a
                        href={trial.url}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        🔗 View Trial
                      </a>
                    </p>

                    <p>
                      <a
                        href={trial.google_maps_url}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        📍 View on Maps
                      </a>
                    </p>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
};

export default Search;
