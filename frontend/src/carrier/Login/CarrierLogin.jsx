import React, { useState } from "react";
import logo from "../assets/dhatvi.jpg";
import "./Login.css";
import { useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import WelcomeImg from "../assets/team.jpg";

function Login({ onLoginSuccess }) {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [userInput, setUserInput] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [loading, setLoading] = useState(false);

  // Validate Email / Mobile
  const validateInput = (value) => {
    const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
    const isMobile = /^\d{10}$/.test(value);

    if (value === "") setError("");
    else if (isEmail || isMobile) setError("");
    else setError("Please enter a valid 10-digit mobile number or email.");

    setUserInput(value);
  };

  // Validate Password
  const validatePassword = (value) => {
    const passwordRegex =
      /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    if (value === "") setPasswordError("");
    else if (!passwordRegex.test(value))
      setPasswordError(
        "Password must include uppercase, lowercase, number & special character."
      );
    else setPasswordError("");

    setPassword(value);
  };

  // ------------------ LOGIN WITH API ------------------
const handleSubmit = async (e) => {
  e.preventDefault();

  const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userInput);
  const isMobile = /^\d{10}$/.test(userInput);

  if (!isEmail && !isMobile) {
    setError("Enter a valid email or 10-digit mobile number.");
    return;
  }

  if (passwordError || password === "") {
    setPasswordError("Please enter a valid password.");
    return;
  }



  try {
      setLoading(true);
    // 🔥 Correct payload based on backend structure
const payload = {
  loginId: userInput,
  password: password,
}

    console.log("📤 SENDING PAYLOAD TO API:", payload);

    const response = await fetch(
      "https://public-website-drab-ten.vercel.app/api/auth/login",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      }
    );

    let data = {};
    try {
      data = await response.json();
    } catch (err) {
      console.log("❌ Failed to parse JSON:", err);
    }

    console.log("📥 API RAW RESPONSE:", response);
    console.log("📥 API JSON BODY:", data);

    if (!response.ok) {
      alert(data.message || "Login failed");
      setLoading(false);
      return;
    }

    alert("Login successful!");
    localStorage.setItem("token", data.token);
    navigate("/carrier");

  } catch (err) {
    console.error("🔥 LOGIN ERROR:", err);
    alert("Something went wrong.");
  } finally {
    setLoading(false);
  }
};


  return (
    <div className="container">
      <div className="left-job">
        <div className="header-job">
          <img src={logo} alt="DhaTvi Logo" className="logo-img" />
          <h1>
            Login to <br />
            <span className="highlight">Unlock Opportunities</span>
          </h1>
        </div>
        <img src={WelcomeImg} alt="Welcome" className="welcomeimg" />
      </div>

      <div className="right">
        <h1>DhaTvi Business Solutions</h1>
        <p className="sub-text">Driving Technology Delivering Trust</p>

        <form className="login-form-job" onSubmit={handleSubmit}>
          <label>Email / Mobile Number</label>
          <input
            type="text"
            placeholder="Enter your email or mobile"
            value={userInput}
            onChange={(e) => validateInput(e.target.value)}
            required
          />
          {error && <p className="error-msg">{error}</p>}

          <label>Password</label>
          <div className="password-field">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              value={password}
              onChange={(e) => validatePassword(e.target.value)}
              required
            />
            <span
              className="view-icon"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>
          {passwordError && <p className="error-msg">{passwordError}</p>}

          <div className="forgot">
            <a href="#">Forgot Password?</a>
          </div>

          <button
            className="login-btn-Login"
            type="submit"
            disabled={!!error || !!passwordError || loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="create-account">
          Don't have an account?{" "}
          <span onClick={() => navigate("/register")} className="link">
            Create an Account
          </span>
        </p>
      </div>
    </div>
  );
}

export default Login;
