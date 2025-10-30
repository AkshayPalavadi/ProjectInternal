import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import "./Login.css";
import logo from "../assets/logo.jpg";

export default function ResetPassword() {
  const [email, setEmail] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  // ✅ Ensure default users are stored in localStorage if missing
  useEffect(() => {
    const storedUsers = JSON.parse(localStorage.getItem("users"));
    if (!storedUsers || storedUsers.length === 0) {
      const defaultUsers = [
        { id: 1, role: "admin", name: "admin", email: "admin@dhatvibs.com", password: "password123" },
        { id: 2, role: "employee", name: "Akshay", email: "akshay@dhatvibs.com", password: "password123" },
        { id: 3, role: "employee", name: "Sathvika", email: "sathvika@dhatvibs.com", password: "password123" },
        { id: 4, role: "employee", name: "Sravani", email: "sravani@dhatvibs.com", password: "password123" },
      ];
      localStorage.setItem("users", JSON.stringify(defaultUsers));
    }
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();

    const users = JSON.parse(localStorage.getItem("users")) || [];
    const userIndex = users.findIndex((u) => u.email === email);

    if (userIndex === -1) {
      setMessage("❌ Email not found.");
      return;
    }

    if (users[userIndex].password !== currentPassword) {
      setMessage("❌ Current password is incorrect.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setMessage("❌ New passwords do not match.");
      return;
    }

    if (newPassword.length < 6) {
      setMessage("❌ Password must be at least 6 characters long.");
      return;
    }

    // ✅ Update password
    users[userIndex].password = newPassword;
    localStorage.setItem("users", JSON.stringify(users));

    setMessage("✅ Password updated successfully!");
    setTimeout(() => navigate("/login"), 1500);
  };

  const handleSendMail = () => {
    setMessage("📩 A password reset request has been sent to your registered email.");
  };

  return (
    <div className="login-main-container">
      <div className="headerlogin">
        <img src={logo} alt="logo" />
        <div className="title">
          <h1>DhaTvi Business Solutions Pvt.LTD</h1>
          <p style={{ paddingTop: "15px" }}>
            <i>Driving Technology Delivering Trust</i>
          </p>
        </div>
      </div>
      <hr />

      <div className="login-container">
        <form className="login-form" onSubmit={handleSubmit} autoComplete="off">
          {/* Fake hidden inputs to block autofill */}
          <input type="text" name="fakeusernameremembered" style={{ display: "none" }} />
          <input type="password" name="fakepasswordremembered" style={{ display: "none" }} />

          <h1 className="heading">Reset Password</h1>

          <label>Email ID:</label>
          <input
            type="email"
            placeholder="Enter your registered email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="new-email"
          />

          <label>Current Password:</label>
          <div className="password-input">
            <input
              type={showCurrent ? "text" : "password"}
              placeholder="Enter current password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              required
              autoComplete="new-password"
            />
            <span onClick={() => setShowCurrent(!showCurrent)} className="eye-icon">
              {showCurrent ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>

          <label>New Password:</label>
          <div className="password-input">
            <input
              type={showNew ? "text" : "password"}
              placeholder="Enter new password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              autoComplete="new-password"
            />
            <span onClick={() => setShowNew(!showNew)} className="eye-icon">
              {showNew ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>

          <label>Re-enter New Password:</label>
          <div className="password-input">
            <input
              type={showConfirm ? "text" : "password"}
              placeholder="Re-enter new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              autoComplete="new-password"
            />
            <span onClick={() => setShowConfirm(!showConfirm)} className="eye-icon">
              {showConfirm ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>

          {message && (
            <p style={{ color: message.includes("✅") ? "green" : "red" }}>{message}</p>
          )}

          <button type="submit">Update Password</button>

          <div className="reset-password-link" style={{ marginTop: "15px", textAlign: "center" }}>
            <p>
              Forgot password?{" "}
              <span
                onClick={handleSendMail}
                style={{ color: "#4a90e2", cursor: "pointer", textDecoration: "underline" }}
              >
                Send request
              </span>
            </p>
          </div>

          <div style={{ textAlign: "center", marginTop: "20px" }}>
            <Link to="/login" style={{ color: "#4a90e2", textDecoration: "underline", fontWeight: "500" }}>
              Go to Login Page
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
