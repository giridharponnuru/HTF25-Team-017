import React, { useState, useEffect } from "react";
import "./Auth.css";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
} from "firebase/auth";
import { auth } from "../firebase";
import { useNavigate } from "react-router-dom";

function Auth() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignup, setIsSignup] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => (document.body.style.overflow = "auto");
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      if (isSignup) {
        await createUserWithEmailAndPassword(auth, email, password);
        setSuccess("Account created! Please log in.");
        setIsSignup(false);
      } else {
        await signInWithEmailAndPassword(auth, email, password);
        if (isAdmin) {
          navigate("/admin");
        } else {
          navigate("/citizen");
        }
      }
    } catch (err) {
      console.error(err);
      setError(err.message);
    }
  };

  const handleForgotPassword = async () => {
    if (!email) {
      alert("Enter your email to reset password.");
      return;
    }
    try {
      await sendPasswordResetEmail(auth, email);
      setSuccess("Password reset email sent!");
    } catch (err) {
      setError("Error sending reset email.");
      console.error(err);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1 className="auth-title">Inorganic Waste</h1>
        <p className="auth-subtitle">Smart Waste Management System</p>

        <form onSubmit={handleSubmit} className="auth-form">
          <h2>{isSignup ? "Sign Up" : "Login"}</h2>

          {error && <p className="error">{error}</p>}
          {success && <p className="success">{success}</p>}

          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <div className="toggle-container">
            <label>
              <input
                type="checkbox"
                checked={isAdmin}
                onChange={() => setIsAdmin(!isAdmin)}
              />
              Login as Admin
            </label>
          </div>

          <button type="submit" className="auth-btn">
            {isSignup ? "Sign Up" : "Login"}
          </button>

          <p className="link-text">
            {isSignup ? "Already have an account?" : "No account?"}{" "}
            <span
              onClick={() => setIsSignup(!isSignup)}
              className="link-click"
            >
              {isSignup ? "Login" : "Sign Up"}
            </span>
          </p>

          {!isSignup && (
            <p className="link-click forgot" onClick={handleForgotPassword}>
              Forgot Password?
            </p>
          )}
        </form>
      </div>
    </div>
  );
}

export default Auth;
