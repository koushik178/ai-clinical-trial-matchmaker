import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";
import loginImage from "../assets/login.png";

function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    onLogin(email, password);
    if (email === "koushik@gmail.com" && password === "12345") {
      navigate("/home");
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
        <form className="login-form" onSubmit={handleSubmit}>
          <label htmlFor="email">Your email address</label>
          <input
            type="email"
            id="email"
            placeholder="user@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            placeholder="****************"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button type="submit" className="login-button">
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;
