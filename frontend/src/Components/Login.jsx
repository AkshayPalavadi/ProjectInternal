import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import "./Login.css";
import logo from "../assets/logo.jpg";

function Login({ setIsLoggedIn, setUserRole }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("employee");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // ✅ Keep user logged in if token exists
  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedRole = localStorage.getItem("userRole");
    if (token && storedRole) {
      setIsLoggedIn(true);
      setUserRole(storedRole);
      navigate(storedRole === "admin" ? "/admin" : "/employee/home", { replace: true });
    }
  }, []);
  const checkIfUserExists = async (email) => {
  try {
    const res = await fetch(`https://internal-website-rho.vercel.app/api/auth/email/${email}`);
    const data = await res.json();
    console.log("✅ Check user API:", data);

    const exists = !!data.employee;

    // Preserve local truth of applicationSubmitted if we already have it
    const localSubmitted = localStorage.getItem("applicationSubmitted") === "true";
    const applicationSubmitted = data.employee?.applicationSubmitted || localSubmitted;

    return { exists, applicationSubmitted };
  } catch (err) {
    console.error("Error checking user existence:", err);
    return { exists: false, applicationSubmitted: false };
  }
};


const handleSubmit = async (e) => {
  e.preventDefault();
  setError("");

  if (!email.endsWith("@dhatvibs.com")) {
    setError("Only @dhatvibs.com email addresses are allowed.");
    return;
  }

  // ✅ Step 1: Check user existence
  const { exists, applicationSubmitted } = await checkIfUserExists(email);

  if (!exists) {
    alert("New user detected! Please fill out your profile form.");
    localStorage.setItem("applicationSubmitted", "false");
    navigate("/employee/profile");
    return;
  }

  // ✅ Step 2: Store application status for existing user
  localStorage.setItem("applicationSubmitted", applicationSubmitted ? "true" : "false");

  // ✅ Step 3: Proceed with login
  try {
    const response = await fetch("https://internal-website-rho.vercel.app/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const result = await response.json();
    console.log("📦 API Login Response:", result);

    if (response.ok) {
      setIsLoggedIn(true);
      setUserRole(role);
      if (result.token) localStorage.setItem("token", result.token);
      localStorage.setItem("userRole", role);
      localStorage.setItem("loginEmail", email);

      navigate(role === "admin" ? "/admin" : "/employee/home");
    } else {
      setError(result.msg || "Invalid email or password");
    }
  } catch (err) {
    console.error("🚨 API Error:", err);
    setError("Server not reachable. Please try again later.");
  }
};


  return (
    <div className="login-main-container">
      <div className="headerlogin">
        <img src={logo} alt="logo" />
        <div className="title">
          <h1>DhaTvi Business Solutions Pvt. Ltd.</h1>
          <p style={{ paddingTop: "15px" }}>
            <i>Driving Technology Delivering Trust</i>
          </p>
        </div>
      </div>
      <hr />
      <div className="login-container-employee">
        <form className="login-form-employee" onSubmit={handleSubmit}>
          <h1 className="heading-employee">Login</h1>

          <label>Select Role:</label>
          <select value={role} onChange={(e) => setRole(e.target.value)}>
            <option value="employee">Employee</option>
            <option value="admin">Admin</option>
          </select>

          <label>Email Id :</label>
          <input
            type="email"
            placeholder="Mail ID"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="off"
          />

          <label>Password :</label>
          <div className="password-input">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="off"
            />
            <span
              className="eye-icon"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>

          <div className="reset-password-link">
            <Link to="/reset-password">Reset Password?</Link>
          </div>

          {error && <p className="error">{error}</p>}

          <button type="submit">Login</button>

          <p className="register-link-text">
            Don’t have an account?{" "}
            <span
              className="register-link"
              onClick={() => navigate("/register")}
            >
              Register
            </span>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Login;
