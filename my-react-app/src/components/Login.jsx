import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";
import loginImage from "../assets/login.png";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await fetch(
        "https://ai-clinical-trial-matchmaker.onrender.com/users/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            accept: "application/json",
          },
          body: JSON.stringify({ email, password }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Invalid login credentials");
        return;
      }

      localStorage.setItem("access_token", data.access_token);
      localStorage.setItem("user_id", data.user_id);
      localStorage.setItem("email", data.email);
      localStorage.setItem("first_name", data.first_name);
      localStorage.setItem("last_name", data.last_name);

      navigate("/home");
    } catch (err) {
      setError("Login failed. Try again.");
    }
  };

  return (
    <div className="login-container">
      <div className="login-left">
        <div className="logo">TrialMatcher</div>
        <img src={loginImage} alt="Login Illustration" className="login-image" />
      </div>

      <div className="login-right">
        <h2 className="login-title">Log in</h2>

        {error && <p style={{ color: "red" }}>{error}</p>}

        <form className="login-form" onSubmit={handleLogin}>
          <label>Your email address</label>
          <input
            type="email"
            placeholder="user@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <label>Password</label>
          <input
            type="password"
            placeholder="****************"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button type="submit" className="login-button">
            Sign In
          </button>

          <p className="login-signup-link">
            Don’t have an account?{" "}
            <a href="/signup" className="link-text">
              Create one
            </a>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Login;
