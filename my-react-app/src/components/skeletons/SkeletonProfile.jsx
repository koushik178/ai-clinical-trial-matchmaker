// components/skeletons/SkeletonProfile.jsx
import React from "react";
import "../skeletons/Skeleton.css";

const SkeletonProfile = () => {
  return (
    <div className="skeleton-profile">
      <div className="skeleton-profile-top">
        <div className="skeleton-avatar" />
        <div className="skeleton-identity">
          <div className="skeleton-line big" />
          <div className="skeleton-line medium" />
        </div>
      </div>

      <div className="skeleton-section">
        <div className="skeleton-line medium" />
        <div className="skeleton-line" />
        <div className="skeleton-line" />
      </div>

      <div className="skeleton-section">
        <div className="skeleton-line medium" />
        <div className="skeleton-grid">
          <div className="skeleton-pill" />
          <div className="skeleton-pill" />
          <div className="skeleton-pill" />
          <div className="skeleton-pill" />
        </div>
      </div>

      <div className="skeleton-section">
        <div className="skeleton-line medium" />
        <div className="skeleton-line" />
        <div className="skeleton-line small" />
      </div>
    </div>
  );
};

export default SkeletonProfile;
