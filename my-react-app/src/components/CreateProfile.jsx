// src/components/CreateProfile.jsx
import React, { useState, useEffect } from "react";
import "./CreateProfile.css";
import { useNavigate, useLocation } from "react-router-dom";

const API_URL = "https://ai-clinical-trial-matchmaker.onrender.com/patients/profile";
const PROFILE_API = "https://ai-clinical-trial-matchmaker.onrender.com/profile/me";

const CreateProfile = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const isEdit = new URLSearchParams(location.search).get("edit") === "true";

  const [originalData, setOriginalData] = useState(null);

  const [form, setForm] = useState({
    date_of_birth: "",
    gender: "",
    blood_group: "",
    height_cm: "",
    weight_kg: "",
    bmi: "",

    diagnoses: [],
    allergies: [],
    medications: [],
    vaccinations: [],
    family_history: [],

    smoking_status: "",
    alcohol_use: "",
    occupation: "",

    insurance: { provider: "", policy_number: "" },
    emergency_contact: { name: "", phone: "", relation: "" },

    prescreening: {
      chronic_illness: "",
      previous_surgery: "",
      on_medication: "",
      notes: "",
    },

    consent_to_share: false,
    contact_preference: "",
  });

  const [loading, setLoading] = useState(false);
  const [prefillLoading, setPrefillLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const dictToArray = (obj) => {
    if (!obj || typeof obj !== "object") return [];
    return Object.values(obj);
  };

  // Load existing profile for edit mode
  useEffect(() => {
    if (!isEdit) return;

    const loadProfile = async () => {
      setPrefillLoading(true);
      setError("");

      try {
        const token = localStorage.getItem("access_token");
        if (!token) {
          setError("You are not logged in.");
          setPrefillLoading(false);
          return;
        }

        const res = await fetch(PROFILE_API, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        });

        if (!res.ok) {
          let msg = "Failed to load existing profile.";
          try {
            const data = await res.json();
            if (data?.detail) msg = data.detail;
          } catch {
            // ignore
          }
          setError(msg);
          setPrefillLoading(false);
          return;
        }

        const data = await res.json();
        const p = data.patient_profile;

        if (!p) {
          setError("No existing patient profile found.");
          setPrefillLoading(false);
          return;
        }

        const prefill = {
          date_of_birth: p.date_of_birth || "",
          gender: p.gender || "",
          blood_group: p.blood_group || "",
          height_cm: p.height_cm ?? "",
          weight_kg: p.weight_kg ?? "",
          bmi: p.bmi ?? "",

          diagnoses: dictToArray(p.diagnoses),
          allergies: dictToArray(p.allergies),
          medications: dictToArray(p.medications),
          vaccinations: dictToArray(p.vaccinations),
          family_history: dictToArray(p.family_history),

          smoking_status: p.smoking_status || "",
          alcohol_use: p.alcohol_use || "",
          occupation: p.occupation || "",

          insurance: p.insurance || { provider: "", policy_number: "" },
          emergency_contact: p.emergency_contact || {
            name: "",
            phone: "",
            relation: "",
          },

          prescreening: p.prescreening || {
            chronic_illness: "",
            previous_surgery: "",
            on_medication: "",
            notes: "",
          },

          consent_to_share: !!p.consent_to_share,
          contact_preference: p.contact_preference || "",
        };

        setForm(prefill);
        setOriginalData(prefill);
      } catch (err) {
        console.error("Error loading profile:", err);
        setError("Network error while loading existing profile.");
      } finally {
        setPrefillLoading(false);
      }
    };

    loadProfile();
  }, [isEdit]);

  // Handlers
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === "checkbox") {
      setForm((p) => ({ ...p, [name]: checked }));
    } else {
      setForm((p) => ({ ...p, [name]: value }));
    }
  };

  const updateBMI = (height, weight) => {
    const h = parseFloat(height);
    const w = parseFloat(weight);
    if (h > 0 && w > 0) {
      const meters = h / 100;
      const bmiVal = w / (meters * meters);
      return +bmiVal.toFixed(2);
    }
    return "";
  };

  const handleHWChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => {
      const next = { ...p, [name]: value };
      next.bmi = updateBMI(next.height_cm, next.weight_kg);
      return next;
    });
  };

  const addItem = (field) => {
    setForm((p) => ({ ...p, [field]: [...p[field], ""] }));
  };

  const updateItem = (field, idx, value) => {
    setForm((p) => {
      const arr = [...p[field]];
      arr[idx] = value;
      return { ...p, [field]: arr };
    });
  };

  const removeItem = (field, idx) => {
    setForm((p) => {
      const arr = [...p[field]];
      arr.splice(idx, 1);
      return { ...p, [field]: arr };
    });
  };

  const updateInsurance = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({
      ...p,
      insurance: { ...p.insurance, [name]: value },
    }));
  };

  const updateEmergency = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({
      ...p,
      emergency_contact: { ...p.emergency_contact, [name]: value },
    }));
  };

  const updatePrescreening = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({
      ...p,
      prescreening: { ...p.prescreening, [name]: value },
    }));
  };

  const arrayToObject = (arr) => {
    const obj = {};
    arr.forEach((val, idx) => {
      if (val !== undefined && val !== null && String(val).trim() !== "") {
        const text = String(val).trim();
        let key = text.slice(0, 40) || `item_${idx}`;
        let uniqueKey = key;
        let i = 1;
        while (Object.prototype.hasOwnProperty.call(obj, uniqueKey)) {
          uniqueKey = `${key}_${i++}`;
        }
        obj[uniqueKey] = text;
      }
    });
    return obj;
  };

  const buildPayload = () => {
    const heightVal =
      form.height_cm !== "" && form.height_cm !== null
        ? Number(form.height_cm)
        : null;
    const weightVal =
      form.weight_kg !== "" && form.weight_kg !== null
        ? Number(form.weight_kg)
        : null;

    const bmiVal =
      form.bmi !== "" && form.bmi !== null
        ? Number(form.bmi)
        : heightVal && weightVal
        ? updateBMI(heightVal, weightVal)
        : null;

    return {
      date_of_birth: form.date_of_birth || null,
      gender: form.gender || null,
      blood_group: form.blood_group || null,
      height_cm: heightVal,
      weight_kg: weightVal,
      bmi: bmiVal,
      diagnoses: arrayToObject(form.diagnoses),
      allergies: arrayToObject(form.allergies),
      medications: arrayToObject(form.medications),
      vaccinations: arrayToObject(form.vaccinations),
      family_history: arrayToObject(form.family_history),
      smoking_status: form.smoking_status || null,
      alcohol_use: form.alcohol_use || null,
      occupation: form.occupation || null,
      insurance: {
        provider: form.insurance.provider || null,
        policy_number: form.insurance.policy_number || null,
      },
      emergency_contact: {
        name: form.emergency_contact.name || null,
        phone: form.emergency_contact.phone || null,
        relation: form.emergency_contact.relation || null,
      },
      prescreening: {
        chronic_illness: form.prescreening.chronic_illness || null,
        previous_surgery: form.prescreening.previous_surgery || null,
        on_medication: form.prescreening.on_medication || null,
        notes: form.prescreening.notes || null,
      },
      consent_to_share: !!form.consent_to_share,
      contact_preference: form.contact_preference || null,
    };
  };

  const getChangedFields = (payload) => {
    if (!originalData) return payload;
    const diff = {};
    Object.keys(payload).forEach((key) => {
      const newVal = payload[key];
      const oldVal = originalData[key];
      if (JSON.stringify(newVal) !== JSON.stringify(oldVal)) {
        diff[key] = newVal;
      }
    });
    return diff;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMsg("");
    setLoading(true);

    try {
      const token = localStorage.getItem("access_token");
      if (!token) {
        setError("You are not logged in.");
        setLoading(false);
        return;
      }

      let payload = buildPayload();
      const method = isEdit ? "PATCH" : "POST";

      if (isEdit) {
        payload = getChangedFields(payload);
      }

      const res = await fetch(API_URL, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        let msg = `Failed to save profile (status ${res.status})`;
        try {
          const data = await res.json();
          if (data?.detail) msg = data.detail;
          else if (data?.message) msg = data.message;
        } catch {
          try {
            const text = await res.text();
            if (text) msg = text;
          } catch {
            // ignore
          }
        }
        setError(msg);
        return;
      }

      setSuccessMsg(
        isEdit ? "Profile updated successfully." : "Profile created successfully."
      );

      setTimeout(() => {
        navigate("/home");
      }, 700);
    } catch (err) {
      console.error("Network or unexpected error:", err);
      setError("Network error occurred while submitting profile.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-profile-container">
      <form
        className="create-profile-form"
        onSubmit={handleSubmit}
        aria-live="polite"
      >
        <h1>
          {isEdit ? "Edit Your Medical Profile" : "Create Your Medical Profile"}
        </h1>

        {prefillLoading && (
          <div className="status-text info">Loading existing profile...</div>
        )}
        {error && <div className="status-text error">{error}</div>}
        {successMsg && <div className="status-text success">{successMsg}</div>}

        {/* Personal Info */}
        <section className="section">
          <h2>Personal Information</h2>

          <div className="row">
            <label htmlFor="date_of_birth">Date of Birth *</label>
            <input
              id="date_of_birth"
              type="date"
              name="date_of_birth"
              value={form.date_of_birth}
              onChange={handleChange}
              required
            />
          </div>

          <div className="row">
            <label htmlFor="gender">Gender *</label>
            <select
              id="gender"
              name="gender"
              value={form.gender}
              onChange={handleChange}
              required
            >
              <option value="">Select</option>
              <option value="MALE">Male</option>
              <option value="FEMALE">Female</option>
              <option value="OTHER">Other</option>
            </select>
          </div>

          <div className="row">
            <label htmlFor="blood_group">Blood Group *</label>
            <select
              id="blood_group"
              name="blood_group"
              value={form.blood_group}
              onChange={handleChange}
              required
            >
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

          <div className="row">
            <label htmlFor="height_cm">Height (cm)</label>
            <input
              id="height_cm"
              type="number"
              name="height_cm"
              min="0"
              step="any"
              value={form.height_cm}
              onChange={handleHWChange}
            />
          </div>

          <div className="row">
            <label htmlFor="weight_kg">Weight (kg)</label>
            <input
              id="weight_kg"
              type="number"
              name="weight_kg"
              min="0"
              step="any"
              value={form.weight_kg}
              onChange={handleHWChange}
            />
          </div>

          <div className="row">
            <label>BMI (Auto)</label>
            <input type="text" value={form.bmi || ""} readOnly />
          </div>
        </section>

        {/* Dynamic List Section */}
        {["diagnoses", "allergies", "medications", "vaccinations", "family_history"].map(
          (field) => (
            <section className="section" key={field}>
              <h2>{field.replace("_", " ").toUpperCase()}</h2>

              {form[field].length === 0 && (
                <div className="muted">No entries yet.</div>
              )}

              {form[field].map((item, idx) => (
                <div className="list-row" key={`${field}-${idx}`}>
                  <input
                    type="text"
                    aria-label={`${field} ${idx + 1}`}
                    value={item}
                    onChange={(e) => updateItem(field, idx, e.target.value)}
                    placeholder={`Enter ${field.replace("_", " ")}...`}
                  />
                  <button
                    type="button"
                    className="remove-btn"
                    onClick={() => removeItem(field, idx)}
                    aria-label="Remove"
                  >
                    ✕
                  </button>
                </div>
              ))}

              <button
                type="button"
                className="add-btn"
                onClick={() => addItem(field)}
              >
                + Add
              </button>
            </section>
          )
        )}

        {/* Lifestyle */}
        <section className="section">
          <h2>Lifestyle Details</h2>

          <div className="row">
            <label>Smoking Status</label>
            <select
              name="smoking_status"
              value={form.smoking_status}
              onChange={handleChange}
            >
              <option value="">Select</option>
              <option value="NEVER">Never</option>
              <option value="FORMER">Former</option>
              <option value="CURRENT">Current</option>
            </select>
          </div>

          <div className="row">
            <label>Alcohol Use</label>
            <input
              type="text"
              name="alcohol_use"
              value={form.alcohol_use}
              onChange={handleChange}
            />
          </div>

          <div className="row">
            <label>Occupation</label>
            <input
              type="text"
              name="occupation"
              value={form.occupation}
              onChange={handleChange}
            />
          </div>
        </section>

        {/* Insurance */}
        <section className="section">
          <h2>Insurance Information</h2>

          <div className="row">
            <label>Provider</label>
            <input
              type="text"
              name="provider"
              value={form.insurance.provider}
              onChange={updateInsurance}
            />
          </div>

          <div className="row">
            <label>Policy Number</label>
            <input
              type="text"
              name="policy_number"
              value={form.insurance.policy_number}
              onChange={updateInsurance}
            />
          </div>
        </section>

        {/* Emergency Contact */}
        <section className="section">
          <h2>Emergency Contact</h2>

          <div className="row">
            <label>Name</label>
            <input
              type="text"
              name="name"
              value={form.emergency_contact.name}
              onChange={updateEmergency}
            />
          </div>

          <div className="row">
            <label>Phone</label>
            <input
              type="tel"
              name="phone"
              value={form.emergency_contact.phone}
              onChange={updateEmergency}
            />
          </div>

          <div className="row">
            <label>Relation</label>
            <input
              type="text"
              name="relation"
              value={form.emergency_contact.relation}
              onChange={updateEmergency}
            />
          </div>
        </section>

        {/* Prescreening */}
        <section className="section">
          <h2>Pre-Screening</h2>

          <div className="row">
            <label>Chronic illness?</label>
            <select
              name="chronic_illness"
              value={form.prescreening.chronic_illness}
              onChange={updatePrescreening}
            >
              <option value="">Select</option>
              <option value="Yes">Yes</option>
              <option value="No">No</option>
            </select>
          </div>

          <div className="row">
            <label>Previous surgery?</label>
            <select
              name="previous_surgery"
              value={form.prescreening.previous_surgery}
              onChange={updatePrescreening}
            >
              <option value="">Select</option>
              <option value="Yes">Yes</option>
              <option value="No">No</option>
            </select>
          </div>

          <div className="row">
            <label>On medications?</label>
            <select
              name="on_medication"
              value={form.prescreening.on_medication}
              onChange={updatePrescreening}
            >
              <option value="">Select</option>
              <option value="Yes">Yes</option>
              <option value="No">No</option>
            </select>
          </div>

          <div className="row">
            <label>Notes</label>
            <input
              type="text"
              name="notes"
              value={form.prescreening.notes}
              onChange={updatePrescreening}
            />
          </div>
        </section>

        {/* Consent */}
        <section className="section">
          <h2>Consent</h2>

          <div className="row checkbox">
            <input
              id="consent_to_share"
              type="checkbox"
              name="consent_to_share"
              checked={form.consent_to_share}
              onChange={handleChange}
            />
            <label htmlFor="consent_to_share">
              I consent to share data for trial matching.
            </label>
          </div>

          <div className="row">
            <label>Contact Preference</label>
            <select
              name="contact_preference"
              value={form.contact_preference}
              onChange={handleChange}
            >
              <option value="">Select</option>
              <option value="EMAIL">Email</option>
              <option value="PHONE">Phone</option>
              <option value="SMS">SMS</option>
            </select>
          </div>
        </section>

        <button type="submit" className="submit-btn" disabled={loading}>
          {loading
            ? "Saving…"
            : isEdit
            ? "Update Profile"
            : "Submit Profile"}
        </button>
      </form>
    </div>
  );
};

export default CreateProfile;
