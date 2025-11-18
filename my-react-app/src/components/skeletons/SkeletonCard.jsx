// components/skeletons/SkeletonCard.jsx
import React from "react";
import "../skeletons/Skeleton.css";

const SkeletonCard = () => {
  return (
    <div className="skeleton-card">
      <div className="skeleton-thumb" />
      <div className="skeleton-body">
        <div className="skeleton-line short" />
        <div className="skeleton-line" />
        <div className="skeleton-line small" />
        <div className="skeleton-links">
          <div className="skeleton-pill" />
          <div className="skeleton-pill" />
        </div>
      </div>
    </div>
  );
};

export default SkeletonCard;
