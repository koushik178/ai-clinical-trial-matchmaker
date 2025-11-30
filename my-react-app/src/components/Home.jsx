import React, { useEffect, useState } from "react";
import "./Home.css";
import profilePic from "../assets/login.png";
import Sidebar from "./Sidebar";
import { jsPDF } from "jspdf"; // make sure jspdf is installed

// ---------- UTIL: AGE ----------
const calculateAge = (dob) => {
  if (!dob) return "N/A";
  const d = new Date(dob);
  const t = new Date();
  let age = t.getFullYear() - d.getFullYear();
  const m = t.getMonth() - d.getMonth();
  if (m < 0 || (m === 0 && t.getDate() < d.getDate())) age--;
  return age;
};

// ---------- UTIL: SAFE MEDICAL EXTRACTION ----------
const extractMedicalInfo = (profile) => {
  if (!profile) {
    return {
      diagnosis: "General Health",
      allergies: [],
      medications: [],
      primaryMedicationText:
        "No medications recorded. Update your profile if you take any medication.",
      emergencyName: "N/A",
    };
  }

  const diagnosesObj = profile.diagnoses || {};
  const allergiesObj = profile.allergies || {};
  const medicationsObj = profile.medications || {};
  const emergencyName = profile?.emergency_contact?.name || "N/A";

  const diagnosis =
    Object.keys(diagnosesObj)[0] || "General Health";

  const allergies = Object.keys(allergiesObj);

  const medicationNames = Object.keys(medicationsObj);

  let primaryMedicationText =
    "No medications recorded. Update your profile if you take any medication.";

  if (medicationNames.length > 0) {
    const first = medicationNames[0];
    const med = medicationsObj[first] || {};
    const dose = med.dose || "";
    const freq = med.frequency || "";
    primaryMedicationText = `Take ${first}${
      dose ? ` (${dose})` : ""
    }${freq ? ` — ${freq}` : ""}.`;
  }

  return {
    diagnosis,
    allergies,
    medications: medicationNames,
    primaryMedicationText,
    emergencyName,
  };
};

// ---------- UTIL: DAILY TIP ----------
const fetchExternalHealthTip = async (condition) => {
  try {
    const res = await fetch(
      `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(
        condition
      )}`
    );
    if (!res.ok) return "Stay healthy today.";

    const data = await res.json();
    if (data.extract) {
      const line = data.extract.split(". ")[0];
      return line.endsWith(".") ? line : line + ".";
    }
    return "Stay healthy today.";
  } catch {
    return "Stay healthy today.";
  }
};

// ---------- UTIL: AI INSIGHTS ----------
const fetchDiagnosisInsights = async (condition) => {
  try {
    const res = await fetch(
      `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(
        condition
      )}`
    );
    if (!res.ok) {
      return [
        "Maintain a healthy lifestyle.",
        "Monitor and avoid symptom triggers.",
        "Consult healthcare providers regularly.",
      ];
    }

    const data = await res.json();
    if (!data.extract) {
      return [
        "Maintain a healthy lifestyle.",
        "Avoid environmental triggers.",
        "Consider regular preventive care.",
      ];
    }

    const sentences = data.extract.split(". ").filter(Boolean).slice(0, 3);
    return sentences.map((s) => (s.endsWith(".") ? s : s + "."));
  } catch {
    return [
      "Maintain a healthy lifestyle.",
      "Avoid symptom triggers.",
      "Follow medical guidance regularly.",
    ];
  }
};

// ---------- DEMO LABS ----------
const demoLabs = [
  {
    name: "Hemoglobin",
    value: "13.8",
    unit: "g/dL",
    range: "13.0–17.0",
    flag: "normal",
  },
  {
    name: "Glucose (Fasting)",
    value: "112",
    unit: "mg/dL",
    range: "70–99",
    flag: "high",
  },
  {
    name: "Cholesterol",
    value: "185",
    unit: "mg/dL",
    range: "< 200",
    flag: "normal",
  },
];

