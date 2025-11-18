import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Signup.css";
import loginImage from "../assets/login.png"; // same illustration for consistency

function Signup() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    role: "PATIENT",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const response = await fetch(
        "https://ai-clinical-trial-matchmaker.onrender.com/users/signup",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            accept: "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Signup failed. Try again.");
        return;
      }

      // Store token & user data
      localStorage.setItem("access_token", data.access_token);
      localStorage.setItem("user_id", data.user_id);
      localStorage.setItem("email", data.email);
      localStorage.setItem("first_name", data.first_name);
      localStorage.setItem("last_name", data.last_name);

      setSuccess("Signup successful!");

      setTimeout(() => navigate("/create-profile"), 500);
    } catch (err) {
      console.error(err);
      setError("Something went wrong.");
    }
  };

  return (
    <div className="signup-container">

      {/* LEFT SECTION */}
      <div className="signup-left">
        <div className="logo">TrialMatcher</div>
        <img src={loginImage} alt="Signup Illustration" className="signup-image" />
      </div>

      {/* RIGHT SECTION */}
      <div className="signup-right">
        <h2 className="signup-title">Create your account</h2>

        {error && <p className="error-text">{error}</p>}
        {success && <p className="success-text">{success}</p>}

        <form className="signup-form" onSubmit={handleSignup}>
          <label>First Name</label>
          <input
            type="text"
            name="first_name"
            placeholder="Aman"
            value={formData.first_name}
            onChange={handleChange}
            required
          />

          <label>Last Name</label>
          <input
            type="text"
            name="last_name"
            placeholder="Mujawar"
            value={formData.last_name}
            onChange={handleChange}
            required
          />

          <label>Email Address</label>
          <input
            type="email"
            name="email"
            placeholder="user@example.com"
            value={formData.email}
            onChange={handleChange}
            required
          />

          <label>Password</label>
          <input
            type="password"
            name="password"
            placeholder="********"
            value={formData.password}
            onChange={handleChange}
            required
          />

          <button type="submit" className="signup-button">
            Create Account
          </button>

          <p className="signup-login-link">
            Already have an account?{" "}
            <a href="/login" className="link-text">
              Log In
            </a>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Signup;
