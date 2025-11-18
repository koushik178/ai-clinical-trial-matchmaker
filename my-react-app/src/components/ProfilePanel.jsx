import React, { useState, useEffect } from "react";
import "./ProfilePanel.css";
import profilePicPlaceholder from "../assets/login.png";

const ProfilePanel = ({ token, onClose }) => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const res = await fetch("https://ai-clinical-trial-matchmaker.onrender.com/profile/me", {
        headers: {
          "Authorization": `Bearer ${token}`,
          "Accept": "application/json",
        },
      });
      if (!res.ok) throw new Error("Failed to fetch profile");
      const data = await res.json();
      setProfile(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  if (loading) return <div className="profile-loading">Loading profile...</div>;
  if (error) return <div className="profile-loading">Error: {error}</div>;
  if (!profile) return null;

  const { user, patient_profile } = profile;

  return (
    <aside className="profile-panel" aria-label="User Profile Panel">
      <button className="close-btn" onClick={onClose}>✖</button>

      <div className="profile-card">
        <img
          src={user.profile_photo_url || profilePicPlaceholder}
          alt="Profile"
        />
        <h3 className="profile-name">{user.first_name} {user.last_name}</h3>

        <div className="profile-meta">
          <div>
            <span className="meta-k">Email</span>
            <span className="meta-v">{user.email}</span>
          </div>
          <div>
            <span className="meta-k">Age</span>
            <span className="meta-v">{patient_profile.age}</span>
          </div>
          <div>
            <span className="meta-k">Gender</span>
            <span className="meta-v">{patient_profile.gender}</span>
          </div>
          <div>
            <span className="meta-k">Blood Group</span>
            <span className="meta-v">{patient_profile.blood_group}</span>
          </div>
          <div>
            <span className="meta-k">Height</span>
            <span className="meta-v">{patient_profile.height_cm} cm</span>
          </div>
          <div>
            <span className="meta-k">Weight</span>
            <span className="meta-v">{patient_profile.weight_kg} kg</span>
          </div>
          <div>
            <span className="meta-k">BMI</span>
            <span className="meta-v">{patient_profile.bmi}</span>
          </div>
        </div>

        {/* Additional Info */}
        <div className="profile-additional">
          <h4>Medical Info</h4>
          <p><strong>Diagnoses:</strong> {Object.keys(patient_profile.diagnoses).join(", ")}</p>
          <p><strong>Allergies:</strong> {Object.keys(patient_profile.allergies).join(", ")}</p>
          <p><strong>Medications:</strong> {Object.keys(patient_profile.medications).join(", ")}</p>
          <p><strong>Vaccinations:</strong> {Object.keys(patient_profile.vaccinations).join(", ")}</p>
          <p><strong>Family History:</strong> {Object.keys(patient_profile.family_history).join(", ")}</p>
        </div>

        <button className="edit-btn">Edit Info</button>
      </div>
    </aside>
  );
};

export default ProfilePanel;
