import React from "react";
import { useNavigate } from "react-router-dom";
import { Player } from "@lottiefiles/react-lottie-player";
import "./Welcome.css";
// Optional fallback image if Lottie doesn't load
import welcomeImage from "../assets/login.png";

const Welcome = () => {
  const navigate = useNavigate();

  // Floating molecule icons
  const molecules = ["⚛️", "🧬", "💊", "⚕️"];

  return (
    <div className="welcome-container">
      {/* Floating molecules */}
      {[...Array(20)].map((_, i) => (
        <div
          key={i}
          className="molecule"
          style={{
            left: `${Math.random() * 100}%`,
            animationDuration: `${8 + Math.random() * 10}s`,
            animationDelay: `${Math.random() * 5}s`,
            fontSize: `${16 + Math.random() * 24}px`,
            content: molecules[Math.floor(Math.random() * molecules.length)],
          }}
        >
          {molecules[Math.floor(Math.random() * molecules.length)]}
        </div>
      ))}

      {/* Left Content */}
      <div className="welcome-left">
        <h1 className="welcome-title animate-slide-in">
          AI Clinical Trial Matchmaker
        </h1>
        <p className="welcome-subtitle animate-fade-in">
          Discover clinical trials tailored to your health needs. <br />
          Join, track, and manage your trial participation easily.
        </p>

        <div className="welcome-buttons animate-slide-in-delay">
          <button
            className="welcome-btn signup-btn"
            onClick={() => navigate("/signup")}
          >
            Create Account
          </button>
          <button
            className="welcome-btn login-btn"
            onClick={() => navigate("/login")}
          >
            Log In
          </button>
        </div>
      </div>

      {/* Right Panel: Lottie Animation */}
      <div className="welcome-right animate-fade-in-right">
        <Player
          autoplay
          loop
          src="https://assets9.lottiefiles.com/packages/lf20_j0flb2ad.json" // AI/medical futuristic animation
          style={{ height: "400px", width: "400px" }}
        />
        {/* Fallback image if needed */}
        {/* <img src={welcomeImage} alt="Welcome" className="welcome-image" /> */}
      </div>
    </div>
  );
};

export default Welcome;
