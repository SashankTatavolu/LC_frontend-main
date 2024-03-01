import React from "react";
import "../styles/Overview.css";

const Overview = ({ description, peopleCount }) => {
  return (
    <div className="overview-container">
      <h2>Project Overview</h2>
      <div className="overview-content">
        <p className="description">{description}</p>
        {typeof peopleCount !== "undefined" && (
          <div className="people-count">
            <strong>People Count:</strong> {peopleCount}
          </div>
        )}
      </div>
    </div>
  );
};

export default Overview;