// ---------- HEALTH SCORE ----------
const computeHealthScore = (profile) => {
  if (!profile) return 50;

  let score = 85;

  const bmi = profile.bmi;
  if (bmi) {
    if (bmi < 18.5 || bmi > 30) score -= 15;
    else if (bmi < 20 || bmi > 27) score -= 5;
  }

  if (demoLabs.some((lab) => lab.flag === "high")) score -= 5;

  return Math.max(0, Math.min(100, score));
};

const Home = () => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);

  const [dailyTip, setDailyTip] = useState("");
  const [diagnosisInsights, setDiagnosisInsights] = useState([]);
  const [healthScore, setHealthScore] = useState(50);

  // ---------- PDF GENERATION ----------
  const generatePDF = () => {
    if (!user || !profile) return;

    const med = extractMedicalInfo(profile);
    const doc = new jsPDF();
    let y = 20;

    const titleName = user.first_name || "User";
    const fileName = `${titleName}MedicalHistory.pdf`;

    doc.setFont("helvetica", "bold");
    doc.setFontSize(20);
    doc.text(`${titleName}'s Medical History`, 20, y);
    y += 12;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(12);

    const fields = [
      ["Name", `${user.first_name || ""} ${user.last_name || ""}`.trim()],
      ["Age", profile.age || calculateAge(profile.date_of_birth)],
      ["Gender", profile.gender || "N/A"],
      ["Blood Group", profile.blood_group || "N/A"],
      ["Condition", med.diagnosis || "N/A"],
      [
        "Diagnoses",
        Object.keys(profile.diagnoses || {}).join(", ") || "N/A",
      ],
      ["Allergies", med.allergies.join(", ") || "N/A"],
      ["Medications", med.medications.join(", ") || "N/A"],
      ["Emergency Contact Name", med.emergencyName || "N/A"],
    ];

    fields.forEach(([k, v]) => {
      doc.text(`${k}: ${v}`, 20, y);
      y += 8;
    });

    y += 8;
    doc.setFont("helvetica", "bold");
    doc.text("Lab Results (Demo):", 20, y);
    y += 10;

    doc.setFont("helvetica", "normal");
    demoLabs.forEach((lab) => {
      doc.text(
        `${lab.name}: ${lab.value} ${lab.unit} (Normal: ${lab.range})`,
        20,
        y
      );
      y += 8;
    });

    doc.save(fileName.replace(/\s+/g, ""));
  };

  // ---------- LOAD PROFILE ----------
  useEffect(() => {
    let intervalId;

    const load = async () => {
      try {
        const token = localStorage.getItem("access_token");
        if (!token) return;

        const res = await fetch(
          "https://ai-clinical-trial-matchmaker.onrender.com/profile/me",
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const data = await res.json();

        setUser(data.user || null);
        setProfile(data.patient_profile || null);

        if (data.patient_profile) {
          const med = extractMedicalInfo(data.patient_profile);
          const condition = med.diagnosis;

          setHealthScore(computeHealthScore(data.patient_profile));

          const firstTip = await fetchExternalHealthTip(condition);
          setDailyTip(firstTip);

          const insights = await fetchDiagnosisInsights(condition);
          setDiagnosisInsights(insights);

          intervalId = setInterval(async () => {
            const newTip = await fetchExternalHealthTip(condition);
            setDailyTip(newTip);
          }, 5 * 60 * 1000);
        }
      } catch (err) {
        console.error("Profile load failed:", err);
      }
    };

    load();

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, []);

  if (!user || !profile) {
    return <div style={{ padding: 40 }}>Loading...</div>;
  }

  const fullName = user.first_name || "User";
  const med = extractMedicalInfo(profile);

  const age =
    profile.age || calculateAge(profile.date_of_birth);

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  const scoreClass =
    healthScore >= 80 ? "good" : healthScore >= 50 ? "medium" : "poor";

  return (
    <div className="home-container">
      <Sidebar />

      {/* ---------- MAIN CONTENT ---------- */}
      <main className="main-content">
        <section className="welcome-box">
          <h2 className="welcome-title">Welcome, {fullName} 👋</h2>
          <p className="welcome-tip">Daily Health Tip: {dailyTip}</p>
          <p className="welcome-copy">
            Today is <strong>{today}</strong>. Stay engaged with your health
            journey.
          </p>
        </section>

        <div className="dashboard-sections">
          {/* Health Score */}
          <div className="dash-card health-score-card">
            <h3>Health Score</h3>
            <div className="health-score-wrapper">
              <div className={`health-score-circle ${scoreClass}`}>
                <span className="health-score-value">{healthScore}</span>
                <span className="health-score-max">/100</span>
              </div>
              <div className="health-score-text">
                <p>
                  This is an approximate wellness score based on your BMI,
                  diagnoses, lifestyle, and basic lab trends.
                </p>
                <p className="health-score-hint">
                  This is not a medical diagnosis. Always consult your healthcare
                  provider.
                </p>
              </div>
            </div>
          </div>

          {/* Labs */}
          <div className="dash-card">
            <h3>Recent Lab Results (Demo)</h3>
            {demoLabs.map((lab) => (
              <div key={lab.name} className="lab-row">
                <div className="lab-main">
                  <span className="lab-name">{lab.name}</span>
                  <span className="lab-value">
                    {lab.value} {lab.unit}
                  </span>
                </div>
                <div className="lab-meta">
                  <span className="lab-range">Normal: {lab.range}</span>
                  <span className={`lab-flag lab-flag-${lab.flag}`}>
                    {lab.flag === "high" ? "High" : "Normal"}
                  </span>
                </div>
              </div>
            ))}
            <p className="lab-note">
              These values are demo placeholders. You can connect real lab data in
              a future update.
            </p>
          </div>

          {/* AI Insights */}
          <div className="dash-card">
            <h3>AI Insights for {med.diagnosis}</h3>
            {diagnosisInsights.length === 0 ? (
              <p className="empty-text">
                Insights are not available right now. Try again later.
              </p>
            ) : (
              <ul className="insights-list">
                {diagnosisInsights.map((line, idx) => (
                  <li key={idx}>{line}</li>
                ))}
              </ul>
            )}
          </div>

          {/* Medication Reminder (FULL WIDTH) */}
          <div className="dash-card medication-card full-width-card">
            <h3>Medication Reminder</h3>
            <p>{med.primaryMedicationText}</p>
          </div>
        </div>
      </main>

      {/* ---------- SIDEBAR ---------- */}
      <aside className="profile-panel">
        <div className="profile-card">
          <img src={profilePic} alt="Profile" />
          <h3 className="profile-name">{fullName}</h3>

          <div className="profile-section">
            <div className="profile-field">
              <div className="profile-field-label">Condition</div>
              <div className="profile-field-value">{med.diagnosis}</div>
            </div>
            <div className="profile-field">
              <div className="profile-field-label">Age</div>
              <div className="profile-field-value">{age}</div>
            </div>
          </div>

          <div className="profile-section">
            <div className="profile-field-label">Allergies</div>
            <ul className="sidebar-list">
              {med.allergies.length > 0 ? (
                med.allergies.map((a) => <li key={a}>{a}</li>)
              ) : (
                <li className="faded">N/A</li>
              )}
            </ul>
          </div>

          <div className="profile-section">
            <div className="profile-field-label">Emergency Contact Name</div>
            <div className="profile-field-value">
              {med.emergencyName || "N/A"}
            </div>
          </div>
        </div>

        <button className="download-btn" onClick={generatePDF}>
          Download Summary (PDF)
        </button>
      </aside>
    </div>
  );
};

export default Home;
