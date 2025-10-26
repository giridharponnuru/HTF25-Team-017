import React, { useState, useEffect } from "react";
import "./AdminAuth.css";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
} from "firebase/auth";
import { auth } from "../firebase";
import { useNavigate } from "react-router-dom";

function AdminAuth() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignup, setIsSignup] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  // Disable scroll for clean login view
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => (document.body.style.overflow = "auto");
  }, []);

  // Handle login/signup
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      if (isSignup) {
        await createUserWithEmailAndPassword(auth, email, password);
        setSuccess("Admin account created successfully! Please log in.");
        setIsSignup(false);
      } else {
        await signInWithEmailAndPassword(auth, email, password);
        navigate("/admin");
      }
    } catch (err) {
      console.error(err);
      setError("Invalid credentials or Firebase configuration issue.");
    }
  };

  // Forgot password handler
  const handleForgotPassword = async () => {
    if (!email) {
      alert("Please enter your email first.");
      return;
    }
    try {
      await sendPasswordResetEmail(auth, email);
      setSuccess("Password reset link sent to your email!");
    } catch (err) {
      console.error(err);
      setError("Error sending password reset email.");
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1 className="auth-title">Admin Login</h1>
        <p className="auth-subtitle">Manage Waste Pickup Requests</p>

        <form onSubmit={handleSubmit} className="auth-form">
          <h2>{isSignup ? "Sign Up" : "Login"}</h2>

          {error && <p className="error">{error}</p>}
          {success && <p className="success">{success}</p>}

          <input
            type="email"
            placeholder="Enter admin email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button type="submit" className="auth-btn">
            {isSignup ? "Sign Up" : "Login"}
          </button>

          <p className="link-text">
            {isSignup ? "Already have an account?" : "No account?"}{" "}
            <a
              onClick={() => setIsSignup(!isSignup)}
              className="link-click"
            >
              {isSignup ? "Login" : "Sign Up"}
            </a>
          </p>

          {!isSignup && (
            <a className="link-click forgot" onClick={handleForgotPassword}>
              Forgot Password?
            </a>
          )}
        </form>
      </div>
    </div>
  );
}

export default AdminAuth;
