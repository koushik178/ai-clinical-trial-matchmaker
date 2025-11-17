import React, { useState } from "react";
import "./CreateProfile.css";
import { useNavigate } from "react-router-dom";

const API_URL = "https://ai-clinical-trial-matchmaker.onrender.com/patients/profile";

const CreateProfile = () => {
  const navigate = useNavigate();

  // Form state
  const [form, setForm] = useState({
    date_of_birth: "",
    gender: "",
    blood_group: "",
    height_cm: "",
    weight_kg: "",
    bmi: "",

    // kept as arrays for UI convenience, converted to objects for payload
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
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  // Basic change handler (string fields)
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === "checkbox") {
      setForm((p) => ({ ...p, [name]: checked }));
      return;
    }
    setForm((p) => ({ ...p, [name]: value }));
  };

  // Height/weight handlers that auto-calc BMI
  const updateBMI = (height, weight) => {
    const h = parseFloat(height);
    const w = parseFloat(weight);
    if (h > 0 && w > 0) {
      const meters = h / 100;
      const bmi = w / (meters * meters);
      return +bmi.toFixed(2);
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

  // Dynamic list handlers (diagnoses, allergies, etc.)
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

  // Insurance / emergency / prescreening updaters
  const updateInsurance = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, insurance: { ...p.insurance, [name]: value } }));
  };

  const updateEmergency = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, emergency_contact: { ...p.emergency_contact, [name]: value } }));
  };

  const updatePrescreening = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, prescreening: { ...p.prescreening, [name]: value } }));
  };

  // helper: convert array -> object with non-empty entries
  const arrayToObject = (arr) => {
    const obj = {};
    arr.forEach((val, idx) => {
      if (val !== undefined && val !== null && String(val).trim() !== "") {
        // use the entered text as key if short; otherwise numeric key
        const keyCandidate = String(val).trim().slice(0, 40);
        // ensure unique key (in case duplicates)
        const key = keyCandidate || `item_${idx}`;
        let uniqueKey = key;
        let i = 1;
        while (Object.prototype.hasOwnProperty.call(obj, uniqueKey)) {
          uniqueKey = `${key}_${i++}`;
        }
        obj[uniqueKey] = String(val).trim();
      }
    });
    return obj;
  };

  // Prepare and submit payload
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMsg("");
    setLoading(true);

    try {
      // Ensure numeric fields are numbers or null
      const heightVal = form.height_cm !== "" ? Number(form.height_cm) : null;
      const weightVal = form.weight_kg !== "" ? Number(form.weight_kg) : null;
      const bmiVal =
        form.bmi !== "" ? Number(form.bmi) : heightVal && weightVal ? updateBMI(heightVal, weightVal) : null;

      // convert lists to objects (expected JSONB dict)
      const payload = {
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
        prescreening:
          (form.prescreening && Object.keys(form.prescreening).length)
            ? {
                chronic_illness: form.prescreening.chronic_illness || null,
                previous_surgery: form.prescreening.previous_surgery || null,
                on_medication: form.prescreening.on_medication || null,
                notes: form.prescreening.notes || null,
              }
            : {},
        consent_to_share: !!form.consent_to_share, // always boolean
        contact_preference: form.contact_preference || null,
      };

      // Post to backend
      const token = localStorage.getItem("access_token");
      const res = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        const json = await res.json();
        setSuccessMsg("Profile created successfully.");
        // small delay so user sees success message
        setTimeout(() => {
          navigate("/home");
        }, 700);
      } else {
        // attempt to parse error details
        let text = `Failed to create profile (status ${res.status})`;
        try {
          const errJSON = await res.json();
          if (errJSON && (errJSON.detail || errJSON.error || errJSON.message)) {
            text = errJSON.detail || errJSON.error || errJSON.message;
          }
        } catch (parseErr) {
          // ignore parse error
        }
        setError(text);
      }
    } catch (err) {
      console.error(err);
      setError("Network or unexpected error happened while submitting profile.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-profile-container">
      <form className="create-profile-form" onSubmit={handleSubmit} aria-live="polite">
        <h1>Create Your Medical Profile</h1>

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
            <select id="gender" name="gender" value={form.gender} onChange={handleChange} required>
              <option value="">Select</option>
              <option value="MALE">Male</option>
              <option value="FEMALE">Female</option>
              <option value="OTHER">Other</option>
            </select>
          </div>

          <div className="row">
            <label htmlFor="blood_group">Blood Group *</label>
            <select id="blood_group" name="blood_group" value={form.blood_group} onChange={handleChange} required>
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
        {["diagnoses", "allergies", "medications", "vaccinations", "family_history"].map((field) => (
          <section className="section" key={field}>
            <h2>{field.replace("_", " ").toUpperCase()}</h2>

            {form[field].length === 0 && <div className="muted">No entries yet.</div>}

            {form[field].map((item, idx) => (
              <div className="list-row" key={idx}>
                <input
                  type="text"
                  aria-label={`${field} ${idx + 1}`}
                  value={item}
                  onChange={(e) => updateItem(field, idx, e.target.value)}
                  placeholder={`Enter ${field.replace("_", " ")}...`}
                />
                <button type="button" className="remove-btn" onClick={() => removeItem(field, idx)} aria-label="Remove">
                  ✕
                </button>
              </div>
            ))}

            <button type="button" className="add-btn" onClick={() => addItem(field)}>
              + Add
            </button>
          </section>
        ))}

        {/* Lifestyle */}
        <section className="section">
          <h2>Lifestyle Details</h2>

          <div className="row">
            <label>Smoking Status</label>
            <select name="smoking_status" value={form.smoking_status} onChange={handleChange}>
              <option value="">Select</option>
              <option value="NEVER">Never</option>
              <option value="FORMER">Former</option>
              <option value="CURRENT">Current</option>
            </select>
          </div>

          <div className="row">
            <label>Alcohol Use</label>
            <input type="text" name="alcohol_use" value={form.alcohol_use} onChange={handleChange} />
          </div>

          <div className="row">
            <label>Occupation</label>
            <input type="text" name="occupation" value={form.occupation} onChange={handleChange} />
          </div>
        </section>

        {/* Insurance */}
        <section className="section">
          <h2>Insurance Information</h2>

          <div className="row">
            <label>Provider</label>
            <input type="text" name="provider" value={form.insurance.provider} onChange={updateInsurance} />
          </div>

          <div className="row">
            <label>Policy Number</label>
            <input type="text" name="policy_number" value={form.insurance.policy_number} onChange={updateInsurance} />
          </div>
        </section>

        {/* Emergency Contact */}
        <section className="section">
          <h2>Emergency Contact</h2>

          <div className="row">
            <label>Name</label>
            <input type="text" name="name" value={form.emergency_contact.name} onChange={updateEmergency} />
          </div>

          <div className="row">
            <label>Phone</label>
            <input type="tel" name="phone" value={form.emergency_contact.phone} onChange={updateEmergency} />
          </div>

          <div className="row">
            <label>Relation</label>
            <input type="text" name="relation" value={form.emergency_contact.relation} onChange={updateEmergency} />
          </div>
        </section>

        {/* Prescreening */}
        <section className="section">
          <h2>Pre-Screening</h2>

          <div className="row">
            <label>Chronic illness?</label>
            <select name="chronic_illness" value={form.prescreening.chronic_illness} onChange={updatePrescreening}>
              <option value="">Select</option>
              <option value="Yes">Yes</option>
              <option value="No">No</option>
            </select>
          </div>

          <div className="row">
            <label>Previous surgery?</label>
            <select name="previous_surgery" value={form.prescreening.previous_surgery} onChange={updatePrescreening}>
              <option value="">Select</option>
              <option value="Yes">Yes</option>
              <option value="No">No</option>
            </select>
          </div>

          <div className="row">
            <label>On medications?</label>
            <select name="on_medication" value={form.prescreening.on_medication} onChange={updatePrescreening}>
              <option value="">Select</option>
              <option value="Yes">Yes</option>
              <option value="No">No</option>
            </select>
          </div>

          <div className="row">
            <label>Notes</label>
            <input type="text" name="notes" value={form.prescreening.notes} onChange={updatePrescreening} />
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
              onChange={(e) => setForm((p) => ({ ...p, consent_to_share: e.target.checked }))}
            />
            <label htmlFor="consent_to_share">I consent to share data for trial matching.</label>
          </div>

          <div className="row">
            <label>Contact Preference</label>
            <select name="contact_preference" value={form.contact_preference} onChange={handleChange}>
              <option value="">Select</option>
              <option value="EMAIL">Email</option>
              <option value="PHONE">Phone</option>
              <option value="SMS">SMS</option>
            </select>
          </div>
        </section>

        <button type="submit" className="submit-btn" disabled={loading}>
          {loading ? "Saving…" : "Submit Profile"}
        </button>
      </form>
    </div>
  );
};

export default CreateProfile;
