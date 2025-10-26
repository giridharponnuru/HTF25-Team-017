import React from "react";
import "./Landing.css";
import { useNavigate } from "react-router-dom";

function Landing() {
  const navigate = useNavigate();

  return (
    <div className="landing-container">
      <h1 className="landing-title">Inorganic Waste</h1>
      <p className="landing-subtitle">Smart Waste Management System</p>

      <div className="button-group">
        <button onClick={() => navigate("/citizen-auth")}>
          Login as Citizen
        </button>
        <button onClick={() => navigate("/admin-auth")}>
          Login as Admin
        </button>
      </div>
    </div>
  );
}

export default Landing;
