import React, { useState } from "react";
import "./Profile.css";
import Sidebar from "./Sidebar";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    date_of_birth: "",
    gender: "",
    blood_group: "",
    height_cm: "",
    weight_kg: "",
    bmi: "",
    smoking_status: "",
    alcohol_use: "",
    occupation: "",
    contact_preference: "",
    consent_to_share: false,

    diagnoses: {},
    allergies: {},
    medications: {},
    vaccinations: {},
    family_history: {},
    insurance: {},
    emergency_contact: {},
    prescreening: {}
  });

  // Auto-calc BMI
  const calculateBMI = (height, weight) => {
    if (!height || !weight) return "";
    let h = height / 100;
    return (weight / (h * h)).toFixed(2);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    let newValue = type === "checkbox" ? checked : value;

    let updated = {
      ...form,
      [name]: newValue
    };

    // Auto-update BMI
    if (name === "height_cm" || name === "weight_kg") {
      updated.bmi = calculateBMI(
        name === "height_cm" ? value : form.height_cm,
        name === "weight_kg" ? value : form.weight_kg
      );
    }

    setForm(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("access_token");

      const response = await axios.post(
        "https://ai-clinical-trial-matchmaker.onrender.com/patients/profile",
        form,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        }
      );

      console.log("Profile created:", response.data);

      alert("Profile created successfully!");
      navigate("/home");

    } catch (error) {
      console.error(error);
      alert("Error creating profile. Check console.");
    }
  };

  return (
    <div className="profile-page">
      <Sidebar />

      <div className="profile-main">
        <h2 className="profile-header-title">Create Patient Profile</h2>

        <form className="profile-form" onSubmit={handleSubmit}>

          <div className="form-row">
            <label>Date of Birth</label>
            <input type="date" name="date_of_birth" value={form.date_of_birth} onChange={handleChange} required />
          </div>

          <div className="form-row">
            <label>Gender</label>
            <select name="gender" value={form.gender} onChange={handleChange} required>
              <option value="">Select</option>
              <option value="MALE">Male</option>
              <option value="FEMALE">Female</option>
              <option value="OTHER">Other</option>
            </select>
          </div>

          <div className="form-row">
            <label>Blood Group</label>
            <select name="blood_group" value={form.blood_group} onChange={handleChange} required>
              <option value="">Select</option>
              <option value="A+">A+</option>
              <option value="A-">A-</option>
              <option value="B+">B+</option>
              <option value="B-">B-</option>
              <option value="AB+">AB+</option>
              <option value="AB-">AB-</option>
              <option value="O+">O+</option>
              <option value="O-">O-</option>
            </select>
          </div>

          <div className="form-row">
            <label>Height (cm)</label>
            <input type="number" name="height_cm" value={form.height_cm} onChange={handleChange} required />
          </div>

          <div className="form-row">
            <label>Weight (kg)</label>
            <input type="number" name="weight_kg" value={form.weight_kg} onChange={handleChange} required />
          </div>

          <div className="form-row">
            <label>BMI (auto)</label>
            <input type="text" value={form.bmi} readOnly />
          </div>

          <div className="form-row">
            <label>Smoking Status</label>
            <select name="smoking_status" value={form.smoking_status} onChange={handleChange} required>
              <option value="">Select</option>
              <option value="NEVER">Never</option>
              <option value="FORMER">Former</option>
              <option value="CURRENT">Current</option>
            </select>
          </div>

          <div className="form-row">
            <label>Alcohol Use</label>
            <input type="text" name="alcohol_use" value={form.alcohol_use} onChange={handleChange} />
          </div>

          <div className="form-row">
            <label>Occupation</label>
            <input type="text" name="occupation" value={form.occupation} onChange={handleChange} />
          </div>

          <div className="form-row">
            <label>Contact Preference</label>
            <select name="contact_preference" value={form.contact_preference} onChange={handleChange}>
              <option value="">Select</option>
              <option value="EMAIL">Email</option>
              <option value="PHONE">Phone</option>
            </select>
          </div>

          <div className="form-row checkbox-row">
            <input type="checkbox" name="consent_to_share" checked={form.consent_to_share} onChange={handleChange} />
            <label>I consent to share my medical info</label>
          </div>

          <button type="submit" className="save-btn">
            Save Profile
          </button>
        </form>
      </div>
    </div>
  );
};

export default Profile;
