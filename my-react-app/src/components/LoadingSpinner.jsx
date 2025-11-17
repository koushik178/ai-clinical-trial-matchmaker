// LoadingSpinner.jsx
import React from "react";
import "./LoadingSpinner.css";

const LoadingSpinner = ({ size = 40 }) => {
  return (
    <div className="spinner" style={{ width: size, height: size }}>
      <svg viewBox="0 0 50 50">
        <circle className="path" cx="25" cy="25" r="20" fill="none" strokeWidth="4"></circle>
      </svg>
    </div>
  );
};

export default LoadingSpinner;
