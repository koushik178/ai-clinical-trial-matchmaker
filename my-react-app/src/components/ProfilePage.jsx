// src/components/ProfilePage.jsx
import React, { useEffect, useState } from "react";
import "./Profile.css"; // Reuse existing Profile.css styling (you can add minor tweaks below)
import "./ProfilePanel.css"; // optional for panel-specific styles if present
import SkeletonProfile from "./skeletons/SkeletonProfile";
import LoadingSpinner from "./LoadingSpinner";
import profilePicPlaceholder from "../assets/login.png";

const ProfilePage = () => {
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true); // network spinner
  const [skeleton, setSkeleton] = useState(true); // skeleton UI

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      setSkeleton(true);

      try {
        const token = localStorage.getItem("access_token");
        const res = await fetch("https://ai-clinical-trial-matchmaker.onrender.com/profile/me", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        });

        if (!res.ok) {
          console.error("Failed to fetch profile:", res.statusText);
          setProfileData(null);
          return;
        }

        const data = await res.json();

        // brief wait so skeleton feels visible
        await new Promise((r) => setTimeout(r, 300));
        setProfileData(data);
      } catch (err) {
        console.error("Error fetching profile:", err);
        setProfileData(null);
      } finally {
        setSkeleton(false);
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (skeleton) {
    return (
      <div style={{ padding: 28, display: "flex", justifyContent: "center" }}>
        <SkeletonProfile />
      </div>
    );
  }

  if (loading && !profileData) {
    return (
      <div style={{ padding: 28, display: "flex", justifyContent: "center" }}>
        <LoadingSpinner size={48} />
      </div>
    );
  }

  if (!profileData) {
    return (
      <div style={{ padding: 28 }}>
        <p>Unable to load profile. Try reloading or check network.</p>
      </div>
    );
  }

  const { user, patient_profile } = profileData;

  return (
    <div className="profile-page" style={{ padding: 28 }}>
      <div className="profile-container" style={{ maxWidth: 1100, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 380px", gap: 24 }}>
        {/* Left: Full profile card */}
        <div>
          <div className="profile-card" style={{ padding: 20 }}>
            <img
              src={user.profile_photo_url || profilePicPlaceholder}
              alt="Profile"
              style={{ width: 120, height: 120, objectFit: "cover", borderRadius: 12 }}
            />
            <h2 style={{ marginTop: 12 }}>{user.first_name} {user.last_name}</h2>
            <p style={{ color: "#666", marginBottom: 12 }}>{user.email}</p>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <div>
                <strong>Age</strong>
                <div>{patient_profile?.age ?? "N/A"}</div>
              </div>
              <div>
                <strong>Gender</strong>
                <div>{patient_profile?.gender ?? "N/A"}</div>
              </div>
              <div>
                <strong>Blood Group</strong>
                <div>{patient_profile?.blood_group ?? "N/A"}</div>
              </div>
              <div>
                <strong>Occupation</strong>
                <div>{patient_profile?.occupation ?? "N/A"}</div>
              </div>
            </div>

            <hr style={{ margin: "16px 0" }} />

            <h4>Medical Info</h4>
            <p><strong>Diagnoses:</strong> {Object.keys(patient_profile?.diagnoses || {}).join(", ") || "N/A"}</p>
            <p><strong>Allergies:</strong> {Object.keys(patient_profile?.allergies || {}).join(", ") || "N/A"}</p>
            <p><strong>Medications:</strong> {Object.keys(patient_profile?.medications || {}).join(", ") || "N/A"}</p>
            <p><strong>Vaccinations:</strong> {Object.keys(patient_profile?.vaccinations || {}).join(", ") || "N/A"}</p>
            <p><strong>Family History:</strong> {Object.keys(patient_profile?.family_history || {}).join(", ") || "N/A"}</p>

            <hr style={{ margin: "16px 0" }} />

            <h4>Pre-screening</h4>
            <p><strong>Chronic illness:</strong> {patient_profile?.prescreening?.chronic_illness ?? "N/A"}</p>
            <p><strong>Previous surgery:</strong> {patient_profile?.prescreening?.previous_surgery ?? "N/A"}</p>
            <p><strong>On medication:</strong> {patient_profile?.prescreening?.on_medication ?? "N/A"}</p>
            <p><strong>Notes:</strong> {patient_profile?.prescreening?.notes ?? "N/A"}</p>
          </div>
        </div>

        {/* Right: Sidebar info (compact) */}
        <aside className="profile-panel" style={{ padding: 18 }}>
          <div style={{ textAlign: "center" }}>
            <h3>Summary</h3>
            <div style={{ marginTop: 8 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                <span className="meta-k">Height</span>
                <span className="meta-v">{patient_profile?.height_cm ?? "N/A"} cm</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                <span className="meta-k">Weight</span>
                <span className="meta-v">{patient_profile?.weight_kg ?? "N/A"} kg</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                <span className="meta-k">BMI</span>
                <span className="meta-v">{patient_profile?.bmi ?? "N/A"}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                <span className="meta-k">Contact</span>
                <span className="meta-v">{patient_profile?.contact_preference ?? "N/A"}</span>
              </div>
            </div>
          </div>

          <hr style={{ margin: "12px 0" }} />

          <h4>Insurance</h4>
          <div style={{ display: "grid", gap: 8 }}>
            <div><strong>Provider:</strong> {patient_profile?.insurance?.provider ?? "N/A"}</div>
            <div><strong>Policy #:</strong> {patient_profile?.insurance?.policy_number ?? "N/A"}</div>
          </div>

          <hr style={{ margin: "12px 0" }} />

          <h4>Emergency Contact</h4>
          <div style={{ display: "grid", gap: 8 }}>
            <div><strong>Name:</strong> {patient_profile?.emergency_contact?.name ?? "N/A"}</div>
            <div><strong>Phone:</strong> {patient_profile?.emergency_contact?.phone ?? "N/A"}</div>
            <div><strong>Relation:</strong> {patient_profile?.emergency_contact?.relation ?? "N/A"}</div>
          </div>

          <hr style={{ margin: "12px 0" }} />

          <div style={{ display: "flex", gap: 10 }}>
            <button className="edit-btn" onClick={() => window.location.href = "/create-profile"}>Edit Info</button>
            <button className="start-btn" onClick={() => window.location.href = "/search"}>Find Trials</button>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default ProfilePage;
