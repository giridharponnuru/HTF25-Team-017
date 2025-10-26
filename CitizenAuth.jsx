import React, { useState, useEffect } from "react";
import "./CitizenAuth.css";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../firebase";
import { useNavigate } from "react-router-dom";

function CitizenAuth() {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleAuth = async () => {
    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
        navigate("/citizen");
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
        setMessage("Account created! You can log in now.");
      }
    } catch (error) {
      setMessage(error.message);
    }
  };

  const handleForgotPassword = async () => {
    if (!email) {
      setMessage("Enter your email to reset password");
      return;
    }
    try {
      await sendPasswordResetEmail(auth, email);
      setMessage("Password reset link sent to your email");
    } catch (error) {
      setMessage(error.message);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h2>Citizen Login</h2>
        <h3>Access Waste Pickup Portal</h3>

        <input
          type="email"
          placeholder="Enter email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Enter password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button onClick={handleAuth}>
          {isLogin ? "Login" : "Sign Up"}
        </button>

        {message && (
          <p className={message.includes("error") ? "error" : "success"}>{message}</p>
        )}

        <p className="toggle-text">
          {isLogin ? "No account?" : "Already have an account?"}{" "}
          <span onClick={() => setIsLogin(!isLogin)}>
            {isLogin ? "Sign Up" : "Login"}
          </span>
        </p>

        <p className="forgot-password" onClick={handleForgotPassword}>
          Forgot Password?
        </p>
      </div>
    </div>
  );
}

export default CitizenAuth;
