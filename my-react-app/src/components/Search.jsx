// src/components/Search.jsx
import React, { useEffect, useState } from "react";
import "./Search.css";
import Sidebar from "./Sidebar";
import SkeletonCard from "./skeletons/SkeletonCard";
import LoadingSpinner from "./LoadingSpinner";
import heartImg from "../assets/login.png";

const SEARCH_API =
  "https://ai-clinical-trial-matchmaker.onrender.com/api/matching/search";

// ---------------------- Distance Helper ----------------------
const toRad = (value) => (value * Math.PI) / 180;

// Haversine formula (km)
const computeDistanceKm = (lat1, lon1, lat2, lon2) => {
  const R = 6371;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) ** 2;

  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
};

// Attach distance to each trial
const addDistances = (trials, userLocation) => {
  if (!userLocation) return trials;

  const { lat: uLat, lng: uLng } = userLocation;

  return trials.map((t) => {
    const lat = t.lat ?? t.latitude ?? null;
    const lng = t.lng ?? t.longitude ?? null;

    if (lat != null && lng != null) {
      return {
        ...t,
        _distance_km: computeDistanceKm(uLat, uLng, lat, lng),
      };
    }
    return { ...t, _distance_km: null };
  });
};

// --------------------------- Summary Preview ---------------------------
const SummaryPreview = ({ text, maxChars = 250 }) => {
  const [expanded, setExpanded] = useState(false);

  if (!text) return null;

  const clean = text.replace(/\s+/g, " ").trim();

  if (clean.length <= maxChars) {
    return (
      <p className="summary-text">
        <strong>Summary:</strong> {clean}
      </p>
    );
  }

  const short = clean.slice(0, maxChars).trim() + "...";

  return (
    <div className="summary-text">
      <strong>Summary:</strong>{" "}
      {expanded ? clean : short}
      <span
        className="read-more"
        onClick={() => setExpanded(!expanded)}
      >
        {expanded ? " Read less" : " Read more"}
      </span>
    </div>
  );
};

// --------------------------- Saved Trials Helpers ---------------------------
const SAVED_TRIALS_KEY = "saved_trials_v1";

// unique key for a trial
const getTrialKey = (trial) => {
  if (trial.nct_id) return `nct:${trial.nct_id}`;
  if (trial.url) return `url:${trial.url}`;
  return `title:${trial.title || "unknown"}`;
};

const loadSavedTrials = () => {
  try {
    const raw = localStorage.getItem(SAVED_TRIALS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const saveSavedTrials = (trials) => {
  try {
    localStorage.setItem(SAVED_TRIALS_KEY, JSON.stringify(trials));
  } catch {
    // ignore storage errors
  }
};

const isTrialSaved = (trial, savedTrials) => {
  const key = getTrialKey(trial);
  return savedTrials.some((t) => getTrialKey(t) === key);
};

// ========================================================================
//                               MAIN COMPONENT
// ========================================================================
const Search = ({ initialQueryFromSidebar }) => {
  const [queryText, setQueryText] = useState(initialQueryFromSidebar || "");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [skeleton, setSkeleton] = useState(false);
  const [error, setError] = useState("");

  const [filters, setFilters] = useState({
    filter_status: "",
    filter_location_contains: "",
    sort_by: "confidence", // "confidence" | "title" | "distance"
    limit: 10,
  });

  const [userLocation, setUserLocation] = useState(null);
  const [locationStatus, setLocationStatus] = useState("");

  const token = localStorage.getItem("access_token");

  const [selectedTrial, setSelectedTrial] = useState(null);

  // saved trials state (for toggle)
  const [savedTrials, setSavedTrials] = useState([]);

  // Load saved trials on mount
  useEffect(() => {
    const initialSaved = loadSavedTrials();
    setSavedTrials(initialSaved);
  }, []);

  // Get user location
  useEffect(() => {
    if (!navigator.geolocation) {
      setLocationStatus("Location unsupported");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserLocation({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        });
        setLocationStatus("Location OK");
      },
      () => setLocationStatus("Location denied")
    );
  }, []);

  // Auto search from sidebar
  useEffect(() => {
    if (initialQueryFromSidebar) {
      setQueryText(initialQueryFromSidebar);
      handleSearch(initialQueryFromSidebar);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialQueryFromSidebar]);

  // ------------------------- Handle Search -------------------------
  const handleSearch = async (forcedText) => {
    const q = (forcedText ?? queryText).trim();

    if (!q) {
      setError("Please enter a search term.");
      return;
    }

    setError("");
    setResults([]);
    setSkeleton(true);
    setLoading(true);

    try {
      const backendSort =
        filters.sort_by === "distance" ? "confidence" : filters.sort_by;

      const payload = {
        query_text: q,
        filter_status: filters.filter_status,
        filter_location_contains: filters.filter_location_contains,
        sort_by: backendSort,
        limit: filters.limit,
      };

      const response = await fetch(SEARCH_API, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        console.error(await response.text());
        setError("Search failed. Try again.");
        return;
      }

      const data = await response.json();
      let trials = data.matched_trials || [];

      if (userLocation) {
        trials = addDistances(trials, userLocation);
      }

      if (filters.sort_by === "distance") {
        trials = trials.sort(
          (a, b) => (a._distance_km ?? Infinity) - (b._distance_km ?? Infinity)
        );
      }

      // small delay for smooth skeleton animation
      await new Promise((res) => setTimeout(res, 350));

      setResults(trials);
    } catch (err) {
      console.error(err);
      setError("Network error.");
    } finally {
      setSkeleton(false);
      setLoading(false);
    }
  };

  // ------------------------- Save / Unsave -------------------------
  const toggleSaveTrial = (trial) => {
    setSavedTrials((prev) => {
      const key = getTrialKey(trial);
      const exists = prev.some((t) => getTrialKey(t) === key);

      let updated;
      if (exists) {
        updated = prev.filter((t) => getTrialKey(t) !== key);
      } else {
        updated = [...prev, trial];
      }

      saveSavedTrials(updated);
      return updated;
    });
  };

  const renderDistance = (trial) => {
    if (trial._distance_km == null) return "Not available";
    return `${trial._distance_km.toFixed(1)} km`;
  };

  const renderLocation = (trial) => {
    if (trial.location) return trial.location;

    const parts = [trial.city, trial.state, trial.country].filter(Boolean);
    return parts.length ? parts.join(", ") : "Not available";
  };

  const confPercent = (trial) =>
    trial?.confidence_score != null
      ? (trial.confidence_score * 100).toFixed(1)
      : null;

  return (
    <div className="search-container">
      <Sidebar
        setQueryFromSidebar={(q) => {
          setQueryText(q);
          handleSearch(q);
        }}
      />

      <main className="search-main">
        <h2 className="search-title">Discover Relevant Clinical Trials</h2>

        {/* Search Input */}
        <div className="search-bar">
          <input
            type="text"
            placeholder="Enter condition, treatment, drug..."
            value={queryText}
            onChange={(e) => setQueryText(e.target.value)}
          />
          <button className="find-btn" onClick={() => handleSearch()}>
            {loading ? <LoadingSpinner size={18} /> : "Find"}
          </button>
        </div>

        {/* Filters */}
        <div className="filter-row">
          <select
            value={filters.filter_status}
            onChange={(e) =>
              setFilters((f) => ({ ...f, filter_status: e.target.value }))
            }
          >
            <option value="">All Status</option>
            <option value="RECRUITING">Recruiting</option>
            <option value="NOT_YET_RECRUITING">Not Yet Recruiting</option>
            <option value="ACTIVE">Active</option>
            <option value="COMPLETED">Completed</option>
            <option value="WITHDRAWN">Withdrawn</option>
          </select>

          <input
            type="text"
            placeholder="Location contains..."
            value={filters.filter_location_contains}
            onChange={(e) =>
              setFilters((f) => ({
                ...f,
                filter_location_contains: e.target.value,
              }))
            }
          />

          <select
            value={filters.sort_by}
            onChange={(e) =>
              setFilters((f) => ({ ...f, sort_by: e.target.value }))
            }
          >
            <option value="confidence">Sort: Confidence</option>
            <option value="title">Sort: Title</option>
            <option value="distance">Sort: Distance</option>
          </select>
        </div>

        {locationStatus === "Location denied" && (
          <p className="geo-warning">
            Location unavailable — distance sorting may be inaccurate.
          </p>
        )}

        {error && <p className="search-error">{error}</p>}

        {/* Results */}
        <div className="section">
          <h4 className="section-title">Matched Trials</h4>

          {skeleton && (
            <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
              {Array.from({ length: 6 }).map((_, i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          )}

          {!skeleton && loading && (
            <div style={{ display: "flex", justifyContent: "center" }}>
              <LoadingSpinner size={48} />
            </div>
          )}

          {!loading && !skeleton && (
            <div className="recommendations">
              {results.length === 0 && !error && (
                <p>No results found. Try another keyword.</p>
              )}

              {results.map((trial, index) => {
                const saved = isTrialSaved(trial, savedTrials);
                return (
                  <div key={index} className="rec-card">
                    <img src={heartImg} alt="trial" />

                    <h5>{trial.title}</h5>

                    {/* Confidence Gauge */}
                    {confPercent(trial) != null && (
                      <div className="confidence-wrapper">
                        <div className="confidence-header">
                          <span>Match confidence</span>
                          <span>{confPercent(trial)}%</span>
                        </div>
                        <div className="confidence-bar">
                          <div
                            className="confidence-bar-fill"
                            style={{ width: `${confPercent(trial)}%` }}
                          ></div>
                        </div>
                      </div>
                    )}

                    <p className="distance-line">
                      <strong>Distance:</strong> {renderDistance(trial)}
                    </p>

                    {/* Summary (cropped + read more) */}
                    {trial.summary && (
                      <SummaryPreview text={trial.summary} maxChars={250} />
                    )}

                    <p>
                      <strong>Status:</strong> {trial.status ?? "N/A"}
                    </p>

                    <p>
                      <strong>Sponsor:</strong> {trial.sponsor ?? "N/A"}
                    </p>

                    <p>
                      <strong>Location:</strong> {renderLocation(trial)}
                    </p>

                    <div className="card-actions">
                      <button
                        className={saved ? "save-btn saved" : "save-btn"}
                        onClick={() => toggleSaveTrial(trial)}
                      >
                        {saved ? "Saved ✓" : "Save trial"}
                      </button>

                      <button
                        className="details-btn"
                        onClick={() => setSelectedTrial(trial)}
                      >
                        View details
                      </button>

                      {trial.url && (
                        <a
                          href={trial.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="link-btn"
                        >
                          Open Trial
                        </a>
                      )}

                      {trial.google_maps_url && (
                        <a
                          href={trial.google_maps_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="link-btn"
                        >
                          Open Maps
                        </a>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>

      {/* ======================= MODAL ======================= */}
      {selectedTrial && (
        <div
          className="modal-backdrop"
          onClick={() => setSelectedTrial(null)}
        >
          <div
            className="modal-content"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="modal-close"
              onClick={() => setSelectedTrial(null)}
            >
              ×
            </button>

            <h3 className="modal-title">{selectedTrial.title}</h3>

            {confPercent(selectedTrial) != null && (
              <div className="confidence-wrapper modal-confidence">
                <div className="confidence-header">
                  <span>Match confidence</span>
                  <span>{confPercent(selectedTrial)}%</span>
                </div>
                <div className="confidence-bar">
                  <div
                    className="confidence-bar-fill"
                    style={{
                      width: `${confPercent(selectedTrial)}%`,
                    }}
                  ></div>
                </div>
              </div>
            )}

            <p className="modal-line">
              <strong>Status:</strong> {selectedTrial.status}
            </p>

            <p className="modal-line">
              <strong>Sponsor:</strong> {selectedTrial.sponsor}
            </p>

            <p className="modal-line">
              <strong>Location:</strong> {renderLocation(selectedTrial)}
            </p>

            <p className="modal-line">
              <strong>Distance:</strong> {renderDistance(selectedTrial)}
            </p>

            {selectedTrial.summary && (
              <div className="modal-block">
                <h4>What this trial is about</h4>
                <SummaryPreview
                  text={selectedTrial.summary}
                  maxChars={600}
                />
              </div>
            )}

            {selectedTrial.explanation && (
              <div className="modal-block">
                <h4>Why this matches you</h4>
                <p>{selectedTrial.explanation}</p>
              </div>
            )}

            <div className="modal-actions">
              {selectedTrial.url && (
                <a
                  className="primary-btn"
                  href={selectedTrial.url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Open Trial Page
                </a>
              )}
              {selectedTrial.google_maps_url && (
                <a
                  className="secondary-btn"
                  href={selectedTrial.google_maps_url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  View on Google Maps
                </a>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Search;
